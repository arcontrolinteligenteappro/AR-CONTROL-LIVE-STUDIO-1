/**
 * SERVICE: BACKGROUND PERSISTENCE MANAGER
 * 
 * Purpose: Prevents the OS (Android/iOS) from killing the browser tab
 * when the user minimizes the app or turns off the screen during
 * critical operations (Streaming/Recording).
 * 
 * Strategies:
 * 1. Screen Wake Lock API: Prevents screen dimming/locking.
 * 2. Silent Audio Oscillator: Tricks the OS into treating this tab as a 
 *    foreground media player, ensuring high CPU priority.
 */

class BackgroundKeepAliveService {
    private wakeLock: WakeLockSentinel | null = null;
    private audioContext: AudioContext | null = null;
    private oscillator: OscillatorNode | null = null;
    private isKeepAliveActive: boolean = false;

    /**
     * Activates "High Performance Mode" to prevent background throttling.
     * Must be called inside a user interaction (click/tap) first.
     */
    public async enable() {
        if (this.isKeepAliveActive) return;
        
        console.log("[BackgroundService] Enabling Process Persistence...");

        // 1. Request Screen Wake Lock
        await this.requestWakeLock();

        // 2. Start Silent Audio (The "Audio Hack" for Background Execution)
        this.startSilentAudio();

        this.isKeepAliveActive = true;

        // Re-acquire lock if visibility changes (e.g. user switches tabs and comes back)
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }

    public async disable() {
        if (!this.isKeepAliveActive) return;

        console.log("[BackgroundService] Releasing Persistence...");

        // 1. Release Lock
        if (this.wakeLock) {
            await this.wakeLock.release();
            this.wakeLock = null;
        }

        // 2. Stop Audio
        this.stopSilentAudio();

        this.isKeepAliveActive = false;
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }

    private handleVisibilityChange = async () => {
        if (this.wakeLock !== null && document.visibilityState === 'visible') {
            await this.requestWakeLock(); // Re-acquire if lost
        }
    };

    private async requestWakeLock() {
        try {
            if ('wakeLock' in navigator) {
                this.wakeLock = await navigator.wakeLock.request('screen');
                console.log('[BackgroundService] Wake Lock acquired');
                
                this.wakeLock.addEventListener('release', () => {
                    console.log('[BackgroundService] Wake Lock released');
                });
            }
        } catch (err) {
            console.warn(`[BackgroundService] Wake Lock Error: ${err}`);
        }
    }

    private startSilentAudio() {
        try {
            // Create Audio Context
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContextClass) return;

            this.audioContext = new AudioContextClass();

            // Create a silent oscillator (plays sound at 0 volume)
            // This keeps the audio thread active, preventing the browser tab from sleeping.
            this.oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            this.oscillator.type = 'sine';
            this.oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // 440Hz
            
            // CRITICAL: Volume must be extremely low but non-zero in some browsers, 
            // strictly 0 works in most modern Chrome/Safari to trigger "media playing" status.
            gainNode.gain.setValueAtTime(0.001, this.audioContext.currentTime); 
            
            this.oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            this.oscillator.start();
            console.log("[BackgroundService] Silent Audio Loop Started");

        } catch (e) {
            console.error("[BackgroundService] Audio Context Failed", e);
        }
    }

    private stopSilentAudio() {
        try {
            if (this.oscillator) {
                this.oscillator.stop();
                this.oscillator.disconnect();
                this.oscillator = null;
            }
            if (this.audioContext) {
                this.audioContext.close();
                this.audioContext = null;
            }
        } catch (e) {
            console.error("[BackgroundService] Error stopping audio", e);
        }
    }
}

export const backgroundService = new BackgroundKeepAliveService();
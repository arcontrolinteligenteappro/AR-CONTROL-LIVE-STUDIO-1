
import { VoiceProfile, VoiceState } from '../types';

// Browser Speech Synthesis Cache
let synth: SpeechSynthesis | null = null;
if (typeof window !== 'undefined') {
    synth = window.speechSynthesis;
}

export const INITIAL_VOICE_STATE: VoiceState = {
    isEnabled: false,
    selectedVoiceId: 'es-MX-1',
    isSpeaking: false,
    volume: 100,
    profiles: [],
    history: []
};

export const speakText = async (text: string, voiceId: string, profiles: VoiceProfile[]): Promise<void> => {
    if (!synth) {
        console.error("Browser does not support Speech Synthesis");
        return;
    }

    // Cancel current speaking
    if (synth.speaking) {
        synth.cancel();
    }

    const profile = profiles.find(p => p.id === voiceId);
    
    // --- CLOUD AI PATH (Simulated) ---
    if (profile?.provider === 'CLOUD_AI') {
        // Here we would fetch an MP3 from Google GenAI / ElevenLabs
        // For MVP, we fallback to local but change pitch/rate to simulate "different" voice
        console.log(`[VoiceEngine] Fetching Cloud Audio for: ${text}`);
        // Simulate network delay then fallback for now
        await new Promise(r => setTimeout(r, 300)); 
    }

    // --- LOCAL FALLBACK (WebSpeech API) ---
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a matching system voice
    const systemVoices = synth.getVoices();
    const targetLang = profile?.lang || 'es-MX';
    const matchingVoice = systemVoices.find(v => v.lang === targetLang) || systemVoices[0];
    
    utterance.voice = matchingVoice;
    utterance.rate = 1.1; // Sporty speed
    utterance.pitch = profile?.gender === 'FEMALE' ? 1.2 : 0.9;
    utterance.volume = 1.0;

    synth.speak(utterance);
    
    return new Promise((resolve) => {
        utterance.onend = () => resolve();
    });
};

export const getSystemVoices = (): Promise<VoiceProfile[]> => {
    return new Promise((resolve) => {
        if (!synth) {
            resolve([]);
            return;
        }
        
        // Wait for voices to load
        const load = () => {
            const voices = synth!.getVoices();
            const profiles: VoiceProfile[] = voices
                .filter(v => v.lang.startsWith('es') || v.lang.startsWith('en'))
                .map((v, idx) => ({
                    id: `sys-${idx}`,
                    name: v.name,
                    lang: v.lang,
                    gender: 'MALE', // Detection not supported in API standard
                    provider: 'LOCAL'
                }));
            resolve(profiles);
        };

        if (synth.getVoices().length > 0) {
            load();
        } else {
            synth.onvoiceschanged = load;
        }
    });
}

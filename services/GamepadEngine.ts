
import { CameraSource, PTZState } from '../types';

export interface GamepadMapping {
    buttons: {
        cutCam1: number;
        cutCam2: number;
        cutCam3: number;
        cutCam4: number;
        take: number;
        replay: number;
        toggleCommerce: number;
    };
    axes: {
        pan: number;
        tilt: number;
        zoom: number;
    };
}

export const XBOX_MAPPING: GamepadMapping = {
    buttons: {
        cutCam1: 0, // A
        cutCam2: 1, // B
        cutCam3: 2, // X
        cutCam4: 3, // Y
        take: 7,    // RT
        replay: 6,  // LT
        toggleCommerce: 9, // Menu
    },
    axes: {
        pan: 0,   // Left Stick X
        tilt: 1,  // Left Stick Y
        zoom: 3   // Right Stick Y
    }
};

export const processGamepadInput = (
    gamepad: Gamepad, 
    activeCamera: CameraSource | undefined,
    onPTZUpdate: (update: Partial<PTZState>) => void,
    onAction: (actionType: string, value?: any) => void
) => {
    const map = XBOX_MAPPING;
    
    // 1. Process PTZ Axes (Deadzone logic applied)
    const deadzone = 0.15;
    const pan = Math.abs(gamepad.axes[map.axes.pan]) > deadzone ? gamepad.axes[map.axes.pan] : 0;
    const tilt = Math.abs(gamepad.axes[map.axes.tilt]) > deadzone ? gamepad.axes[map.axes.tilt] : 0;
    const zoom = Math.abs(gamepad.axes[map.axes.zoom]) > deadzone ? gamepad.axes[map.axes.zoom] : 0;

    if (pan !== 0 || tilt !== 0 || zoom !== 0) {
        onPTZUpdate({
            pan: pan * 10,  // Proportional speed
            tilt: tilt * 10,
            zoom: zoom * 5
        });
    }

    // 2. Process Buttons (Single-fire logic needed in caller or simple check here)
    if (gamepad.buttons[map.buttons.cutCam1].pressed) onAction('CUT', 0);
    if (gamepad.buttons[map.buttons.cutCam2].pressed) onAction('CUT', 1);
    if (gamepad.buttons[map.buttons.cutCam3].pressed) onAction('CUT', 2);
    if (gamepad.buttons[map.buttons.cutCam4].pressed) onAction('CUT', 3);
    
    if (gamepad.buttons[map.buttons.take].pressed) onAction('TAKE');
    if (gamepad.buttons[map.buttons.replay].pressed) onAction('REPLAY');
};

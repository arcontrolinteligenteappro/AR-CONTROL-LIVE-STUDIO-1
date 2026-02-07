
import { BaseCommand, CommandType } from '../types';

/**
 * ENGINE-CONTROL-SURFACE
 * El puente entre los gestos de la UI y los motores de procesamiento.
 */
class ControlSurfaceEngine {
  private static instance: ControlSurfaceEngine;
  private listeners: ((cmd: BaseCommand) => void)[] = [];

  private constructor() {}

  public static getInstance(): ControlSurfaceEngine {
    if (!ControlSurfaceEngine.instance) {
      ControlSurfaceEngine.instance = new ControlSurfaceEngine();
    }
    return ControlSurfaceEngine.instance;
  }

  public subscribe(callback: (cmd: BaseCommand) => void) {
    this.listeners.push(callback);
  }

  /**
   * Emite un comando tipado. 
   * Aquí se podría integrar el mapeo MIDI o HID en el futuro.
   */
  public emit(type: CommandType, payload?: any, priority: 'P0' | 'P1' | 'P2' = 'P1') {
    const cmd: BaseCommand = {
      type,
      payload,
      timestamp: Date.now(),
      priority
    };
    
    console.debug(`[CSL] Command: ${type}`, payload);
    this.listeners.forEach(cb => cb(cmd));
  }
}

export const csl = ControlSurfaceEngine.getInstance();

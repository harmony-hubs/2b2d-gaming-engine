import Resource from "../2B2D/Resources/Resource";
import { System } from "../2B2D/System";

export default class PianoResource implements Resource {
  static readonly NAME: string = 'PianoResource';
  readonly name = PianoResource.NAME;

  audioContext: AudioContext;
  gainNode: GainNode;

  constructor() {
    this.audioContext = new AudioContext();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    this.gainNode.connect(this.audioContext.destination);
  }

  playTone(frequency: number, duration: number = 0.5) {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    const oscGain = this.audioContext.createGain();
    oscGain.gain.setValueAtTime(1, this.audioContext.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.connect(oscGain);
    oscGain.connect(this.gainNode);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  system(): System {
    return () => {};
  }
}

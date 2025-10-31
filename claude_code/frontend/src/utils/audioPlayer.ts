/**
 * Audio Player for OpenAI Realtime API
 * Uses TTS to speak the AI's transcript
 */

import Tts from 'react-native-tts';

class AudioPlayer {
  private currentTranscript: string | null = null;
  private isPlaying = false;

  constructor() {
    // Initialize TTS
    Tts.setDefaultLanguage('ko-KR'); // Korean
    Tts.setDefaultRate(0.5); // Normal speech rate
    Tts.setDefaultPitch(1.0); // Normal pitch

    // Set up event listeners
    Tts.addEventListener('tts-start', () => {
      console.log('[AudioPlayer] TTS started');
      this.isPlaying = true;
    });

    Tts.addEventListener('tts-finish', () => {
      console.log('[AudioPlayer] TTS finished');
      this.isPlaying = false;
    });

    Tts.addEventListener('tts-cancel', () => {
      console.log('[AudioPlayer] TTS cancelled');
      this.isPlaying = false;
    });
  }

  /**
   * Add audio chunk from OpenAI (not used with TTS)
   */
  addChunk(base64Audio: string): void {
    // TTS doesn't use audio chunks, but keep for compatibility
    console.log('[AudioPlayer] Received audio chunk (ignored for TTS)');
  }

  /**
   * Play text using TTS
   */
  async playText(text: string): Promise<void> {
    if (!text) {
      console.log('[AudioPlayer] No text to speak');
      return;
    }

    if (this.isPlaying) {
      console.log('[AudioPlayer] Already playing, stopping previous');
      await this.stop();
    }

    try {
      console.log('[AudioPlayer] Speaking:', text);
      this.currentTranscript = text;
      await Tts.speak(text);
    } catch (error) {
      console.error('[AudioPlayer] TTS error:', error);
      this.isPlaying = false;
    }
  }

  /**
   * Play accumulated audio chunks (compatibility method)
   */
  async play(): Promise<void> {
    // For TTS, we don't accumulate chunks
    // The actual playback happens in playText
    console.log('[AudioPlayer] Play called (using playText instead)');
  }

  /**
   * Stop current playback
   */
  async stop(): Promise<void> {
    try {
      await Tts.stop();
      this.isPlaying = false;
      console.log('[AudioPlayer] Stopped');
    } catch (error) {
      console.error('[AudioPlayer] Stop error:', error);
    }
  }

  /**
   * Reset player state
   */
  reset(): void {
    this.stop();
    this.currentTranscript = null;
  }
}

export default new AudioPlayer();

/**
 * Audio Recorder for OpenAI Realtime API
 * Records microphone audio and sends to WebSocket using live audio stream
 */

import LiveAudioStream from 'react-native-live-audio-stream';

class AudioRecorder {
  private isRecording = false;
  private onAudioDataCallback: ((data: string) => void) | null = null;

  constructor() {
    console.log('[AudioRecorder] Initialized');

    // Configure audio stream for OpenAI Realtime API
    // PCM16, 24kHz mono
    const options = {
      sampleRate: 24000, // OpenAI requires 24kHz
      channels: 1, // mono
      bitsPerSample: 16, // PCM16
      audioSource: 6, // VOICE_RECOGNITION on Android
      bufferSize: 4096,
    };

    LiveAudioStream.init(options);
  }

  /**
   * Start recording audio
   */
  async startRecording(onAudioData: (data: string) => void): Promise<void> {
    try {
      console.log('[AudioRecorder] Starting recording...');
      this.onAudioDataCallback = onAudioData;

      // Set up audio data listener
      LiveAudioStream.on('data', (data: string) => {
        if (this.isRecording && this.onAudioDataCallback) {
          // data is already base64 encoded PCM16
          console.log('[AudioRecorder] Audio chunk received, length:', data.length);
          this.onAudioDataCallback(data);
        }
      });

      // Start recording
      LiveAudioStream.start();
      this.isRecording = true;

      console.log('[AudioRecorder] Recording started');
    } catch (error) {
      console.error('[AudioRecorder] Start recording error:', error);
      throw error;
    }
  }

  /**
   * Stop recording
   */
  async stopRecording(): Promise<void> {
    try {
      if (this.isRecording) {
        console.log('[AudioRecorder] Stopping recording...');
        LiveAudioStream.stop();
        this.isRecording = false;
        console.log('[AudioRecorder] Recording stopped');
      }
    } catch (error) {
      console.error('[AudioRecorder] Stop recording error:', error);
      throw error;
    }
  }

  /**
   * Check if currently recording
   */
  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    if (this.isRecording) {
      LiveAudioStream.stop();
      this.isRecording = false;
    }
    this.onAudioDataCallback = null;
  }
}

export default new AudioRecorder();

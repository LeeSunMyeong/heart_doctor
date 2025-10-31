/**
 * Voice Test Service
 * Handles WebSocket communication with OpenAI Realtime API
 */

import {Platform} from 'react-native';
import authService from './authService';
import audioPlayer from '../utils/audioPlayer';

interface TokenResponse {
  client_secret: {
    value: string;
    expires_at: number;
  };
}

interface RealtimeSession {
  ws: WebSocket | null;
  isConnected: boolean;
  audioContext: AudioContext | null;
}

export class VoiceTestService {
  private session: RealtimeSession = {
    ws: null,
    isConnected: false,
    audioContext: null,
  };

  private onMessageCallback: ((message: any) => void) | null = null;
  private onErrorCallback: ((error: Error) => void) | null = null;
  private onConnectionChangeCallback: ((connected: boolean) => void) | null =
    null;

  /**
   * Get ephemeral token from backend
   */
  async getEphemeralToken(): Promise<string> {
    try {
      console.log('[VoiceTest] Getting access token');
      const token = await authService.getAccessToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      console.log('[VoiceTest] Access token retrieved');

      console.log('[VoiceTest] Fetching ephemeral token from backend');
      const response = await fetch(
        'http://10.0.2.2:8080/api/v1/voice/token',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('[VoiceTest] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[VoiceTest] Response error:', errorText);
        throw new Error(`Failed to get token: ${response.status}`);
      }

      const data: TokenResponse = await response.json();
      console.log('[VoiceTest] Ephemeral token received');
      return data.client_secret.value;
    } catch (error) {
      console.error('[VoiceTest] Token error:', error);
      throw error;
    }
  }

  /**
   * Connect to OpenAI Realtime API
   */
  async connect(): Promise<void> {
    try {
      // Get JWT token for backend authentication
      console.log('[VoiceTest] Getting JWT token');
      const token = await authService.getAccessToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Connect to backend WebSocket proxy
      // Backend will handle OpenAI authentication
      const wsUrl = `ws://10.0.2.2:8080/api/v1/voice/realtime?token=${encodeURIComponent(
        token,
      )}`;

      console.log('[VoiceTest] Connecting to backend WebSocket proxy');
      this.session.ws = new WebSocket(wsUrl);

      // Setup WebSocket event handlers
      this.session.ws.onopen = () => {
        console.log('[VoiceTest] WebSocket connected');
        this.session.isConnected = true;
        this.onConnectionChangeCallback?.(true);

        // Send session configuration
        this.configureSession();
      };

      this.session.ws.onmessage = event => {
        const message = JSON.parse(event.data);
        console.log('[VoiceTest] Message:', message.type);
        this.handleServerMessage(message);
      };

      this.session.ws.onerror = error => {
        console.error('[VoiceTest] WebSocket error:', error);
        const errorObj = new Error('WebSocket connection error');
        this.onErrorCallback?.(errorObj);
      };

      this.session.ws.onclose = () => {
        console.log('[VoiceTest] WebSocket closed');
        this.session.isConnected = false;
        this.onConnectionChangeCallback?.(false);
      };
    } catch (error) {
      console.error('[VoiceTest] Connection error:', error);
      throw error;
    }
  }

  /**
   * Configure session with audio settings
   */
  private configureSession(): void {
    if (!this.session.ws || this.session.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const config = {
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions:
          '당신은 심장 건강 검사를 진행하는 친절한 의료 도우미입니다. ' +
          '항상 정중하고 친절하게 대화하세요. ' +
          '한 번에 하나의 질문만 하고, 사용자 답변을 명확하게 이해하지 못한 경우 다시 질문하세요. ' +
          '숫자는 정확하게 파악하세요 (예: "스물다섯" → 25). ' +
          '예/아니오 질문에는 명확한 답변을 요청하세요.',
        voice: 'alloy',
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: {
          model: 'whisper-1',
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.3,           // Lower threshold = more sensitive
          prefix_padding_ms: 500,   // More padding before speech
          silence_duration_ms: 700, // Wait longer for speech to finish
        },
        temperature: 0.8,
      },
    };

    this.session.ws.send(JSON.stringify(config));
    console.log('[VoiceTest] Session configured');
  }

  /**
   * Handle server messages
   */
  private handleServerMessage(message: any): void {
    switch (message.type) {
      case 'session.created':
        console.log('[VoiceTest] Session created:', message.session.id);
        break;

      case 'session.updated':
        console.log('[VoiceTest] Session updated');
        break;

      case 'conversation.item.created':
        console.log('[VoiceTest] Item created:', message.item.id);
        break;

      case 'response.audio.delta':
        // Audio chunk received - add to audio player
        if (message.delta) {
          audioPlayer.addChunk(message.delta);
        }
        this.onMessageCallback?.({
          type: 'audio_chunk',
          data: message.delta,
        });
        break;

      case 'response.audio.done':
        // All audio chunks received - play audio
        console.log('[VoiceTest] Audio done - starting playback');
        audioPlayer.play().catch(error => {
          console.error('[VoiceTest] Audio playback error:', error);
        });
        this.onMessageCallback?.({
          type: 'audio_done',
        });
        break;

      case 'response.audio_transcript.done':
        // AI's spoken text completed - play using TTS
        console.log('[VoiceTest] AI transcript:', message.transcript);
        audioPlayer.playText(message.transcript).catch(error => {
          console.error('[VoiceTest] TTS playback error:', error);
        });
        this.onMessageCallback?.({
          type: 'ai_transcript',
          transcript: message.transcript,
        });
        break;

      case 'conversation.item.input_audio_transcription.completed':
        // User's speech transcription completed
        console.log('[VoiceTest] User transcript:', message.transcript);
        this.onMessageCallback?.({
          type: 'user_transcript',
          transcript: message.transcript,
        });
        break;

      case 'response.done':
        console.log('[VoiceTest] Response completed');
        this.onMessageCallback?.({
          type: 'response_complete',
        });
        break;

      case 'error':
        console.error('[VoiceTest] Server error:', message.error);
        this.onErrorCallback?.(new Error(message.error.message));
        break;

      default:
        // Forward all other messages
        this.onMessageCallback?.(message);
    }
  }

  /**
   * Send audio data to server
   */
  sendAudio(audioData: string): void {
    if (!this.session.ws || this.session.ws.readyState !== WebSocket.OPEN) {
      console.warn('[VoiceTest] Cannot send audio - not connected');
      return;
    }

    const message = {
      type: 'input_audio_buffer.append',
      audio: audioData, // base64 encoded PCM16 audio
    };

    this.session.ws.send(JSON.stringify(message));
  }

  /**
   * Commit audio buffer and trigger response
   */
  commitAudio(): void {
    if (!this.session.ws || this.session.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    this.session.ws.send(
      JSON.stringify({
        type: 'input_audio_buffer.commit',
      }),
    );

    this.session.ws.send(
      JSON.stringify({
        type: 'response.create',
      }),
    );
  }

  /**
   * Send text message (for testing or text-based interaction)
   */
  sendTextMessage(text: string): void {
    if (!this.session.ws || this.session.ws.readyState !== WebSocket.OPEN) {
      console.warn('[VoiceTest] Cannot send text - not connected');
      return;
    }

    const message = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: text,
          },
        ],
      },
    };

    this.session.ws.send(JSON.stringify(message));

    // Trigger response generation
    this.session.ws.send(
      JSON.stringify({
        type: 'response.create',
      }),
    );
  }

  /**
   * Interrupt current response
   */
  interrupt(): void {
    if (!this.session.ws || this.session.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    this.session.ws.send(
      JSON.stringify({
        type: 'response.cancel',
      }),
    );
  }

  /**
   * Disconnect from server
   */
  disconnect(): void {
    if (this.session.ws) {
      this.session.ws.close();
      this.session.ws = null;
      this.session.isConnected = false;
    }

    if (this.session.audioContext) {
      this.session.audioContext.close();
      this.session.audioContext = null;
    }

    // Reset audio player
    audioPlayer.reset();

    console.log('[VoiceTest] Disconnected');
  }

  /**
   * Set message callback
   */
  onMessage(callback: (message: any) => void): void {
    this.onMessageCallback = callback;
  }

  /**
   * Set error callback
   */
  onError(callback: (error: Error) => void): void {
    this.onErrorCallback = callback;
  }

  /**
   * Set connection change callback
   */
  onConnectionChange(callback: (connected: boolean) => void): void {
    this.onConnectionChangeCallback = callback;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.session.isConnected;
  }

  /**
   * Get connection status
   */
  getStatus(): 'connected' | 'disconnected' | 'connecting' {
    if (!this.session.ws) {
      return 'disconnected';
    }

    switch (this.session.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      default:
        return 'disconnected';
    }
  }
}

// Export singleton instance
export default new VoiceTestService();

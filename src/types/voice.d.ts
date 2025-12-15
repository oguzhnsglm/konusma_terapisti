declare module '@react-native-voice/voice' {
  type SpeechError = { message?: string };
  type SpeechResultsEvent = { value?: string[] };

  interface VoiceModule {
    start(locale: string): Promise<void>;
    stop(): Promise<void>;
    destroy(): Promise<void>;
    removeAllListeners(): void;
    requestPermissions?: () => Promise<void>;
    onSpeechResults?: (event: SpeechResultsEvent) => void;
    onSpeechError?: (event: { error?: SpeechError }) => void;
    onSpeechEnd?: () => void;
    onSpeechStart?: () => void;
  }

  const Voice: VoiceModule;
  export default Voice;
}

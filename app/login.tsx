import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabaseClient';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Test amaçlı otomatik giriş
  useEffect(() => {
    const testAutoLogin = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          // Zaten giriş yapılmış
          router.replace('/');
          return;
        }
        // Test hesabı ile giriş
        setLoading(true);
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: 'test@example.com',
          password: 'test123456',
        });
        setLoading(false);
        if (!authError) {
          router.replace('/');
        }
      } catch (err) {
        // Hata durumunda giriş ekranını göster
        setLoading(false);
      }
    };

    testAutoLogin();
  }, []);

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError('E-posta ve şifre girin.');
      return;
    }
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    router.replace('/');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Hoş geldin</Text>
        <Text style={styles.subtitle}>Hesabına gir ve hemen başla.</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-posta</Text>
          <TextInput
            style={styles.input}
            placeholder="ornek@posta.com"
            placeholderTextColor="#7b7d92"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Şifre</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            placeholderTextColor="#7b7d92"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#1f1b3a" /> : <Text style={styles.primaryButtonLabel}>Giriş Yap</Text>}
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => router.push('/register')} disabled={loading}>
          <Text style={styles.secondaryLabel}>Hesabın yok mu? Kayıt ol</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/')} style={styles.backLinkWrapper}>
          <Text style={styles.backLink}>Ana sayfaya dön</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f9fbff',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 16,
    shadowColor: '#c1d5ff',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f1b3a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b4c7a',
    textAlign: 'center',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f1b3a',
  },
  input: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: '#1f1b3a',
    fontSize: 16,
  },
  primaryButton: {
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 16,
    backgroundColor: '#ff9fd3',
    alignItems: 'center',
  },
  primaryButtonLabel: {
    color: '#1f1b3a',
    fontWeight: '800',
    fontSize: 18,
  },
  secondaryButton: {
    marginTop: 6,
    borderRadius: 16,
    paddingVertical: 14,
    backgroundColor: '#f2f4ff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  secondaryLabel: {
    color: '#1f1b3a',
    fontWeight: '700',
    fontSize: 16,
  },
  error: {
    color: '#d9468f',
    fontWeight: '700',
    textAlign: 'center',
  },
  backLinkWrapper: {
    marginTop: 10,
    alignItems: 'center',
  },
  backLink: {
    color: '#4b4c7a',
    fontWeight: '700',
  },
});

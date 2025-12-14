import { useState } from 'react';
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

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [childName, setChildName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);
    setInfo(null);
    if (!email || !password) {
      setError('E-posta ve şifre girin.');
      return;
    }
    setLoading(true);
    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: childName || null },
      },
    });
    if (authError) {
      setLoading(false);
      setError(authError.message);
      return;
    }
    const userId = data.user?.id;
    if (userId) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId,
        email: email.trim(),
        full_name: childName || null,
      });
      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    setInfo('Hesap oluşturuldu! E-postanı kontrol et veya giriş yap.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Kayıt ol</Text>
        <Text style={styles.subtitle}>Birkaç adımda hesabını oluştur.</Text>

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
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Çocuk adı (opsiyonel)</Text>
          <TextInput
            style={styles.input}
            placeholder="Arda"
            placeholderTextColor="#7b7d92"
            value={childName}
            onChangeText={setChildName}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {info ? <Text style={styles.info}>{info}</Text> : null}

        <Pressable style={styles.primaryButton} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#1f1b3a" /> : <Text style={styles.primaryButtonLabel}>Kayıt Ol</Text>}
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => router.push('/login')} disabled={loading}>
          <Text style={styles.secondaryLabel}>Hesabın var mı? Giriş yap</Text>
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
  info: {
    color: '#1f8c5c',
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

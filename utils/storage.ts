import AsyncStorage from '@react-native-async-storage/async-storage';

const PIN_KEY = '@konusma_terapisti/pin';
const CHILD_MODE_KEY = '@konusma_terapisti/child_mode_enabled';
const PIN_ATTEMPTS_KEY = '@konusma_terapisti/pin_attempts';
const PIN_LOCK_TIME_KEY = '@konusma_terapisti/pin_lock_time';

const DEFAULT_PIN = '1234';
const MAX_ATTEMPTS = 3;
const LOCK_DURATION = 30000; // 30 seconds

export async function getPIN(): Promise<string> {
  try {
    const pin = await AsyncStorage.getItem(PIN_KEY);
    return pin || DEFAULT_PIN;
  } catch (error) {
    console.error('Error getting PIN:', error);
    return DEFAULT_PIN;
  }
}

export async function setPIN(newPin: string): Promise<void> {
  try {
    await AsyncStorage.setItem(PIN_KEY, newPin);
  } catch (error) {
    console.error('Error setting PIN:', error);
  }
}

export async function isChildModeEnabled(): Promise<boolean> {
  try {
    const enabled = await AsyncStorage.getItem(CHILD_MODE_KEY);
    return enabled === 'true';
  } catch (error) {
    console.error('Error checking child mode:', error);
    return false;
  }
}

export async function setChildModeEnabled(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(CHILD_MODE_KEY, enabled ? 'true' : 'false');
  } catch (error) {
    console.error('Error setting child mode:', error);
  }
}

export async function getPinAttempts(): Promise<number> {
  try {
    const attempts = await AsyncStorage.getItem(PIN_ATTEMPTS_KEY);
    return attempts ? parseInt(attempts, 10) : 0;
  } catch (error) {
    console.error('Error getting PIN attempts:', error);
    return 0;
  }
}

export async function setPinAttempts(attempts: number): Promise<void> {
  try {
    await AsyncStorage.setItem(PIN_ATTEMPTS_KEY, attempts.toString());
  } catch (error) {
    console.error('Error setting PIN attempts:', error);
  }
}

export async function getPinLockTime(): Promise<number> {
  try {
    const lockTime = await AsyncStorage.getItem(PIN_LOCK_TIME_KEY);
    return lockTime ? parseInt(lockTime, 10) : 0;
  } catch (error) {
    console.error('Error getting PIN lock time:', error);
    return 0;
  }
}

export async function setPinLocked(): Promise<void> {
  try {
    const lockTime = Date.now() + LOCK_DURATION;
    await AsyncStorage.setItem(PIN_LOCK_TIME_KEY, lockTime.toString());
    await setPinAttempts(0);
  } catch (error) {
    console.error('Error setting PIN lock:', error);
  }
}

export async function resetPinAttempts(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PIN_ATTEMPTS_KEY);
    await AsyncStorage.removeItem(PIN_LOCK_TIME_KEY);
  } catch (error) {
    console.error('Error resetting PIN attempts:', error);
  }
}

export async function isPinLocked(): Promise<boolean> {
  try {
    const lockTime = await getPinLockTime();
    if (lockTime === 0) return false;
    if (Date.now() > lockTime) {
      await resetPinAttempts();
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error checking PIN lock:', error);
    return false;
  }
}

export async function getRemainingLockTime(): Promise<number> {
  try {
    const lockTime = await getPinLockTime();
    if (lockTime === 0) return 0;
    const remaining = Math.ceil((lockTime - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  } catch (error) {
    console.error('Error getting remaining lock time:', error);
    return 0;
  }
}

export async function verifyPin(pin: string): Promise<boolean> {
  try {
    const locked = await isPinLocked();
    if (locked) return false;

    const storedPin = await getPIN();
    const isValid = pin === storedPin;

    if (!isValid) {
      const attempts = await getPinAttempts();
      const newAttempts = attempts + 1;

      if (newAttempts >= MAX_ATTEMPTS) {
        await setPinLocked();
      } else {
        await setPinAttempts(newAttempts);
      }
    } else {
      await resetPinAttempts();
    }

    return isValid;
  } catch (error) {
    console.error('Error verifying PIN:', error);
    return false;
  }
}

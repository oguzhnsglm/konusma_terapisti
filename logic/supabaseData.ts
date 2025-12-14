import { supabase } from '../lib/supabaseClient';

export type WordStatus = 'pending' | 'success' | 'fail';

export type LevelRow = {
  id: number;
  title: string | null;
  description: string | null;
  order_index: number | null;
  created_at?: string | null;
  words?: WordRow[];
};

export type WordRow = {
  id: number;
  level_id: number;
  word: string | null;
  order_index: number | null;
  created_at?: string | null;
};

export type UserLevelProgressRow = {
  id: number;
  user_id: string;
  level_id: number;
  is_unlocked: boolean;
  is_completed: boolean;
  completed_at?: string | null;
};

export type UserWordProgressRow = {
  id: number;
  user_id: string;
  word_id: number;
  status: WordStatus | null;
  best_score?: number | null;
  attempt_count?: number | null;
  last_attempt_at?: string | null;
};

export async function fetchLevelsWithWords(): Promise<LevelRow[]> {
  const { data, error } = await supabase
    .from('levels')
    .select('id, title, description, order_index, created_at, words(id, level_id, word, order_index, created_at)')
    .order('order_index', { ascending: true })
    .order('order_index', { ascending: true, foreignTable: 'words' });

  if (error) throw error;
  return data ?? [];
}

export async function fetchUserLevelProgress(userId: string): Promise<UserLevelProgressRow[]> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('id, user_id, level_id, is_unlocked, is_completed, completed_at');
  if (error) throw error;
  return (data ?? []).filter((row) => row.user_id === userId);
}

export async function fetchUserWordProgress(userId: string): Promise<UserWordProgressRow[]> {
  const { data, error } = await supabase
    .from('user_word_progress')
    .select('id, user_id, word_id, status, best_score, attempt_count, last_attempt_at');
  if (error) throw error;
  return (data ?? []).filter((row) => row.user_id === userId);
}

export async function upsertWordProgress(
  userId: string,
  wordId: number,
  status: WordStatus,
  score?: number,
) {
  const now = new Date().toISOString();
  const { error } = await supabase.from('user_word_progress').upsert(
    {
      user_id: userId,
      word_id: wordId,
      status,
      best_score: score ?? null,
      attempt_count: 1,
      last_attempt_at: now,
      updated_at: now,
    },
    { onConflict: 'user_id,word_id' },
  );
  if (error) throw error;
}

export async function upsertLevelProgress(
  userId: string,
  levelId: number,
  isUnlocked: boolean,
  isCompleted: boolean,
) {
  const now = new Date().toISOString();
  const { error } = await supabase.from('user_progress').upsert(
    {
      user_id: userId,
      level_id: levelId,
      is_unlocked: isUnlocked,
      is_completed: isCompleted,
      completed_at: isCompleted ? now : null,
      updated_at: now,
    },
    { onConflict: 'user_id,level_id' },
  );
  if (error) throw error;
}

export async function recordWordAttempt(
  userId: string,
  wordId: number,
  recognizedText: string,
  score?: number,
  isSuccessful?: boolean,
  status?: WordStatus,
) {
  const { error } = await supabase.from('word_attempts').insert({
    user_id: userId,
    word_id: wordId,
    recognized_text: recognizedText,
    score: score ?? null,
    is_successful: isSuccessful ?? null,
    status: status ?? null,
    attempt_date: new Date().toISOString(),
  });
  if (error) throw error;
}

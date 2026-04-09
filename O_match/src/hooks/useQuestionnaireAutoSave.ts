import { useCallback, useEffect, useRef, useState } from 'react';
import { loadQuestionnaire, QuestionnaireAnswer, saveQuestionnaire } from '@/services/questionnaireService';

export type QuestionnaireSaveState = 'idle' | 'saving' | 'saved' | 'error';

type ModuleKey = Exclude<keyof QuestionnaireAnswer, 'savedAt'>;

interface UseQuestionnaireAutoSaveOptions<T extends Record<string, unknown>> {
  moduleKey: ModuleKey;
  initialData: T;
  debounceMs?: number;
}

export const useQuestionnaireAutoSave = <T extends Record<string, unknown>>({
  moduleKey,
  initialData,
  debounceMs = 800,
}: UseQuestionnaireAutoSaveOptions<T>) => {
  const [formData, setFormData] = useState<T>(initialData);
  const [saveState, setSaveState] = useState<QuestionnaireSaveState>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const hasHydratedRef = useRef(false);
  const autoSaveTimerRef = useRef<number | null>(null);

  const persistNow = useCallback(
    async (nextData?: T): Promise<boolean> => {
      const dataToSave = nextData ?? formData;
      setSaveState('saving');
      try {
        const existingData = await loadQuestionnaire();
        await saveQuestionnaire({
          ...(existingData ?? {}),
          [moduleKey]: dataToSave,
        });
        setLastSavedAt(Date.now());
        setSaveState('saved');
        return true;
      } catch {
        setSaveState('error');
        return false;
      }
    },
    [formData, moduleKey]
  );

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      try {
        const existingData = await loadQuestionnaire();
        if (cancelled || !existingData) {
          hasHydratedRef.current = true;
          return;
        }

        const moduleData = existingData[moduleKey] as T | undefined;
        if (moduleData) {
          setFormData((prev) => ({
            ...prev,
            ...moduleData,
          }));
        }

        if (existingData.savedAt) {
          setLastSavedAt(existingData.savedAt);
          setSaveState('saved');
        }
      } finally {
        if (!cancelled) {
          hasHydratedRef.current = true;
        }
      }
    };

    void hydrate();

    return () => {
      cancelled = true;
      if (autoSaveTimerRef.current) {
        window.clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [moduleKey]);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      return;
    }

    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = window.setTimeout(() => {
      void persistNow(formData);
    }, debounceMs);

    return () => {
      if (autoSaveTimerRef.current) {
        window.clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [debounceMs, formData, persistNow]);

  return {
    formData,
    setFormData,
    saveState,
    lastSavedAt,
    persistNow,
  };
};

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getQuestionnaireSnapshot,
  loadQuestionnaire,
  QuestionnaireAnswer,
  saveQuestionnaireModule,
} from '@/services/questionnaireService';

export type QuestionnaireSaveState = 'idle' | 'saving' | 'saved' | 'error';

type ModuleKey = Exclude<keyof QuestionnaireAnswer, 'savedAt'>;

interface UseQuestionnaireAutoSaveOptions<T extends object> {
  moduleKey: ModuleKey;
  initialData: T;
  debounceMs?: number;
}

export const useQuestionnaireAutoSave = <T extends object>({
  moduleKey,
  initialData,
  debounceMs = 800,
}: UseQuestionnaireAutoSaveOptions<T>) => {
  const initialDataRef = useRef(initialData);
  const initialSnapshotRef = useRef(getQuestionnaireSnapshot());
  const initialModuleData = initialSnapshotRef.current?.[moduleKey] as T | undefined;
  const initialHydrated = Boolean(initialSnapshotRef.current);

  const [formData, setFormData] = useState<T>(() => {
    if (!initialModuleData) {
      return initialDataRef.current;
    }

    return {
      ...initialDataRef.current,
      ...initialModuleData,
    };
  });
  const [saveState, setSaveState] = useState<QuestionnaireSaveState>(() => (
    initialSnapshotRef.current?.savedAt ? 'saved' : 'idle'
  ));
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(
    initialSnapshotRef.current?.savedAt ?? null
  );
  const [isHydrated, setIsHydrated] = useState(initialHydrated);

  const hasHydratedRef = useRef(initialHydrated);
  const autoSaveTimerRef = useRef<number | null>(null);
  const lastSavedHashRef = useRef<string | null>(
    initialModuleData ? JSON.stringify(initialModuleData) : null
  );
  const saveRequestIdRef = useRef(0);

  const serializeData = useCallback((data: T) => JSON.stringify(data), []);

  const persistNow = useCallback(
    async (nextData?: T): Promise<boolean> => {
      const dataToSave = nextData ?? formData;
      const dataHash = serializeData(dataToSave);

      if (lastSavedHashRef.current === dataHash) {
        return true;
      }

      const requestId = ++saveRequestIdRef.current;
      setSaveState('saving');

      try {
        await saveQuestionnaireModule(
          moduleKey,
          dataToSave as unknown as NonNullable<QuestionnaireAnswer[typeof moduleKey]>
        );

        if (requestId !== saveRequestIdRef.current) {
          return true;
        }

        lastSavedHashRef.current = dataHash;
        setLastSavedAt(Date.now());
        setSaveState('saved');
        return true;
      } catch {
        if (requestId === saveRequestIdRef.current) {
          setSaveState('error');
        }
        return false;
      }
    },
    [formData, moduleKey, serializeData]
  );

  useEffect(() => {
    let cancelled = false;

    if (!hasHydratedRef.current) {
      setIsHydrated(false);
    }

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
          lastSavedHashRef.current = serializeData(moduleData);
        } else {
          lastSavedHashRef.current = serializeData(initialDataRef.current);
        }

        if (existingData.savedAt) {
          setLastSavedAt(existingData.savedAt);
          setSaveState('saved');
        }
      } finally {
        if (!cancelled) {
          hasHydratedRef.current = true;
          setIsHydrated(true);
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
  }, [moduleKey, serializeData]);

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
    isHydrated,
    persistNow,
  };
};

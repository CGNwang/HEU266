import { useCallback, useState } from 'react';

interface IncompleteQuestion {
  id: string;
  completed: boolean;
}

interface UseIncompleteQuestionPromptOptions {
  headerOffset?: number;
  hintDurationMs?: number;
}

export const useIncompleteQuestionPrompt = (
  options: UseIncompleteQuestionPromptOptions = {}
) => {
  const { headerOffset = 260, hintDurationMs = 5000 } = options;
  const [incompleteHintId, setIncompleteHintId] = useState<string | null>(null);

  const focusFirstIncomplete = useCallback(
    (questions: IncompleteQuestion[]): boolean => {
      const firstIncomplete = questions.find((q) => !q.completed);
      if (!firstIncomplete) {
        return false;
      }

      const element = document.getElementById(firstIncomplete.id);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }

      setIncompleteHintId(firstIncomplete.id);
      window.setTimeout(() => {
        setIncompleteHintId(null);
      }, hintDurationMs);

      return true;
    },
    [headerOffset, hintDurationMs]
  );

  return {
    incompleteHintId,
    focusFirstIncomplete,
  };
};

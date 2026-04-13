import React from 'react';
import type { QuestionnaireSaveState } from '@/hooks/useQuestionnaireAutoSave';

interface QuestionnaireSaveStatusProps {
  saveState: QuestionnaireSaveState;
  lastSavedAt: number | null;
  className?: string;
}

export const QuestionnaireSaveStatus: React.FC<QuestionnaireSaveStatusProps> = ({
  saveState,
  lastSavedAt,
  className,
}) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className={className ?? 'text-xs font-medium text-on-surface-variant mb-2'}>
      {saveState === 'saving' && '正在自动保存...'}
      {saveState === 'saved' && `已自动保存${lastSavedAt ? `（${formatTime(lastSavedAt)}）` : ''}`}
      {saveState === 'error' && '自动保存失败，请重新编辑后重试'}
      {saveState === 'idle' && '输入后将自动保存'}
    </div>
  );
};

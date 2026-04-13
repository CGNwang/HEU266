import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCountdown(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diff = target.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}天${hours}小时后`;
  if (hours > 0) return `${hours}小时${minutes}分钟后`;
  return `${minutes}分钟后`;
}

export function getNextMatchDate(): { date: Date; weekday: string; time: string } {
  const now = new Date();
  const nextWednesday = new Date(now);
  nextWednesday.setHours(12, 0, 0, 0);

  // 找到下一个周三
  const dayOfWeek = now.getDay();
  const daysUntilWednesday = (3 - dayOfWeek + 7) % 7 || 7;
  nextWednesday.setDate(now.getDate() + daysUntilWednesday);

  // 如果周三已过（12点后），则推到下周三
  if (now.getTime() >= nextWednesday.getTime()) {
    nextWednesday.setDate(nextWednesday.getDate() + 7);
  }

  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  return {
    date: nextWednesday,
    weekday: weekdays[nextWednesday.getDay()],
    time: '12:00',
  };
}
'use client';
import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useThemeStore, type Theme } from '@/lib/stores/themeStore';
export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = mounted ? theme : 'system';
  const order: Theme[] = ['system', 'light', 'dark'];
  const next = order[(order.indexOf(current) + 1) % order.length];
  const Icon = current === 'dark' ? Moon : current === 'light' ? Sun : Monitor;
  return <button className="icon-button theme-toggle" type="button" onClick={() => setTheme(next)} aria-label={`Theme: ${current}. Switch to ${next} theme`} title={`Theme: ${current}. Switch to ${next}`}><Icon size={18} /><span className="sr-only" aria-live="polite">{current} theme</span></button>;
}
export const ThemeToggleDropdown = ThemeToggle;

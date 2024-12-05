'use client';

import { useTheme } from '@/context/ThemeContext';
import { BsSun, BsMoon } from 'react-icons/bs';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2 bg-surface p-2 rounded-lg border border-border shadow-lg">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'light'
            ? 'bg-primary text-background'
            : 'text-text hover:text-primary'
        }`}
        aria-label="Light theme"
      >
        <BsSun className="w-5 h-5" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'dark'
            ? 'bg-primary text-background'
            : 'text-text hover:text-primary'
        }`}
        aria-label="Dark theme"
      >
        <BsMoon className="w-5 h-5" />
      </button>
    </div>
  );
}

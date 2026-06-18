import React from 'react';
import { Disc } from 'lucide-react';

export default function ToastNotification({ message }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 glass-panel border-white/40 bg-neutral-950/90 text-neutral-100 py-3 px-5 rounded-lg shadow-xl flex items-center gap-3 animate-bounce">
      <Disc className="w-5 h-5 text-white animate-spin" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

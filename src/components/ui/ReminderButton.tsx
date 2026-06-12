'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '@/store';
import { requestNotificationPermission } from '@/lib/useReminders';

const LEAD_OPTIONS = [
  { label: '15 min before', minutes: 15 },
  { label: '30 min before', minutes: 30 },
  { label: '1 hour before', minutes: 60 },
];

interface ReminderButtonProps {
  eventId: string;
  eventName: string;
  sessionName: string;
  sessionStart: string;
  accentColor?: string;
}

/**
 * Bell icon button for setting a session reminder.
 * Shows a dropdown with lead time options. Bell fills when active.
 */
export default function ReminderButton({
  eventId,
  eventName,
  sessionName,
  sessionStart,
  accentColor = '#E10600',
}: ReminderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [alignLeft, setAlignLeft] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const addReminder = useStore((s) => s.addReminder);
  const removeReminder = useStore((s) => s.removeReminder);
  const getReminder = useStore((s) => s.getReminder);

  const existing = getReminder(eventId, sessionName);
  const isSet = !!existing && !existing.fired;

  // Don't show for past sessions
  if (new Date(sessionStart).getTime() < Date.now()) return null;

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSet) {
      // Remove existing reminder
      removeReminder(existing!.id);
    } else {
      // Anchor right edge by default; flip when there isn't room to the left
      const rect = e.currentTarget.getBoundingClientRect();
      setAlignLeft(rect.right - 160 < 24);
      setIsOpen((prev) => !prev);
    }
  }, [isSet, existing, removeReminder]);

  const handleSelect = useCallback(async (minutes: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const granted = await requestNotificationPermission();
    if (!granted) {
      // Notification permission denied — still set the reminder, it'll try again
    }
    addReminder({ eventId, eventName, sessionName, sessionStart, leadMinutes: minutes });
    setIsOpen(false);
  }, [addReminder, eventId, eventName, sessionName, sessionStart]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="p-2.5 sm:p-1.5 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          color: isSet ? accentColor : 'var(--pw-text-tertiary)',
          background: isSet ? `${accentColor}15` : 'transparent',
        }}
        title={isSet ? `Reminder set: ${existing!.leadMinutes}m before ${sessionName}` : `Set reminder for ${sessionName}`}
        aria-label={isSet ? 'Remove reminder' : 'Set reminder'}
      >
        {isSet ? (
          /* Filled bell */
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        ) : (
          /* Outline bell */
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`absolute ${alignLeft ? 'left-0' : 'right-0'} bottom-full mb-2 py-1 rounded-xl z-50 min-w-[160px]`}
          style={{
            background: 'var(--pw-bg-elevated)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--pw-glass-border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <div
            className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--pw-text-tertiary)' }}
          >
            Remind me
          </div>
          {LEAD_OPTIONS.map((opt) => (
            <button
              key={opt.minutes}
              onClick={(e) => handleSelect(opt.minutes, e)}
              className="w-full text-left px-3 py-2.5 sm:py-2 text-xs transition-colors hover:bg-white/5 active:bg-white/10"
              style={{ color: 'var(--pw-text-secondary)' }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

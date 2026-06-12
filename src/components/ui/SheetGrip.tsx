'use client';

import type { PointerEvent } from 'react';

/**
 * Drag handle for mobile bottom-sheet overlays. Sticky so it stays put in
 * scrolling panels; negative margin so it overlaps the hero instead of
 * pushing content down. Only the pill region captures pointer events.
 */
export default function SheetGrip({ onPointerDown }: { onPointerDown: (e: PointerEvent<HTMLDivElement>) => void }) {
  return (
    <div className="sticky top-0 z-30 -mb-7 flex justify-center pointer-events-none">
      <div
        className="pointer-events-auto px-10 pt-2.5 pb-3"
        style={{ touchAction: 'none', cursor: 'grab' }}
        onPointerDown={onPointerDown}
      >
        <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }} />
      </div>
    </div>
  );
}

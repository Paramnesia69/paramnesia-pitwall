'use client';

import { useDragControls } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { useIsMobile } from './useMediaQuery';

/**
 * Mobile bottom-sheet behavior for the slide-out overlays.
 *
 * On phones the right-edge panels become full-width sheets that slide up
 * from the bottom and can be dismissed by dragging the grip down.
 * `dragListener` is off so inner scroll areas don't fight the gesture —
 * the drag only starts from the SheetGrip via `dragControls.start(e)`.
 */
export function useMobileSheet(onClose: () => void) {
  const isMobile = useIsMobile();
  const dragControls = useDragControls();

  const sheetMotionProps = {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    transition: { type: 'spring', stiffness: 300, damping: 32 } as const,
    drag: 'y' as const,
    dragControls,
    dragListener: false,
    dragConstraints: { top: 0, bottom: 0 },
    dragElastic: { top: 0, bottom: 0.5 },
    onDragEnd: (_: unknown, info: PanInfo) => {
      if (info.offset.y > 110 || info.velocity.y > 600) onClose();
    },
  };

  // Position + shape overrides applied on top of each overlay's panel style
  const sheetStyle = {
    top: 'auto',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    maxWidth: '100%',
    height: '92dvh',
    borderRadius: '20px 20px 0 0',
    borderLeft: 'none',
    paddingBottom: 'env(safe-area-inset-bottom)',
  } as const;

  return { isMobile, dragControls, sheetMotionProps, sheetStyle };
}

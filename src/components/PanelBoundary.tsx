'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  /** Shown in the fallback so the user knows which section failed */
  label: string;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Per-panel error boundary — one failing feed or component can't blank the
 * whole dashboard. Renders a quiet glass fallback with a retry that simply
 * re-mounts the subtree.
 */
export default class PanelBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        className="pw-glass flex items-center justify-between gap-3 px-4 py-3 mb-8"
        role="alert"
      >
        <p className="text-xs" style={{ color: 'var(--pw-text-tertiary)' }}>
          {this.props.label} couldn&apos;t load.
        </p>
        <button
          onClick={() => this.setState({ hasError: false })}
          className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md transition-colors hover:bg-white/5"
          style={{ border: '1px solid var(--pw-glass-border)', color: 'var(--pw-text-secondary)' }}
        >
          Retry
        </button>
      </div>
    );
  }
}

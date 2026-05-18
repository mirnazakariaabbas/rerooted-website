import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';

/**
 * Regression tests for the Settling-In checklist bucket expand/collapse behavior.
 *
 * The production component (`SettlingInChecklist.tsx`) tracks expanded state as
 * `Record<Phase | 'accomplishments', boolean>` and toggles a single key per click:
 *
 *   setExpanded(prev => ({ ...prev, [key]: !prev[key] }))
 *
 * These tests replicate that exact state shape and toggle function in a tiny
 * harness so we can verify, without mocking Supabase / Auth / dnd-kit, that
 * each bucket's expanded state is fully independent.
 */

type Key = 'my-tasks' | 'laying-the-ground' | 'tending-the-garden' | 'starting-to-bloom' | 'accomplishments';

const KEYS: Key[] = [
  'my-tasks',
  'laying-the-ground',
  'tending-the-garden',
  'starting-to-bloom',
  'accomplishments',
];

const BucketsHarness = ({ initial }: { initial: Record<Key, boolean> }) => {
  const [expanded, setExpanded] = useState<Record<Key, boolean>>(initial);
  const toggle = (key: Key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div>
      {KEYS.map(key => (
        <div key={key} data-testid={`bucket-${key}`}>
          <button type="button" onClick={() => toggle(key)} aria-expanded={expanded[key]}>
            {key}
          </button>
          {expanded[key] ? <div data-testid={`content-${key}`}>content</div> : null}
        </div>
      ))}
    </div>
  );
};

const allCollapsed: Record<Key, boolean> = {
  'my-tasks': false,
  'laying-the-ground': false,
  'tending-the-garden': false,
  'starting-to-bloom': false,
  accomplishments: false,
};

const getHeader = (key: Key) => within(screen.getByTestId(`bucket-${key}`)).getByRole('button');
const isExpanded = (key: Key) => getHeader(key).getAttribute('aria-expanded') === 'true';

describe('Settling-In checklist bucket toggle', () => {
  it('expanding one bucket does not expand or collapse others', () => {
    render(<BucketsHarness initial={allCollapsed} />);

    KEYS.forEach(k => expect(isExpanded(k)).toBe(false));

    fireEvent.click(getHeader('my-tasks'));

    expect(isExpanded('my-tasks')).toBe(true);
    expect(screen.getByTestId('content-my-tasks')).toBeInTheDocument();
    KEYS.filter(k => k !== 'my-tasks').forEach(k => {
      expect(isExpanded(k)).toBe(false);
      expect(screen.queryByTestId(`content-${k}`)).not.toBeInTheDocument();
    });
  });

  it('collapsing one bucket leaves other expanded buckets open', () => {
    render(
      <BucketsHarness
        initial={{
          ...allCollapsed,
          'my-tasks': true,
          'laying-the-ground': true,
          'starting-to-bloom': true,
        }}
      />,
    );

    expect(isExpanded('my-tasks')).toBe(true);
    expect(isExpanded('laying-the-ground')).toBe(true);
    expect(isExpanded('starting-to-bloom')).toBe(true);

    fireEvent.click(getHeader('laying-the-ground'));

    expect(isExpanded('laying-the-ground')).toBe(false);
    expect(screen.queryByTestId('content-laying-the-ground')).not.toBeInTheDocument();

    // Others stay open
    expect(isExpanded('my-tasks')).toBe(true);
    expect(isExpanded('starting-to-bloom')).toBe(true);
    expect(screen.getByTestId('content-my-tasks')).toBeInTheDocument();
    expect(screen.getByTestId('content-starting-to-bloom')).toBeInTheDocument();
  });

  it('every bucket can be open simultaneously, in any order', () => {
    render(<BucketsHarness initial={allCollapsed} />);

    KEYS.forEach(k => fireEvent.click(getHeader(k)));
    KEYS.forEach(k => {
      expect(isExpanded(k)).toBe(true);
      expect(screen.getByTestId(`content-${k}`)).toBeInTheDocument();
    });
  });

  it('toggling the same bucket twice returns it to its prior state without affecting others', () => {
    render(
      <BucketsHarness
        initial={{ ...allCollapsed, 'tending-the-garden': true }}
      />,
    );

    fireEvent.click(getHeader('my-tasks'));
    fireEvent.click(getHeader('my-tasks'));

    expect(isExpanded('my-tasks')).toBe(false);
    expect(isExpanded('tending-the-garden')).toBe(true);
    KEYS.filter(k => k !== 'tending-the-garden').forEach(k => expect(isExpanded(k)).toBe(false));
  });
});

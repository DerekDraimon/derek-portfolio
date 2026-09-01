import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// jsdom does not execute real CSS (the Vitest config runs with `css:false`),
// so a rendered-DOM assertion can't observe the browser's default body
// margin. This is a structural regression guard on the source file: the
// UA stylesheet gives `body` an ~8px margin by default, which shows up as
// white bars around the `.dz` container (which fills the viewport but not
// the margin outside it) unless it's explicitly reset.
const css = readFileSync(resolve(process.cwd(), 'src/styles/base.css'), 'utf-8');

describe('base.css document-level reset', () => {
  it('resets the default body margin so no white bars show around .dz', () => {
    expect(css).toMatch(/body\s*\{[^}]*margin:\s*0/);
  });

  it('matches the dark background on body so overscroll bounce is not white', () => {
    expect(css).toMatch(/body\s*\{[^}]*background:\s*var\(--ink\)/);
  });

  it('smooth-scrolls in-page anchor jumps (e.g. the hero CTA to #contact)', () => {
    expect(css).toMatch(/html\s*\{[^}]*scroll-behavior:\s*smooth/);
  });

  it('disables smooth scrolling for prefers-reduced-motion', () => {
    const reducedMotionBlockMatch = css.match(/@media \(prefers-reduced-motion: reduce\)\{([\s\S]*?)\n\}/);
    expect(reducedMotionBlockMatch).not.toBeNull();
    expect(reducedMotionBlockMatch[1]).toMatch(/html\s*\{[^}]*scroll-behavior:\s*auto/);
  });
});

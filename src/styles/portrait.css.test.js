import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// jsdom does not execute real CSS (the Vitest config runs with `css:false`,
// per the design's test-architecture notes), so a rendered-DOM assertion
// can't observe media-query behavior. This is a structural regression
// guard on the source file instead: it verifies the hover-only tint/
// desaturation rules stay gated behind `@media (hover: hover)` — so a
// touch device (which never matches `:hover`) is not stuck on the
// permanently-desaturated default — and that a `(hover: none)` fallback
// exists to show the revealed portrait on touch by default.
const css = readFileSync(resolve(process.cwd(), 'src/styles/portrait.css'), 'utf-8');

describe('portrait.css hover behavior', () => {
  it('wraps the hover-reveal rules in a (hover: hover) media query', () => {
    expect(css).toMatch(/@media \(hover: hover\)[^}]*\{[\s\S]*?\.dz-portrait \.frame:hover img/);
  });

  it('provides a (hover: none) fallback that reveals the portrait by default on touch', () => {
    const touchBlockMatch = css.match(/@media \(hover: none\)\{([\s\S]*?)\n\}/);
    expect(touchBlockMatch).not.toBeNull();
    const touchBlock = touchBlockMatch[1];
    expect(touchBlock).toMatch(/\.dz-portrait img\{[^}]*filter:grayscale\(0\.1\)/);
    expect(touchBlock).toMatch(/\.dz-portrait \.tint\{[^}]*opacity:0/);
  });
});

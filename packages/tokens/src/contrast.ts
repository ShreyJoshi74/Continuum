/**
 * WCAG 2.1 contrast math, operating on the actual color strings tokens.ts
 * ships (hex or rgba()) — not hand-typed approximations of them, so a
 * color change that breaks AA gets caught by whatever test calls this,
 * automatically.
 */
interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

function parseColor(input: string): RGBA {
  const hex = /^#([0-9a-f]{6})$/i.exec(input.trim());
  if (hex) {
    const value = hex[1] as string;
    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16),
      a: 1,
    };
  }

  const rgba = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/.exec(input);
  if (rgba) {
    return {
      r: Number(rgba[1]),
      g: Number(rgba[2]),
      b: Number(rgba[3]),
      a: rgba[4] !== undefined ? Number(rgba[4]) : 1,
    };
  }

  throw new Error(`contrast.ts: unrecognized color format "${input}"`);
}

/** Alpha-composites a translucent foreground onto an opaque background — a box-shadow glow at 35% opacity is much lighter, visually, than the same RGB at full strength. */
function compositeOver(fg: RGBA, bg: RGBA): RGBA {
  return {
    r: fg.a * fg.r + (1 - fg.a) * bg.r,
    g: fg.a * fg.g + (1 - fg.a) * bg.g,
    b: fg.a * fg.b + (1 - fg.a) * bg.b,
    a: 1,
  };
}

function relativeLuminance({ r, g, b }: RGBA): number {
  const channels = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  const rs = channels[0] ?? 0;
  const gs = channels[1] ?? 0;
  const bs = channels[2] ?? 0;
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * WCAG contrast ratio between a foreground and an opaque background,
 * accounting for the foreground's own alpha (as in a translucent focus
 * glow) by compositing it onto the background first. Accepts hex
 * (#rrggbb) or rgb()/rgba() strings — exactly what tokens.ts and the
 * generated CSS both use.
 */
export function contrastRatio(foreground: string, background: string): number {
  const fg = parseColor(foreground);
  const bg = parseColor(background);
  const effectiveFg = fg.a < 1 ? compositeOver(fg, bg) : fg;

  const l1 = relativeLuminance(effectiveFg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Pulls the rgba()/rgb() color out of a box-shadow value like "0 0 0 8px rgba(255, 255, 255, 0.35)". */
export function extractShadowColor(boxShadow: string): string {
  const match = /rgba?\([^)]*\)/.exec(boxShadow);
  if (!match) throw new Error(`contrast.ts: no color found in box-shadow "${boxShadow}"`);
  return match[0];
}

const HEX = /^#([0-9a-f]{6})$/i;

function channel(value: number): number {
  const s = value / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const match = HEX.exec(hex);
  if (!match) throw new Error(`Invalid hex color: ${hex}`);
  const n = match[1];
  const [r, g, b] = [0, 2, 4].map((i) => channel(parseInt(n.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: string, background: string): number {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function parseScssColorMap(source: string, mapName: string): Record<string, string> {
  const block = new RegExp(`\\$${mapName}:\\s*\\(([\\s\\S]*?)\\);`).exec(source);
  if (!block) throw new Error(`SCSS map not found: $${mapName}`);
  const result: Record<string, string> = {};
  for (const [, key, value] of block[1].matchAll(/([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\b/g)) {
    result[key] = value;
  }
  return result;
}

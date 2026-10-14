type TiltInput = { x: number; y: number; width: number; height: number; max?: number };
type Tilt = { rotateX: number; rotateY: number; glowX: number; glowY: number };

const NEUTRAL: Tilt = { rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 };

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// -0을 만들지 않도록 +0을 더한다.
function round(value: number): number {
  return Math.round(value * 100) / 100 + 0;
}

export function tiltAngles({ x, y, width, height, max = 4 }: TiltInput): Tilt {
  if (![x, y, width, height, max].every(Number.isFinite) || width <= 0 || height <= 0) return { ...NEUTRAL };

  const nx = clamp((x / width) * 2 - 1, -1, 1);
  const ny = clamp((y / height) * 2 - 1, -1, 1);

  return {
    rotateX: round(-ny * max),
    rotateY: round(nx * max),
    glowX: round((nx + 1) * 50),
    glowY: round((ny + 1) * 50)
  };
}

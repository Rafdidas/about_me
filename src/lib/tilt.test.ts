import { tiltAngles } from "./tilt";

const box = { width: 200, height: 100 };

describe("tiltAngles", () => {
  it("중앙에서는 기울지 않는다", () => {
    expect(tiltAngles({ x: 100, y: 50, ...box })).toEqual({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });
  });

  it("오른쪽 아래 모서리는 최대 각도(기본 4°)", () => {
    const result = tiltAngles({ x: 200, y: 100, ...box });
    expect(result.rotateY).toBe(4);
    expect(result.rotateX).toBe(-4);
    expect(result.glowX).toBe(100);
    expect(result.glowY).toBe(100);
  });

  it("범위 밖 좌표는 최대 각도를 넘지 않는다", () => {
    const result = tiltAngles({ x: 9999, y: -9999, ...box });
    expect(Math.abs(result.rotateX)).toBeLessThanOrEqual(4);
    expect(Math.abs(result.rotateY)).toBeLessThanOrEqual(4);
    expect(result.glowX).toBeLessThanOrEqual(100);
    expect(result.glowY).toBeGreaterThanOrEqual(0);
  });

  it("max 인자를 따른다", () => {
    expect(tiltAngles({ x: 200, y: 50, ...box, max: 10 }).rotateY).toBe(10);
  });

  it("크기가 0이거나 NaN이면 중립값(NaN·-0 없음)", () => {
    const neutral = { rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 };
    expect(tiltAngles({ x: 10, y: 10, width: 0, height: 100 })).toEqual(neutral);
    expect(tiltAngles({ x: 10, y: 10, width: 100, height: 0 })).toEqual(neutral);
    expect(tiltAngles({ x: Number.NaN, y: 10, ...box })).toEqual(neutral);
    expect(Object.is(tiltAngles({ x: 100, y: 50, ...box }).rotateX, 0)).toBe(true);
  });
});

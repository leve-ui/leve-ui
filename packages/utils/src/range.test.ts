import { describe, expect, it } from 'vitest';
import { clamp, valueToPercent } from './range';

describe('clamp', () => {
  it('範囲内の値はそのまま返す', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('範囲外の値は min / max に丸める', () => {
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });
});

describe('valueToPercent', () => {
  it('範囲に対する割合を返す', () => {
    expect(valueToPercent(25, 0, 100)).toBe(25);
    expect(valueToPercent(15, 10, 20)).toBe(50);
  });

  it('範囲外の値は 0 / 100 に丸める', () => {
    expect(valueToPercent(-5, 0, 100)).toBe(0);
    expect(valueToPercent(150, 0, 100)).toBe(100);
  });

  it('max <= min のときは 0 を返す', () => {
    expect(valueToPercent(5, 10, 10)).toBe(0);
  });
});

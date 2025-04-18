import * as assert from 'node:assert';

import { RollingWindow } from './RollingWindow';

describe('RollingWindow', () => {
  it('should create an empty RollingWindow', () => {
    const window = new RollingWindow(5);
    assert.strictEqual(window.length, 0);
  });

  it('should push values and maintain window size', () => {
    const window = new RollingWindow(3);
    window.push(1);
    assert.strictEqual(window.length, 1);
    window.push(2);
    assert.strictEqual(window.length, 2);
    window.push(3);
    assert.strictEqual(window.length, 3);
    window.push(4);
    assert.strictEqual(window.length, 3);
    assert.strictEqual(window[0], 2);
    assert.strictEqual(window[1], 3);
    assert.strictEqual(window[2], 4);
  });

  it('should unshift values and maintain window size', () => {
    const window = new RollingWindow(3);
    window.unshift(1);
    assert.strictEqual(window.length, 1);
    window.unshift(2);
    assert.strictEqual(window.length, 2);
    window.unshift(3);
    assert.strictEqual(window.length, 3);
    window.unshift(4);
    assert.strictEqual(window.length, 3);
    assert.strictEqual(window[0], 4);
    assert.strictEqual(window[1], 3);
    assert.strictEqual(window[2], 2);
  });

  it('should calculate the sum of values', () => {
    const window = new RollingWindow(3);
    window.push(1);
    window.push(2);
    window.push(3);
    assert.strictEqual(window.sum(), 6);
    window.push(4);
    assert.strictEqual(window.sum(), 9);
  });

  it('should calculate the average of values', () => {
    const window = new RollingWindow(3);
    window.push(1);
    window.push(2);
    window.push(3);
    assert.strictEqual(window.avg(), 2);
    window.push(4);
    assert.strictEqual(window.avg(), 3);
  });

  it('should find the highest value', () => {
    const window = new RollingWindow(3);
    window.push(1);
    window.push(5);
    window.push(3);
    assert.strictEqual(window.highest(), 5);
    window.push(2);
    assert.strictEqual(window.highest(), 5);
    window.push(6);
    assert.strictEqual(window.highest(), 6);
  });

  it('should find the lowest value', () => {
    const window = new RollingWindow(3);
    window.push(5);
    window.push(1);
    window.push(3);
    assert.strictEqual(window.lowest(), 1);
    window.push(2);
    assert.strictEqual(window.lowest(), 1);
    window.push(0);
    assert.strictEqual(window.lowest(), 0);
  });

  it('should handle empty window for sum, avg, highest, lowest', () => {
    const window = new RollingWindow(3);
    assert.strictEqual(window.sum(), 0);
    assert.ok(Number.isNaN(window.avg()));
    assert.strictEqual(window.highest(), -Infinity);
    assert.strictEqual(window.lowest(), Infinity);
  });

  it('should return true when the window is filled', () => {
    const window = new RollingWindow(3);
    window.push(1);
    assert.strictEqual(window.filled(), false);
    window.push(2);
    window.push(3);
    assert.strictEqual(window.filled(), true);
    window.push(4);
    assert.strictEqual(window.filled(), true);
  });
});

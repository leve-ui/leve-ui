import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { getElementByIdInContainer } from './dom';

const { screen } = await createDOM();
const doc = screen.ownerDocument as unknown as Document;

describe('getElementByIdInContainer', () => {
  it('同じ id が複数のコンテナにあるとき、from と同じコンテナの要素を返す', () => {
    const page = doc.createElement('div');
    page.innerHTML = `
      <div q:container="resumed" id="first"><button id="trigger">1</button><div class="from-1"></div></div>
      <div q:container="resumed" id="second"><button id="trigger">2</button><div class="from-2"></div></div>
    `;
    doc.body.appendChild(page);
    const from = page.querySelector('.from-2');
    if (!from) throw new Error('no element');
    expect(getElementByIdInContainer(from, 'trigger')?.textContent).toBe('2');
    page.remove();
  });

  it('コンテナの外では document から探し、引用符を含む id も扱える', () => {
    const page = doc.createElement('div');
    page.innerHTML = `<span id='a"b'>x</span><div class="from"></div>`;
    doc.body.appendChild(page);
    const from = page.querySelector('.from');
    if (!from) throw new Error('no element');
    expect(getElementByIdInContainer(from, 'a"b')?.textContent).toBe('x');
    expect(getElementByIdInContainer(from, 'missing')).toBeNull();
    page.remove();
  });
});

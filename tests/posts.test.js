import assert from 'node:assert/strict';
import test from 'node:test';

import {
  formatKoreanDateTime,
  getMachineDateTime,
  getPostCategory,
  getPostThumbnail,
  getPostUrl,
  getReadingTime,
  normalizePostCategory
} from '../src/utils/posts.js';

test('normalizes post categories and keeps a safe fallback', () => {
  assert.equal(normalizePostCategory('study'), 'study');
  assert.equal(normalizePostCategory('unknown'), 'essay');
  assert.equal(normalizePostCategory('unknown', 'books'), 'books');
  assert.equal(getPostCategory({ category: 'portfolio' }, 'essay'), 'portfolio');
  assert.equal(getPostCategory({ category: 'missing' }, 'study'), 'study');
});

test('builds post URLs from frontmatter category before folder fallback', () => {
  assert.equal(
    getPostUrl({ category: 'study' }, 'essay', '2026-06-03-note'),
    '/study/2026-06-03-note/'
  );
  assert.equal(
    getPostUrl({ category: 'invalid' }, 'books', '2026-06-03-note'),
    '/books/2026-06-03-note/'
  );
});

test('chooses thumbnails from cover, markdown image, then html image', () => {
  assert.equal(
    getPostThumbnail({ cover: '/images/uploads/cover.png' }, '![alt](/fallback.png)'),
    '/images/uploads/cover.png'
  );
  assert.equal(getPostThumbnail({}, '문장\n\n![alt](/images/uploads/a.png)'), '/images/uploads/a.png');
  assert.equal(
    getPostThumbnail({}, '<p>문장</p><img src="/images/uploads/b.jpg" alt="">'),
    '/images/uploads/b.jpg'
  );
});

test('formats date-only values as Korea time instead of UTC midnight', () => {
  assert.equal(getMachineDateTime('2026-06-03'), '2026-06-02T15:00:00.000Z');
  assert.equal(formatKoreanDateTime('2026-06-03'), '2026-06-03 00:00 (수) KST');
});

test('estimates reading time with markdown and html stripped', () => {
  assert.equal(getReadingTime(''), 1);
  assert.equal(getReadingTime('짧은 문장입니다.'), 1);
  assert.equal(getReadingTime('![alt](/a.png)\n\n`code`\n\n한국어 '.repeat(500)), 3);
});

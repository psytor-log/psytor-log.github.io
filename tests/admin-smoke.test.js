import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const adminSourcePath = new URL('../src/pages/admin.astro', import.meta.url);
const adminConfigPath = new URL('../public/admin/config.yml', import.meta.url);
const builtAdminPath = new URL('../dist/admin/index.html', import.meta.url);

const loadBlankLinePreserver = (source) => {
  const helperSource = source.match(
    /const preserveExtraBlankLinesInText[\s\S]*?const preserveExtraBlankLines[\s\S]*?\.join\(''\);/,
  );
  assert.ok(helperSource, 'blank-line preservation helpers should exist');
  return Function(`${helperSource[0]}; return preserveExtraBlankLines;`)();
};

test('admin editor keeps the blank-line preservation hooks registered', async () => {
  const source = await readFile(adminSourcePath, 'utf8');

  assert.match(source, /preserveExtraBlankLines/);
  assert.match(source, /CMS\.registerEditorComponent\(\{\s*id:\s*'line-space'/);
  assert.match(source, /CMS\.registerEventListener\(\{\s*name:\s*'preSave'/);
  assert.match(source, /class="cms-spacer cms-spacer--\$\{size\}"/);
  assert.match(source, /return data\.set\('body', preserveExtraBlankLines\(body\)\)/);
  assert.doesNotMatch(source, /return entry\.set\('data', data\.set\('body'/);
  assert.match(source, /bodyWidgetWithPreservedBlankLines/);
  assert.match(source, /props\.widgetFor\('body', undefined, previewData\)/);
  assert.doesNotMatch(source, /this\.props\.widgetFor\('body'\)/);
});

test('publish button immediately selects publish now without leaving a dropdown open', async () => {
  const source = await readFile(adminSourcePath, 'utf8');

  assert.match(source, /const enableDirectPublish = \(\) =>/);
  assert.match(source, /publishButtonLabels = new Set\(\['게시', 'Publish'\]\)/);
  assert.match(source, /publishNowLabels = new Set\(\['지금 게시', 'Publish now'\]\)/);
  assert.match(source, /publishNowItem\.click\(\)/);
  assert.match(source, /new MutationObserver\(publishFromOpenedMenu\)/);
  assert.match(source, /target\?\.closest\('button, \[role="button"\]'\)/);
});

test('preview templates use Decap 3.15 global React helpers', async () => {
  const source = await readFile(adminSourcePath, 'utf8');

  assert.match(source, /const h = window\.h/);
  assert.match(source, /const createClass = window\.createClass/);
  assert.doesNotMatch(source, /const h = CMS\.h/);
  assert.doesNotMatch(source, /const createClass = CMS\.createClass/);
});

test('blank-line preservation keeps extra spacing for save and live preview', async () => {
  const source = await readFile(adminSourcePath, 'utf8');
  const preserveExtraBlankLines = loadBlankLinePreserver(source);

  assert.equal(
    preserveExtraBlankLines('첫 문단\n\n\n둘째 문단'),
    '첫 문단\n\n<div class="cms-spacer cms-spacer--1" aria-hidden="true"></div>\n\n둘째 문단',
  );
  assert.equal(
    preserveExtraBlankLines('첫 문단\n\n\n\n둘째 문단'),
    '첫 문단\n\n<div class="cms-spacer cms-spacer--1" aria-hidden="true"></div>\n<div class="cms-spacer cms-spacer--1" aria-hidden="true"></div>\n\n둘째 문단',
  );
  assert.equal(
    preserveExtraBlankLines('```\n첫 줄\n\n\n둘째 줄\n```'),
    '```\n첫 줄\n\n\n둘째 줄\n```',
  );
});

test('Decap config exposes category changes and Plate richtext mode for every post collection', async () => {
  const config = await readFile(adminConfigPath, 'utf8');
  const categories = ['essay', 'study', 'books', 'portfolio'];

  for (const category of categories) {
    assert.match(config, new RegExp(`- name: "${category}"[\\s\\S]*?name: "category"`));
    assert.match(config, new RegExp(`- name: "${category}"[\\s\\S]*?default: "${category}"`));
    assert.match(config, new RegExp(`- name: "${category}"[\\s\\S]*?widget: "richtext"`));
    assert.match(config, new RegExp(`- name: "${category}"[\\s\\S]*?editor_components: \\["sized-image", "line-space"\\]`));
  }

  assert.match(config, /preview_path: "\{\{category\}\}\/\{\{slug\}\}\/"/);
  assert.match(config, /default_mode: "rich_text"/);
  assert.match(config, /modes: \["rich_text", "raw"\]/);
  assert.doesNotMatch(config, /name: "body", widget: "markdown"/);
});

test('built admin page contains the editor smoke-test markers', async () => {
  const builtAdmin = await readFile(builtAdminPath, 'utf8');

  assert.match(builtAdmin, /cms-config-url/);
  assert.match(builtAdmin, /decap-cms@3\.15\.1/);
  assert.match(builtAdmin, /enableDirectPublish/);
  assert.match(builtAdmin, /line-space/);
  assert.match(builtAdmin, /preserveExtraBlankLines/);
  assert.match(builtAdmin, /return data\.set\('body', preserveExtraBlankLines\(body\)\)/);
  assert.match(builtAdmin, /props\.widgetFor\('body', undefined, previewData\)/);
  assert.match(builtAdmin, /githubstatus\.com\/api\/v2\/components\.json/);
});

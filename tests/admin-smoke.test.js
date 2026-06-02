import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const adminSourcePath = new URL('../src/pages/admin.astro', import.meta.url);
const adminConfigPath = new URL('../public/admin/config.yml', import.meta.url);
const builtAdminPath = new URL('../dist/admin/index.html', import.meta.url);

test('admin editor keeps the blank-line preservation hooks registered', async () => {
  const source = await readFile(adminSourcePath, 'utf8');

  assert.match(source, /preserveExtraBlankLines/);
  assert.match(source, /CMS\.registerEditorComponent\(\{\s*id:\s*'line-space'/);
  assert.match(source, /CMS\.registerEventListener\(\{\s*name:\s*'preSave'/);
  assert.match(source, /class="cms-spacer cms-spacer--\$\{size\}"/);
});

test('Decap config exposes category changes and raw markdown mode for every post collection', async () => {
  const config = await readFile(adminConfigPath, 'utf8');
  const categories = ['essay', 'study', 'books', 'portfolio'];

  for (const category of categories) {
    assert.match(config, new RegExp(`- name: "${category}"[\\s\\S]*?name: "category"`));
    assert.match(config, new RegExp(`- name: "${category}"[\\s\\S]*?default: "${category}"`));
    assert.match(config, new RegExp(`- name: "${category}"[\\s\\S]*?editor_components: \\["sized-image", "line-space"\\]`));
  }

  assert.match(config, /preview_path: "\{\{category\}\}\/\{\{slug\}\}\/"/);
  assert.match(config, /default_mode: "raw"/);
  assert.match(config, /modes: \["raw", "rich_text"\]/);
});

test('built admin page contains the editor smoke-test markers', async () => {
  const builtAdmin = await readFile(builtAdminPath, 'utf8');

  assert.match(builtAdmin, /cms-config-url/);
  assert.match(builtAdmin, /line-space/);
  assert.match(builtAdmin, /preserveExtraBlankLines/);
  assert.match(builtAdmin, /githubstatus\.com\/api\/v2\/components\.json/);
});

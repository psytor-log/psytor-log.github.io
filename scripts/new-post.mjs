import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const today = new Date().toISOString().slice(0, 10);
const now = () => new Date().toISOString();

const paths = {
  posts: path.join(root, 'inbox', 'posts'),
  images: path.join(root, 'inbox', 'images'),
  processed: path.join(root, 'inbox', 'processed'),
  content: path.join(root, 'content'),
  publicImages: path.join(root, 'public', 'images'),
  tags: path.join(root, 'content', 'tags.json'),
  log: path.join(root, 'log.txt')
};

const categoryRules = {
  portfolio: ['프로젝트', '만든', '구현', '실험', '자동화', 'codex', 'ga bot', 'tmoc', '결과', '문제', '해결', '배운 점', '포트폴리오'],
  books: ['책', '독서', '저자', '문장', '읽은', '요약', '출판', 'book'],
  study: ['공부', '개념', '정리', '프레임워크', '도구', '이론', '학습', '코드', '프로그래밍', 'astro', 'markdown', 'javascript', 'python'],
  essay: ['생각', '관찰', '삶', '이해', '판단', '성장', '변화', '일의 변화', '문제의식']
};

const tagRules = [
  ['AI', ['ai', '인공지능', 'llm', 'gpt']],
  ['자동화', ['자동화', 'automation', 'bot']],
  ['일의 변화', ['일의 변화', '업무 변화', '변화']],
  ['이해', ['이해']],
  ['판단', ['판단', '의사결정']],
  ['HR', ['hr', '인사']],
  ['채용', ['채용']],
  ['평가', ['평가']],
  ['면접', ['면접']],
  ['TMOC', ['tmoc']],
  ['역량분자', ['역량분자']],
  ['Codex', ['codex']],
  ['프로토타입', ['프로토타입', 'prototype']],
  ['개발실험', ['개발실험', '실험']],
  ['Astro', ['astro']],
  ['Markdown', ['markdown', '마크다운']],
  ['GitHub Pages', ['github pages', '깃허브 pages']],
  ['책', ['책', '도서']],
  ['독서노트', ['독서', '읽은', '문장']]
];

const categoryDefaultTags = {
  essay: ['기록', '생각', '문제의식'],
  study: ['공부', '개념정리', '기록'],
  books: ['책', '독서노트', '기록'],
  portfolio: ['프로젝트', '자동화', '기록']
};

async function ensureDirs() {
  await Promise.all([
    fs.mkdir(paths.posts, { recursive: true }),
    fs.mkdir(paths.images, { recursive: true }),
    fs.mkdir(paths.processed, { recursive: true }),
    ...['essay', 'study', 'books', 'portfolio'].map((category) => fs.mkdir(path.join(paths.content, category), { recursive: true })),
    ...['essay', 'study', 'books', 'portfolio', 'common'].map((category) => fs.mkdir(path.join(paths.publicImages, category), { recursive: true }))
  ]);
}

function normalize(text) {
  return text.toLowerCase();
}

function countMatches(text, keywords) {
  return keywords.reduce((score, keyword) => score + (text.includes(keyword.toLowerCase()) ? 1 : 0), 0);
}

function classify(text) {
  const normalized = normalize(text);
  const scores = Object.entries(categoryRules).map(([category, keywords]) => [category, countMatches(normalized, keywords)]);
  scores.sort((a, b) => b[1] - a[1]);
  const [category, score] = scores[0];
  return {
    category: score > 0 ? category : 'essay',
    reason: score > 0 ? `${category} 키워드 ${score}개 감지` : '명확한 분류 단서가 없어 essay 기본값 적용'
  };
}

function extractTitle(raw, fileName) {
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const heading = lines.find((line) => /^#\s+/.test(line));
  if (heading) return heading.replace(/^#\s+/, '').trim();
  const titleLine = lines.find((line) => line.length <= 80 && !/[.?!。]$/.test(line));
  if (titleLine) return titleLine.replace(/^title\s*[:：]\s*/i, '').trim();
  const firstSentence = raw.replace(/\s+/g, ' ').split(/(?<=[.!?。]|다\.|요\.)\s+/)[0]?.trim();
  return firstSentence && firstSentence.length <= 70 ? firstSentence : path.parse(fileName).name;
}

function makeSummary(raw) {
  const body = raw
    .replace(/^---[\s\S]*?---/, '')
    .replace(/^#.+$/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!body) return '초안 내용을 바탕으로 정리한 글입니다.';
  const sentences = body.match(/[^.!?。]+(?:[.!?。]|다\.|요\.)?/g) ?? [body];
  return sentences.slice(0, 2).join(' ').trim().slice(0, 180);
}

function makeSlug(title, raw) {
  const source = `${title} ${raw}`;
  const dictionary = [
    ['ai', 'ai'],
    ['codex', 'codex'],
    ['astro', 'astro'],
    ['markdown', 'markdown'],
    ['github', 'github'],
    ['portfolio', 'portfolio'],
    ['study', 'study'],
    ['book', 'book'],
    ['hr', 'hr'],
    ['tmoc', 'tmoc'],
    ['automation', 'automation'],
    ['thinking', 'thinking'],
    ['log', 'log'],
    ['이해', 'understanding'],
    ['판단', 'judgment'],
    ['생각', 'thinking'],
    ['공부', 'study'],
    ['책', 'book'],
    ['독서', 'reading'],
    ['자동화', 'automation'],
    ['평가', 'evaluation'],
    ['면접', 'interview'],
    ['채용', 'recruiting'],
    ['프로젝트', 'project'],
    ['기록', 'log'],
    ['변화', 'change'],
    ['일', 'work']
  ];
  const words = [];
  const lower = source.toLowerCase();
  for (const [needle, word] of dictionary) {
    if (lower.includes(needle) && !words.includes(word)) words.push(word);
  }
  const ascii = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  const base = ascii || words.slice(0, 5).join('-') || `post-${crypto.createHash('sha1').update(title).digest('hex').slice(0, 8)}`;
  return base.slice(0, 70).replace(/^-|-$/g, '');
}

function makeTags(raw, category) {
  const normalized = normalize(raw);
  const tags = [];
  for (const [tag, keywords] of tagRules) {
    if (keywords.some((keyword) => normalized.includes(keyword.toLowerCase()))) tags.push(tag);
  }
  for (const tag of categoryDefaultTags[category]) {
    if (tags.length >= 3) break;
    if (!tags.includes(tag)) tags.push(tag);
  }
  return [...new Set(tags)].slice(0, 7);
}

function cleanBody(raw, category, title, coverPath) {
  let body = raw.replace(/^---[\s\S]*?---/, '').trim();
  body = body.replace(/^#\s+.+\r?\n?/, '').trim();
  body = body.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n');

  const templateHeads = {
    essay: ['오늘의 문제의식', '생각의 전개', '지금 남은 생각'],
    study: ['공부한 주제', '핵심 개념', '내가 이해한 방식', '예시 또는 적용 가능성', '다시 볼 포인트'],
    books: ['책 정보', '핵심 내용', '인상 깊었던 부분', '내 생각', '다시 읽을 이유'],
    portfolio: ['문제', '목표', '접근 방식', '구현 또는 실험 내용', '결과', '배운 점', '다음 개선 방향']
  };

  const hasHeading = /^##\s+/m.test(body);
  const intro = body || `${title}에 대한 초안을 홈페이지용 글로 정리했습니다.`;
  const imageMarkdown = coverPath ? `\n\n![${title}](${coverPath})` : '';

  if (hasHeading) return `${imageMarkdown}\n\n${intro}`.trim();

  const [first, ...rest] = intro.split(/\n\n+/);
  const restText = rest.join('\n\n').trim();
  const heads = templateHeads[category];
  const sections = [`${imageMarkdown}\n\n${first}`.trim()];
  sections.push(`## ${heads[1] ?? heads[0]}\n\n${restText || '초안의 핵심 내용을 이곳에 이어서 정리합니다.'}`);
  sections.push(`## ${heads.at(-1)}\n\n나중에 다시 읽으며 보완할 지점을 남깁니다.`);
  return sections.join('\n\n');
}

async function uniquePath(filePath) {
  const parsed = path.parse(filePath);
  let candidate = filePath;
  let index = 2;
  while (await exists(candidate)) {
    candidate = path.join(parsed.dir, `${parsed.name}-${index}${parsed.ext}`);
    index += 1;
  }
  return candidate;
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function chooseImage(title, raw, category, slug) {
  const files = (await fs.readdir(paths.images).catch(() => []))
    .filter((file) => /\.(jpe?g|png|webp)$/i.test(file));
  if (files.length === 0) {
    return { cover: '', imageFile: '', reason: 'inbox/images에 이미지 없음' };
  }

  const target = normalize(`${title} ${raw}`);
  const scored = files.map((file) => {
    const name = normalize(path.parse(file).name).replace(/[-_]/g, ' ');
    const parts = name.split(/\s+/).filter(Boolean);
    const score = parts.reduce((sum, part) => sum + (target.includes(part) ? 1 : 0), 0) + (name.includes(category) ? 1 : 0);
    return { file, score };
  }).sort((a, b) => b.score - a.score);

  const selected = scored[0];
  const ext = path.extname(selected.file).toLowerCase();
  const newName = `${today}-${slug}-cover${ext}`;
  const from = path.join(paths.images, selected.file);
  const to = await uniquePath(path.join(paths.publicImages, category, newName));
  await fs.copyFile(from, to);
  return {
    cover: `/images/${category}/${path.basename(to)}`,
    imageFile: selected.file,
    reason: selected.score > 0 ? '제목과 본문 키워드가 이미지 파일명과 일부 일치' : '명확한 일치가 없어 사용 가능한 첫 이미지 선택'
  };
}

function frontmatter({ title, category, tags, summary, cover, sourceFile }) {
  const escapedTitle = title.replace(/"/g, '\\"');
  const escapedSummary = summary.replace(/"/g, '\\"');
  return [
    '---',
    `title: "${escapedTitle}"`,
    `date: ${today}`,
    `category: "${category}"`,
    `tags: [${tags.map((tag) => `"${tag.replace(/"/g, '\\"')}"`).join(', ')}]`,
    `summary: "${escapedSummary}"`,
    `cover: "${cover}"`,
    'draft: false',
    `source_file: "${sourceFile.replace(/"/g, '\\"')}"`,
    'created_by: "codex"',
    '---'
  ].join('\n');
}

async function loadTags() {
  if (!(await exists(paths.tags))) return {};
  return JSON.parse(await fs.readFile(paths.tags, 'utf8'));
}

async function updateTags(tagsData, tags, category) {
  const newTags = [];
  const reusedTags = [];
  for (const tag of tags) {
    if (!tagsData[tag]) {
      tagsData[tag] = {
        first_used_date: today,
        last_used_date: today,
        count: 0,
        related_categories: []
      };
      newTags.push(tag);
    } else {
      reusedTags.push(tag);
    }
    tagsData[tag].last_used_date = today;
    tagsData[tag].count += 1;
    if (!tagsData[tag].related_categories.includes(category)) {
      tagsData[tag].related_categories.push(category);
      tagsData[tag].related_categories.sort();
    }
  }
  await fs.writeFile(paths.tags, `${JSON.stringify(tagsData, null, 2)}\n`, 'utf8');
  return { newTags, reusedTags };
}

async function processDraft(file, tagsData) {
  const sourcePath = path.join(paths.posts, file);
  const raw = await fs.readFile(sourcePath, 'utf8');
  const title = extractTitle(raw, file);
  const summary = makeSummary(raw);
  const { category, reason } = classify(`${title}\n${raw}`);
  const tags = makeTags(`${title}\n${raw}`, category);
  const slug = makeSlug(title, raw);
  const image = await chooseImage(title, raw, category, slug);
  const body = cleanBody(raw, category, title, image.cover);
  const markdown = `${frontmatter({ title, category, tags, summary, cover: image.cover, sourceFile: file })}\n\n${body}\n`;
  const outPath = await uniquePath(path.join(paths.content, category, `${today}-${slug}.md`));
  await fs.writeFile(outPath, markdown, 'utf8');

  const { newTags, reusedTags } = await updateTags(tagsData, tags, category);
  const processedPath = await uniquePath(path.join(paths.processed, file));
  await fs.rename(sourcePath, processedPath);

  const defaults = [];
  if (category === 'essay' && reason.includes('기본값')) defaults.push('category=essay');
  if (!image.cover) defaults.push('cover=""');

  return {
    file,
    output: path.relative(root, outPath),
    category,
    reason,
    title,
    summary,
    tags,
    newTags,
    reusedTags,
    image,
    defaults,
    processed: path.relative(root, processedPath)
  };
}

function logEntry(result) {
  return [
    '',
    `## ${now()}`,
    '- 실행한 작업: npm run new-post',
    `- 처리한 초안 파일명: ${result.file}`,
    `- 생성된 Markdown 파일명: ${result.output}`,
    `- 선택된 카테고리: ${result.category}`,
    `- 카테고리 판단 근거: ${result.reason}`,
    `- 생성된 제목: ${result.title}`,
    `- 생성된 summary: ${result.summary}`,
    `- 생성된 tags: ${result.tags.join(', ')}`,
    `- 신규 생성된 tags: ${result.newTags.length ? result.newTags.join(', ') : '없음'}`,
    `- 기존 tags 재사용 여부: ${result.reusedTags.length ? result.reusedTags.join(', ') : '재사용 없음'}`,
    `- 연결한 이미지 파일: ${result.image.imageFile || '없음'}`,
    `- 이미지 선택 근거: ${result.image.reason}`,
    `- 적용한 기본값: ${result.defaults.length ? result.defaults.join(', ') : '없음'}`,
    '- 검토 필요사항: 자동 요약, 태그, 카테고리를 발행 전 확인 권장',
    '- 실패한 작업과 실패 사유: 없음',
    '- 다음 개선 포인트: 초안 성격이 명확하면 제목이나 첫 문단에 핵심 키워드 포함',
    `- 원본 이동 위치: ${result.processed}`
  ].join('\n');
}

async function main() {
  await ensureDirs();
  const drafts = (await fs.readdir(paths.posts))
    .filter((file) => /\.(txt|md)$/i.test(file))
    .sort();

  if (drafts.length === 0) {
    await fs.appendFile(paths.log, `\n## ${now()}\n- 실행한 작업: npm run new-post\n- 처리 결과: inbox/posts에 새 초안 파일 없음\n`, 'utf8');
    console.log('No draft files found in inbox/posts.');
    return;
  }

  const tagsData = await loadTags();
  const results = [];
  for (const draft of drafts) {
    try {
      results.push(await processDraft(draft, tagsData));
    } catch (error) {
      const failure = [
        '',
        `## ${now()}`,
        '- 실행한 작업: npm run new-post',
        `- 처리한 초안 파일명: ${draft}`,
        '- 실패한 작업과 실패 사유: 초안 처리 실패',
        `- 오류: ${error.message}`,
        '- 다음 개선 포인트: 파일 인코딩과 권한 확인'
      ].join('\n');
      await fs.appendFile(paths.log, `${failure}\n`, 'utf8');
      throw error;
    }
  }

  await fs.appendFile(paths.log, `${results.map(logEntry).join('\n')}\n`, 'utf8');
  console.log(`Processed ${results.length} draft(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

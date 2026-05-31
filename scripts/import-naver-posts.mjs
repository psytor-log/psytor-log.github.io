import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BLOG_ID = process.env.NAVER_BLOG_ID || 'coaching_blog';
const DEFAULT_LIMIT = Number(process.env.NAVER_IMPORT_LIMIT || 3);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const paths = {
  content: path.join(root, 'content'),
  uploads: path.join(root, 'public', 'images', 'uploads'),
  state: path.join(root, 'content', 'naver-import-state.json'),
  report: path.join(root, 'NAVER_IMPORT_REPORT.md')
};

const categoryMap = new Map([
  [29, 'books'],
  [48, 'essay'],
  [34, 'essay'],
  [13, 'essay'],
  [31, 'essay'],
  [55, 'essay'],
  [47, 'study'],
  [14, 'study'],
  [6, 'study'],
  [22, 'study'],
  [35, 'study'],
  [42, 'study'],
  [44, 'study'],
  [43, 'study'],
  [25, 'study'],
  [32, 'study'],
  [18, 'study'],
  [33, 'study'],
  [1, 'study'],
  [46, 'study'],
  [16, 'study'],
  [30, 'study'],
  [45, 'study'],
  [37, 'study'],
  [20, 'study'],
  [28, 'study'],
  [52, 'study'],
  [41, 'portfolio'],
  [17, 'portfolio']
]);

const categoryDefaultTags = {
  essay: ['기록', '생각'],
  study: ['공부', '기록'],
  books: ['책', '독서노트'],
  portfolio: ['프로젝트', '기록']
};

const studyCategoryNames = ['심리', '수학', '재테크', '코칭', '독서', 'AI', '자연어 처리', '시각화', '기술'];
const portfolioKeywords = [
  '만들기',
  '만들었다',
  '구현',
  '개발',
  '프로젝트',
  '서비스',
  '배포',
  '자동화',
  '홈페이지',
  'github',
  'codex',
  '대시보드',
  '프로토타입'
];
const booksKeywords = ['오늘부터 독서', '[오늘부터 독서]'];
const companyStudyKeywords = ['인재', '채용', '평가', '리더', '조직', '팀', 'HR', '면접', '전문성'];

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    limit: DEFAULT_LIMIT,
    dryRun: false,
    pages: Number(process.env.NAVER_IMPORT_PAGES || 30)
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--dry-run') parsed.dryRun = true;
    if (arg === '--limit') parsed.limit = Number(args[++i] || parsed.limit);
    if (arg.startsWith('--limit=')) parsed.limit = Number(arg.split('=')[1] || parsed.limit);
    if (arg === '--pages') parsed.pages = Number(args[++i] || parsed.pages);
    if (arg.startsWith('--pages=')) parsed.pages = Number(arg.split('=')[1] || parsed.pages);
  }

  if (!Number.isFinite(parsed.limit) || parsed.limit < 1) parsed.limit = DEFAULT_LIMIT;
  if (!Number.isFinite(parsed.pages) || parsed.pages < 1) parsed.pages = 30;
  return parsed;
}

async function main() {
  const options = parseArgs();
  await ensureDirs();

  const state = await loadState();
  const categories = await fetchCategories();
  const posts = await fetchPostList(options.pages);
  const candidates = posts.filter((post) => !state.importedLogNos.includes(String(post.logNo)));
  const selected = candidates.slice(0, options.limit);

  const results = [];
  for (const post of selected) {
    try {
      results.push(await importPost(post, categories, options));
    } catch (error) {
      results.push({
        logNo: String(post.logNo),
        title: decodeMaybe(post.title || post.titleWithInspectMessage || ''),
        status: 'failed',
        error: error.message
      });
    }
  }

  if (!options.dryRun) {
    const imported = results.filter((result) => result.status === 'imported');
    state.importedLogNos = [...new Set([...state.importedLogNos, ...imported.map((result) => String(result.logNo))])];
    state.lastRunAt = new Date().toISOString();
    state.lastResult = summarizeResults(results);
    await fs.writeFile(paths.state, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
    await appendReport(results, options);
  }

  console.log(JSON.stringify({ dryRun: options.dryRun, count: results.length, results }, null, 2));
}

async function ensureDirs() {
  await Promise.all([
    fs.mkdir(paths.uploads, { recursive: true }),
    ...['essay', 'study', 'books', 'portfolio'].map((category) =>
      fs.mkdir(path.join(paths.content, category), { recursive: true })
    )
  ]);
}

async function loadState() {
  try {
    const raw = await fs.readFile(paths.state, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      importedLogNos: Array.isArray(parsed.importedLogNos) ? parsed.importedLogNos.map(String) : [],
      lastRunAt: parsed.lastRunAt || '',
      lastResult: parsed.lastResult || {}
    };
  } catch {
    return { importedLogNos: [], lastRunAt: '', lastResult: {} };
  }
}

async function fetchCategories() {
  const url = `https://m.blog.naver.com/api/blogs/${BLOG_ID}/category-list`;
  const json = await fetchJson(url);
  const rows = json?.result?.mylogCategoryList || [];
  const map = new Map();
  for (const row of rows) {
    if (!row.divisionLine) {
      map.set(Number(row.categoryNo), {
        categoryNo: Number(row.categoryNo),
        parentCategoryNo: row.parentCategoryNo ? Number(row.parentCategoryNo) : null,
        categoryName: row.categoryName,
        postCnt: row.postCnt
      });
    }
  }
  return map;
}

async function fetchPostList(maxPages) {
  const all = [];
  for (let page = 1; page <= maxPages; page += 1) {
    const url = `https://m.blog.naver.com/api/blogs/${BLOG_ID}/post-list?categoryNo=0&itemCount=30&page=${page}`;
    const json = await fetchJson(url);
    const items = json?.result?.items || [];
    if (items.length === 0) break;
    all.push(...items);
    if (items.length < 30) break;
  }
  return all;
}

async function importPost(post, categories, options) {
  const logNo = String(post.logNo);
  const title = cleanText(decodeMaybe(post.titleWithInspectMessage || post.title || `naver-${logNo}`));
  const categoryInfo = categories.get(Number(post.categoryNo)) || {
    categoryName: post.categoryName || '',
    categoryNo: Number(post.categoryNo)
  };
  const sourceCategory = categoryInfo.categoryName || String(post.categoryNo || '');
  const url = `https://blog.naver.com/${BLOG_ID}/${logNo}`;
  const mobileUrl = `https://m.blog.naver.com/PostView.naver?blogId=${BLOG_ID}&logNo=${logNo}`;
  const html = await fetchText(mobileUrl);
  const extracted = await extractPostBody(html, title, logNo, options);
  const sourceText = `${title}\n${sourceCategory}\n${extracted.text}`;
  const category = chooseCategory(Number(post.categoryNo), sourceCategory, sourceText);
  const reviewNote = makeReviewNote(sourceCategory, category, sourceText);
  const date = parseNaverDate(post.addDate) || extractDate(html) || todayKst();
  const slug = await uniqueSlug(category, date, title, logNo);
  const summary = makeSummary(post.briefContents || extracted.text);
  const tags = makeTags(category, sourceCategory, sourceText);
  const markdown = buildMarkdown({
    title,
    date,
    category,
    tags,
    summary,
    sourceCategory,
    sourceUrl: url,
    logNo,
    reviewNote,
    body: extracted.markdown
  });
  const outPath = path.join(paths.content, category, `${date}-${slug}.md`);

  if (!options.dryRun) {
    await fs.writeFile(outPath, markdown, 'utf8');
  }

  return {
    status: options.dryRun ? 'dry-run' : 'imported',
    logNo,
    title,
    sourceCategory,
    category,
    path: path.relative(root, outPath).replace(/\\/g, '/'),
    reviewNote,
    images: extracted.images.length
  };
}

function chooseCategory(categoryNo, sourceCategory, text) {
  const normalized = text.toLowerCase();
  const mapped = categoryMap.get(categoryNo) || 'essay';

  if (mapped === 'books' || booksKeywords.some((keyword) => text.includes(keyword))) return 'books';

  if (categoryNo === 48 && companyStudyKeywords.some((keyword) => text.includes(keyword))) {
    return 'study';
  }

  if (portfolioKeywords.some((keyword) => normalized.includes(keyword.toLowerCase()))) {
    if (!studyCategoryNames.some((name) => sourceCategory.includes(name)) || categoryNo === 16 || categoryNo === 41) {
      return 'portfolio';
    }
  }

  return mapped;
}

function makeReviewNote(sourceCategory, category, text) {
  if (category === 'portfolio') {
    return `네이버 카테고리 '${sourceCategory}' 기준으로 확인했고, 제목/본문에 만들기/구현/프로젝트 성격이 있어 portfolio로 배치.`;
  }
  if (category === 'books') {
    return `네이버 카테고리 '${sourceCategory}' 기준으로 books에 배치.`;
  }
  if (category === 'study') {
    return `네이버 카테고리 '${sourceCategory}' 기준으로 study에 배치.`;
  }
  return `네이버 카테고리 '${sourceCategory}' 기준으로 essay에 배치.`;
}

async function extractPostBody(html, title, logNo, options) {
  const main = extractBalancedDiv(html, 'se-main-container') || extractByClass(html, 'post_ct') || html;
  const components = main.split(/<div class="se-component /g).slice(1).map((chunk) => `<div class="se-component ${chunk}`);
  const blocks = [];
  const images = [];
  const chunks = components.length ? components : [main];

  for (const chunk of chunks) {
    const imageMatches = [...chunk.matchAll(/<img\b[^>]*(?:data-lazy-src|src)=["']([^"']+)["'][^>]*>/gi)];
    if (imageMatches.length) {
      for (const match of imageMatches) {
        const src = htmlDecode(match[1]);
        if (!src || isProfileImage(src)) continue;
        const local = await downloadImage(src, logNo, images.length + 1, options);
        if (local) {
          images.push(local);
          blocks.push(`![${escapeMarkdownAlt(title)}](${local})`);
        }
      }
      continue;
    }

    const paragraphMatches = [...chunk.matchAll(/<p\b[^>]*class=["'][^"']*se-text-paragraph[^"']*["'][^>]*>([\s\S]*?)<\/p>/gi)];
    const lines = paragraphMatches
      .map((match) => htmlToText(match[1]))
      .map(cleanText)
      .filter(Boolean);
    if (lines.length) {
      blocks.push(lines.join('\n'));
      continue;
    }

    const plain = cleanText(htmlToText(chunk));
    if (plain && plain.length > 20) blocks.push(plain);
  }

  const markdown = blocks.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
  return {
    markdown: markdown || cleanText(htmlToText(main)) || title,
    text: cleanText(htmlToText(main)),
    images
  };
}

function extractBalancedDiv(html, className) {
  const startMatch = new RegExp(`<div\\b[^>]*class=["'][^"']*${escapeRegex(className)}[^"']*["'][^>]*>`, 'i').exec(html);
  if (!startMatch) return '';

  let index = startMatch.index;
  let depth = 0;
  const tagRegex = /<\/?div\b[^>]*>/gi;
  tagRegex.lastIndex = index;

  while (true) {
    const match = tagRegex.exec(html);
    if (!match) return html.slice(index);
    if (match[0].startsWith('</')) depth -= 1;
    else depth += 1;
    if (depth === 0) return html.slice(index, tagRegex.lastIndex);
  }
}

function extractByClass(html, className) {
  const match = new RegExp(`<div\\b[^>]*class=["'][^"']*${escapeRegex(className)}[^"']*["'][^>]*>([\\s\\S]*)`, 'i').exec(html);
  return match?.[0] || '';
}

async function downloadImage(src, logNo, index, options) {
  if (options.dryRun) return `/images/uploads/naver-${logNo}-${index}.jpg`;
  try {
    const response = await fetch(src, {
      headers: {
        'user-agent': 'Mozilla/5.0',
        referer: `https://m.blog.naver.com/${BLOG_ID}/${logNo}`
      }
    });
    if (!response.ok) return '';
    const contentType = response.headers.get('content-type') || '';
    const ext = imageExtension(src, contentType);
    const fileName = `naver-${logNo}-${String(index).padStart(2, '0')}${ext}`;
    const outPath = path.join(paths.uploads, fileName);
    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(outPath, buffer);
    return `/images/uploads/${fileName}`;
  } catch {
    return '';
  }
}

function imageExtension(src, contentType) {
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('webp')) return '.webp';
  if (contentType.includes('gif')) return '.gif';
  const clean = src.split('?')[0].toLowerCase();
  const match = clean.match(/\.(jpe?g|png|webp|gif)$/i);
  return match ? `.${match[1].replace('jpeg', 'jpg')}` : '.jpg';
}

function isProfileImage(src) {
  return src.includes('blogpfthumb') || src.includes('favicon') || src.includes('static/blog/icon');
}

function buildMarkdown(data) {
  return [
    '---',
    `title: ${yamlString(data.title)}`,
    `date: ${data.date}`,
    `category: ${data.category}`,
    `tags: [${data.tags.map(yamlString).join(', ')}]`,
    `summary: ${yamlString(data.summary)}`,
    'cover: ""',
    'draft: true',
    `source_file: ${yamlString('naver-blog')}`,
    `source_blog_url: ${yamlString(data.sourceUrl)}`,
    `source_blog_category: ${yamlString(data.sourceCategory)}`,
    `source_blog_log_no: ${yamlString(data.logNo)}`,
    'created_by: "naver-import"',
    `import_review_note: ${yamlString(data.reviewNote)}`,
    '---',
    '',
    data.body,
    ''
  ].join('\n');
}

function makeTags(category, sourceCategory, text) {
  const tags = [...categoryDefaultTags[category]];
  if (sourceCategory && sourceCategory !== '구분선') tags.unshift(sourceCategory.replace(/\s+/g, ' ').trim());
  if (text.toLowerCase().includes('ai') || text.includes('인공지능')) tags.push('AI');
  if (text.toLowerCase().includes('codex')) tags.push('Codex');
  return [...new Set(tags)].filter(Boolean).slice(0, 5);
}

function makeSummary(text) {
  const clean = cleanText(htmlToText(text || ''));
  if (!clean) return '';
  return clean.length > 180 ? `${clean.slice(0, 177)}...` : clean;
}

async function uniqueSlug(category, date, title, logNo) {
  const base = slugify(title) || `naver-${logNo}`;
  let slug = base;
  let index = 2;
  while (await exists(path.join(paths.content, category, `${date}-${slug}.md`))) {
    slug = `${base}-${index}`;
    index += 1;
  }
  return slug;
}

function slugify(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
    .replace(/^-|-$/g, '');
}

async function appendReport(results, options) {
  const now = new Date().toISOString();
  const lines = [
    '',
    `## ${now}`,
    '',
    `- mode: ${options.dryRun ? 'dry-run' : 'import'}`,
    `- limit: ${options.limit}`,
    `- processed: ${results.length}`,
    ''
  ];

  for (const result of results) {
    if (result.status === 'failed') {
      lines.push(`- FAILED ${result.logNo}: ${result.title} / ${result.error}`);
    } else {
      lines.push(`- ${result.status.toUpperCase()} ${result.logNo}: ${result.title}`);
      lines.push(`  - path: ${result.path}`);
      lines.push(`  - category: ${result.sourceCategory} -> ${result.category}`);
      lines.push(`  - note: ${result.reviewNote}`);
      lines.push(`  - images: ${result.images}`);
    }
  }

  await fs.appendFile(paths.report, `${lines.join('\n')}\n`, 'utf8');
}

function summarizeResults(results) {
  return {
    processed: results.length,
    imported: results.filter((result) => result.status === 'imported').length,
    failed: results.filter((result) => result.status === 'failed').length
  };
}

async function fetchJson(url) {
  return JSON.parse(await fetchText(url));
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0',
      referer: `https://m.blog.naver.com/${BLOG_ID}`
    }
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response.text();
}

function parseNaverDate(value) {
  const match = String(value || '').match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
  if (!match) return '';
  return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
}

function extractDate(html) {
  const match = html.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\./);
  return match ? parseNaverDate(match[0]) : '';
}

function todayKst() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(new Date());
}

function decodeMaybe(value) {
  const normalized = String(value || '').replace(/\+/g, ' ');
  try {
    return decodeURIComponent(normalized);
  } catch {
    return normalized;
  }
}

function htmlToText(html) {
  return htmlDecode(String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' '));
}

function htmlDecode(value) {
  return String(value || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number.parseInt(dec, 10)));
}

function cleanText(value) {
  return String(value || '')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function yamlString(value) {
  return `"${String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
}

function escapeMarkdownAlt(value) {
  return String(value || '').replace(/[\[\]]/g, '');
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

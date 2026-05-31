// 리디자인 회고 포스트용 시각 자산 생성기 (브라우저 없이 sharp/librsvg로 SVG→PNG).
// 사이트 톤(Cool White / Cobalt) 반영. 폰트는 Windows 기본 보장(Georgia, Malgun Gothic).
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/images/uploads');
const SANS = "'Public Sans','Segoe UI',Arial,sans-serif";
const SANS_KR = "'Malgun Gothic','Apple SD Gothic Neo',sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";

async function render(name, svg) {
  const file = resolve(OUT, name);
  await sharp(Buffer.from(svg)).png().toFile(file);
  console.log('written:', file);
}

/* ---------- 1. 커버 ---------- */
const cover = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g" cx="50%" cy="-8%" r="75%">
      <stop offset="0%" stop-color="#2563eb" stop-opacity="0.10"/>
      <stop offset="60%" stop-color="#2563eb" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="p" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f5f6f8"/><stop offset="45%" stop-color="#fbfbfc"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#p)"/>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect width="1200" height="6" fill="#2563eb"/>
  <circle cx="102" cy="166" r="7" fill="#2563eb"/>
  <text x="122" y="173" font-family="${SANS}" font-size="26" font-weight="700" letter-spacing="6" fill="#2563eb">PORTFOLIO · REDESIGN LOG</text>
  <text x="96" y="300" font-family="${SANS_KR}" font-size="76" font-weight="700" fill="#16181d">홈페이지를 다시</text>
  <text x="96" y="392" font-family="${SANS_KR}" font-size="76" font-weight="700" fill="#16181d">설계한 기록</text>
  <text x="96" y="466" font-family="${SANS_KR}" font-size="30" font-weight="400" fill="#3d414b">$10K 체크리스트로 점검 → 디자인 시스템 → 라이트·다크·코발트 → 배포</text>
  <rect x="96" y="534" width="64" height="4" rx="2" fill="#2563eb"/>
  <text x="96" y="570" font-family="${SANS}" font-size="24" font-weight="600" fill="#5b5f6a">What I Think · psytor-log.github.io</text>
  ${['#2563eb','#0f766e','#a16207','#6d28d9','#be185d'].map((c,i)=>`<rect x="${1104-(5-i)*30}" y="538" width="20" height="20" rx="4" fill="${c}"/>`).join('')}
</svg>`;

/* ---------- 2. 팔레트 변천 v2 → v3 → v4 ---------- */
const versions = [
  { tag: 'v2', name: '따뜻한 종이 · 에버그린', swatches: [['배경','#f7f4ee'],['본문','#1c1b18'],['강조','#2f5d50'],['보조','#9c5a40'],['선','#e4dfd4']] },
  { tag: 'v3', name: '다크 · 콜드 스틸', swatches: [['배경','#131519'],['본문','#e4e7ec'],['강조','#6f9fd0'],['보조','#6fb0a0'],['선','#2a2e36']] },
  { tag: 'v4', name: '모던 · 쿨 화이트 / 코발트', swatches: [['배경','#fbfbfc'],['본문','#16181d'],['강조','#2563eb'],['보조','#0f766e'],['선','#e7e9ee']] }
];
const rowH = 150, padTop = 110;
const rows = versions.map((v, r) => {
  const y = padTop + r * rowH;
  const chips = v.swatches.map(([lbl, hex], i) => {
    const x = 360 + i * 156;
    return `<rect x="${x}" y="${y}" width="120" height="84" rx="10" fill="${hex}" stroke="#e7e9ee"/>
      <text x="${x}" y="${y+108}" font-family="${SANS}" font-size="18" font-weight="600" fill="#5b5f6a">${hex}</text>
      <text x="${x}" y="${y+130}" font-family="${SANS_KR}" font-size="17" fill="#8a8f99">${lbl}</text>`;
  }).join('');
  return `<text x="96" y="${y+38}" font-family="${SERIF}" font-size="42" font-weight="700" fill="#16181d">${v.tag}</text>
    <text x="96" y="${y+72}" font-family="${SANS_KR}" font-size="20" fill="#5b5f6a">${v.name}</text>
    ${chips}`;
}).join('');
const palette = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="${padTop + versions.length*rowH + 20}" viewBox="0 0 1200 ${padTop + versions.length*rowH + 20}" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="100%" fill="#fbfbfc"/>
  <rect width="1200" height="6" fill="#2563eb"/>
  <text x="96" y="64" font-family="${SANS_KR}" font-size="34" font-weight="700" fill="#16181d">팔레트 변천 — 세 번의 방향 전환</text>
  ${rows}
</svg>`;

/* ---------- 3. 체크리스트 점수 전 → 후 ---------- */
const items = [
  ['01 관점', 6, 8], ['02 타이포', 7, 8], ['03 컬러', 5, 8], ['04 위계', 7, 8],
  ['05 이미지', 4, 7], ['06 모션', 5, 7], ['07 모바일', 6, 7], ['08 보이지않는고급', 6, 8.5]
];
const cTop = 130, cRow = 78, trackX = 360, trackW = 620, unit = trackW / 10;
const bars = items.map(([lbl, before, after], i) => {
  const y = cTop + i * cRow;
  return `<text x="96" y="${y+30}" font-family="${SANS_KR}" font-size="24" font-weight="600" fill="#16181d">${lbl}</text>
    <rect x="${trackX}" y="${y+4}" width="${trackW}" height="18" rx="9" fill="#eef0f3"/>
    <rect x="${trackX}" y="${y+4}" width="${before*unit}" height="18" rx="9" fill="#c2c7d0"/>
    <text x="${trackX+before*unit+10}" y="${y+19}" font-family="${SANS}" font-size="17" fill="#8a8f99">전 ${before}</text>
    <rect x="${trackX}" y="${y+30}" width="${trackW}" height="18" rx="9" fill="#eef0f3"/>
    <rect x="${trackX}" y="${y+30}" width="${after*unit}" height="18" rx="9" fill="#2563eb"/>
    <text x="${trackX+after*unit+10}" y="${y+45}" font-family="${SANS}" font-size="17" font-weight="700" fill="#2563eb">후 ${after}</text>`;
}).join('');
const scores = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="${cTop + items.length*cRow + 30}" viewBox="0 0 1200 ${cTop + items.length*cRow + 30}" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="100%" fill="#fbfbfc"/>
  <rect width="1200" height="6" fill="#2563eb"/>
  <text x="96" y="64" font-family="${SANS_KR}" font-size="34" font-weight="700" fill="#16181d">$10K 체크리스트 점수 — 전 → 후</text>
  <text x="96" y="98" font-family="${SANS_KR}" font-size="20" fill="#5b5f6a">10점 만점 · 회색=리뉴얼 전, 코발트=현재</text>
  ${bars}
</svg>`;

await render('redesign-cover.png', cover);
await render('redesign-palette.png', palette);
await render('redesign-scores.png', scores);

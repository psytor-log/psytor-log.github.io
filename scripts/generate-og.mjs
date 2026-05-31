// 기본 OG 대표 공유 이미지 생성기 (cover 없는 글/사이트 페이지 공통 fallback).
// 브라우저 없이 sharp(librsvg)로 SVG → PNG(1200×630) 래스터.
// 사이트 톤(Cool White / Cobalt) 반영. 폰트는 Windows 기본 보장 폰트 사용
// (Georgia=세리프 워드마크, Malgun Gothic=한글 태그라인).
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/og-default.png');

const W = 1200;
const H = 630;
const M = 96; // 좌우 여백

// 카테고리 팔레트(사이트 v4와 동일) — 우하단 편집형 컬러 틱
const cats = ['#2563eb', '#0f766e', '#a16207', '#6d28d9', '#be185d'];
const ticks = cats
  .map((c, i) => `<rect x="${W - M - (cats.length - i) * 30}" y="${H - 92}" width="20" height="20" rx="4" fill="${c}"/>`)
  .join('');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="50%" cy="-8%" r="75%">
      <stop offset="0%" stop-color="#2563eb" stop-opacity="0.10"/>
      <stop offset="60%" stop-color="#2563eb" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f5f6f8"/>
      <stop offset="45%" stop-color="#fbfbfc"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#paper)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- 상단 헤어라인 -->
  <rect x="0" y="0" width="${W}" height="6" fill="#2563eb"/>

  <!-- eyebrow + 브랜드 도트 -->
  <circle cx="${M + 6}" cy="${168}" r="7" fill="#2563eb"/>
  <text x="${M + 26}" y="${175}" font-family="'Public Sans','Segoe UI',Arial,sans-serif"
    font-size="26" font-weight="700" letter-spacing="6" fill="#2563eb">THINKING LOG</text>

  <!-- 워드마크 (세리프) -->
  <text x="${M}" y="${330}" font-family="Georgia,'Times New Roman',serif"
    font-size="132" font-weight="700" letter-spacing="-2" fill="#16181d">What I Think</text>

  <!-- 태그라인 (한글) -->
  <text x="${M}" y="${410}" font-family="'Malgun Gothic','Apple SD Gothic Neo',sans-serif"
    font-size="34" font-weight="400" fill="#3d414b">생각 · 공부 · 독서 · 프로젝트를 쌓아 두는 기록</text>

  <!-- 하단 강조 룰 + 도메인 -->
  <rect x="${M}" y="${H - 96}" width="64" height="4" rx="2" fill="#2563eb"/>
  <text x="${M}" y="${H - 60}" font-family="'Public Sans','Segoe UI',Arial,sans-serif"
    font-size="26" font-weight="600" letter-spacing="1" fill="#5b5f6a">psytor-log.github.io</text>

  <!-- 우하단 편집형 카테고리 컬러 틱 -->
  ${ticks}
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(OUT);
console.log('OG image written:', OUT);

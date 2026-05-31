# What I Think — 디자인 시스템

> ui-ux-pro-max 도출 + Metics Media "$10K Checklist" 진단 기반.
> 방향: **Editorial / Swiss Modernism 2.0** — 그리드, 수학적 여백, 절제, 가독성.

## v4 — Modern Editorial (Cool White / Cobalt) · 현재 적용본
사용자 요청: "모던한 개인 블로그 느낌". 라이트 모던/테크-미니멀(Linear·Vercel 감성).
```
--bg:           #fbfbfc   /* 쿨 화이트 */   --bg-2: #f5f6f8
--surface:      #ffffff   --surface-soft: #f1f2f5
--ink:          #16181d   --ink-soft: #3d414b
--muted:        #5b5f6a   /* bg 위 6.1:1, AA */
--line:         #e7e9ee   --line-strong: #d4d8e0
--accent:       #2563eb   /* cobalt — 원안 #2f6df6는 링크 대비 4.4:1로 AA 미달이라 한 단계 깊게 */
--accent-ink:   #1d4ed8   --accent-soft: #e7efff
--btn-ink:      #ffffff   /* 코발트 위 흰 텍스트 5:1 */
```
카테고리(모던 라벨 팔레트, 동일 톤 깊이 -700 계열):
```
essay #2563eb(blue) · study #0f766e(teal) · books #a16207(amber) ·
portfolio #6d28d9(violet) · ichnos #be185d(pink)
```
배지: 라이트 칩(cat 11% + white) + 깊은 cat 텍스트 + cat 22% 보더.
배경: 상단 코발트 미세 글로우 + 쿨 그라데이션. admin/preview 모두 라이트 코발트로 미러링.

### v4.1 보강 (⑤·⑧ + 타이포·여백)
- 한글 폰트: **Pretendard Variable**(모던 한글) 도입. Latin=Public Sans, 한글=Pretendard. `word-break: keep-all`.
- 줄간격: body 1.75 · lead 1.68 · article 1.85 · summary 1.70.
- 제목: h1 `clamp(2.5rem, 5.4vw, 4.1rem)`/line 1.1/max 15ch (절제). post-title 1.28rem.
- 여백 확대: main 92/124, hero ↓56, section 간격 92, featured gap 48, post-item pad 34.
- ⑤ 이미지: 플레이스홀더 = 톤 패널 + 도트 + 세리프 모노그램 + 카테고리 워드마크 + 인셋 프레임. 썸네일 decoding=async.
- ⑧ 메타: canonical · Open Graph · Twitter card · BlogPosting JSON-LD · nav aria-current.

---

## v3 — Dark Editorial (Cold Steel) · 보존 기록
사용자 요청으로 "어둡고 전문적" 컨셉으로 전환. 라이트 종이 → **쿨 슬레이트 차콜 다크**.
구조·타이포 스케일·공간·모션·접근성 원칙은 v2와 동일하게 유지, 컬러 스파인만 다크로 반전.
```
--bg:           #131519   /* 쿨 슬레이트 차콜 */
--surface:      #1b1e24
--surface-soft: #23272f
--ink:          #e4e7ec   /* 쿨 오프화이트 */
--ink-soft:     #b8bdc7
--muted:        #8b909b   /* bg 위 5.7:1, AA */
--line:         #2a2e36   --line-strong: #3a4049
--accent:       #6f9fd0   /* steel blue, 단일 강조 (링크/포커스/스트라이프) */
--accent-ink:   #8ab4de   /* 다크에선 hover 시 더 밝게 */
--btn-ink:      #0f1115   /* 밝은 강조색 버튼 위 다크 텍스트 (대비 6.6:1) */
```
카테고리(차콜 위 쿨 패밀리, 명도/채도 폭 좁힘 + 웜 앵커 1):
```
essay #6f9fd0(blue) · study #6fb0a0(teal) · books #b29a66(sand) ·
portfolio #9a8fc4(periwinkle) · ichnos #c189a6(mauve)
```
배지: 다크 칩(cat 16% + surface) + 밝은 cat 텍스트 + cat 30% 보더.
배경: 상단 쿨 글로우 + 하단 강조 틴트 + 차콜 그라데이션(깊이감).
admin: 미리보기 페인은 사이트(다크) 미러링, 에디터 크롬은 라이트-쿨 + 진한 스틸블루(#3f6f9e).

---

## v2 — Light Editorial (보존 기록)
> 따뜻한 종이 배경 + 에버그린 단일 강조. v3 전환 전 원안. 강점 유지: 세리프 디스플레이, 시맨틱 HTML.

## 1. 미학 방향 (관점, 체크리스트 ①)
한 문장: **"오래 읽게 만드는 따뜻한 활자 중심의 편집 디자인."**
- 잡지/문예지의 활판 감성 + 스위스 그리드의 절제.
- 장식이 아니라 여백·활자·대비로 위계를 만든다.
- 한 가지 강조색만 쓴다. 나머지는 잉크와 종이.

## 2. 타이포그래피 (체크리스트 ②)
- **Display(제목)**: `Source Serif Pro` + `Noto Serif KR` — 기존 강점 유지.
- **Body/UI(본문·메뉴·메타)**: `Public Sans` + `Noto Sans KR` — *선택된* 산세 페어링.
  (Inter/Roboto 회피, 시스템 기본 산세 탈피.)

스케일 (모듈러, 1.25 기조):
| 역할 | size | weight | line-height | tracking |
|------|------|--------|-------------|----------|
| hero h1 | clamp(2.6rem, 6vw, 4.4rem) | 600 | 1.08 | -0.02em |
| h2 | clamp(1.7rem, 3vw, 2.1rem) | 600 | 1.18 | -0.01em |
| h3 (포스트 제목) | 1.3rem | 600 | 1.25 | -0.01em |
| lead | 1.14rem | 400 | 1.6 | 0 |
| body | 1rem (≥16px) | 400 | 1.72 | 0 |
| meta/small | 0.84rem | 500 | 1.4 | 0 |
| eyebrow | 0.74rem | 700 | 1 | 0.18em / UPPERCASE |

## 3. 컬러 토큰 (체크리스트 ③ — 무지개 제거)
**스파인(실제 팔레트) = 잉크 + 종이 + 단일 강조색.**
```
--paper:        #f7f4ee   /* 따뜻한 종이 배경 */
--surface:      #fffdf9   /* 카드 */
--surface-soft: #efe9dd   /* 살짝 가라앉은 면 */
--ink:          #1c1b18   /* 본문 (warm near-black) */
--ink-soft:     #45413b   /* 보조 본문 */
--muted:        #5d584f   /* 메타 — paper 위 4.7:1, AA 통과 */
--line:         #e4dfd4   /* 헤어라인 */
--line-strong:  #cfc8b9
--accent:       #2f5d50   /* 단일 브랜드 강조(에버그린) — 링크/포커스/버튼 */
--accent-ink:   #244a40   /* hover */
--accent-soft:  #e4ede9
```
**카테고리 구분** — 5색 무지개 대신 *동일 온도의 저채도 흙빛 패밀리*로 큐레이션
(채도·명도 폭을 좁혀 "디자인된 한 벌"로 읽히게):
```
essay     #3a6152  (evergreen)   soft #e3ece7
study     #9c5a40  (clay)        soft #f0e0d6
books     #846327  (bronze)      soft #efe6cf
portfolio #3f5670  (slate)       soft #dde3ec
ichnos    #6a5575  (plum)        soft #e7e0ee
```
규칙: 카테고리색은 *작은 면적*(스트라이프 3px, 배지 점, eyebrow)만. 큰 면적은 항상 잉크/종이.

## 4. 공간 / 그리드 (체크리스트 ④, ⑦)
- 베이스 4px, 리듬 토큰: `4 8 12 16 24 32 48 64 96`.
- 콘텐츠 폭 `--max: 1040px`, 본문 글줄 `--measure: 68ch`(65–75자).
- 12컬럼 사고. featured는 비대칭(텍스트 우선), recent는 단일 컬럼 리스트.
- 모바일은 축소가 아니라 재배치: nav는 가로 스크롤이 아니라 정돈된 inline-wrap, 카드 1열, 날짜 상단 인라인.

## 5. 모션 (체크리스트 ⑥)
- duration 150–240ms, **ease-out** 진입.
- transform/opacity/color만. 레이아웃 시프트 유발(scale로 폭 변동) 금지.
- 마이크로: 링크 밑줄 성장, 카드 보더/틴트, 스트라이프 폭 3→4px, 화살표 2px 이동.
- 뷰당 1–2개만. 히어로 fade-up 1회.
- `@media (prefers-reduced-motion: reduce)` → 전 모션 무력화.

## 6. 접근성 / 보이지 않는 고급 (체크리스트 ⑧)
- `:focus-visible` — 2px accent 아웃라인 + 2px offset, 모든 인터랙티브.
- skip-link → `#main`.
- muted 대비 ≥4.5:1로 상향.
- 폰트 `display=swap`, preconnect 유지. SVG 아이콘(이모지 금지).
- 시맨틱 유지(header/nav/main/article/time/footer).

## 7. 이미지 / 플레이스홀더 (체크리스트 ⑤)
- 사진 없을 때 그라데이션 blob 금지. **일관된 편집형 플레이스홀더**:
  종이 패널 + 카테고리 머리글자(세리프, 저투명 잉크) + 미세 도트 텍스처.
- 썸네일 유무와 무관하게 카드가 "의도된" 모양을 갖도록 통일.

## 8. 적용 범위
홈(`index.astro`), 레이아웃(`BaseLayout.astro`), 전역 CSS(`global.css`),
카테고리/포스트 페이지(상속), admin 에디터(`admin.astro` + `preview.css`)에 동일 토큰·타이포 적용.

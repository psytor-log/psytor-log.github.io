# What I Think

`What I Think`는 생각, 공부, 독서, 프로젝트 기록을 Markdown으로 관리하는 개인 홈페이지입니다. Astro 기반 정적 사이트로 만들었고, GitHub Pages에 무료로 배포하는 구조를 기준으로 합니다.

## 기본 정보

- GitHub username: `psytor-log`
- GitHub Pages 주소: `https://psytor-log.github.io`
- GitHub repository name: `psytor-log.github.io`
- 사이트 성격: Thinking Log
- 저장 형식: Markdown 글 + 일반 이미지 파일

## 로컬 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 Astro가 안내하는 로컬 주소를 열면 됩니다. 보통 `http://localhost:4321`입니다.

정적 빌드는 다음 명령으로 확인합니다.

```bash
npm run build
npm run preview
```

## 폴더 구조

```text
content/
  essay/
  study/
  books/
  portfolio/
  tags.json
public/
  images/
    essay/
    study/
    books/
    portfolio/
    common/
inbox/
  posts/
  images/
  processed/
scripts/
src/
```

## 새 글 작성 방법

1. 글 초안을 `inbox/posts` 폴더에 넣습니다.
2. 파일 형식은 `.txt` 또는 `.md`를 사용합니다.
3. 파일명은 자유롭게 작성해도 됩니다.
4. 대표 이미지 후보가 있으면 `inbox/images` 폴더에 넣습니다.
5. 아래 명령을 실행합니다.

```bash
npm run new-post
```

명령이 실행되면 초안이 분석되어 `content/{category}` 폴더에 홈페이지용 Markdown으로 저장됩니다. 원본 초안은 삭제하지 않고 `inbox/processed`로 이동합니다.

## 이미지 올리는 방법

- 이미지 파일은 `inbox/images`에 넣습니다.
- 지원 형식은 `.jpg`, `.jpeg`, `.png`, `.webp`입니다.
- `npm run new-post` 실행 시 파일명과 글 내용을 비교해 대표 이미지를 선택합니다.
- 선택된 이미지는 `public/images/{category}`로 복사되고, 글의 `cover`에 연결됩니다.

## npm run new-post 사용법

```bash
npm run new-post
```

이 명령은 다음 작업을 수행합니다.

- `inbox/posts`의 새 초안 파일 목록 확인
- 글 성격에 따라 `essay`, `study`, `books`, `portfolio` 중 자동 분류
- 제목, summary, tags, slug 생성
- `YYYY-MM-DD-slug.md` 형식으로 Markdown 파일 생성
- 관련 이미지 선택 및 복사
- `content/tags.json` 갱신
- `log.txt` 기록
- 원본 초안을 `inbox/processed`로 이동

자동 분류가 애매하면 `essay`가 기본값으로 적용됩니다.

## 자연어 요청 예시

예시 1:

> 새 글 반영해줘. inbox/posts와 inbox/images를 확인해서 What I Think 홈페이지에 업로드하고, 처리 결과를 log.txt에 남겨줘.

예시 2:

> 오늘 작성한 글을 Essay 카테고리에 올려줘. 태그는 자동으로 추천하고 tags.json과 log.txt에 기록해줘.

예시 3:

> 이 글은 포트폴리오 글이야. 문제, 접근, 결과, 배운 점 구조로 정리해서 홈페이지에 올려줘.

예시 4:

> 이미지는 inbox/images에 있는 파일 중 가장 어울리는 것을 대표 이미지로 사용해줘. 선택 근거를 log.txt에 남겨줘.

## Markdown frontmatter 규칙

모든 글은 다음 형식을 사용합니다.

```yaml
---
title: ""
date: YYYY-MM-DD
category: ""
tags: []
summary: ""
cover: ""
draft: false
source_file: ""
created_by: "codex"
---
```

## tags.json 관리 방식

`content/tags.json`에는 태그별 사용 기록을 누적합니다.

- `first_used_date`: 처음 사용한 날짜
- `last_used_date`: 마지막 사용 날짜
- `count`: 사용 횟수
- `related_categories`: 사용된 카테고리 목록

새 태그가 생성되면 `log.txt`에도 신규 태그로 기록됩니다.

## log.txt 기록 방식

`log.txt`는 주요 작업 이력입니다. `npm run new-post` 실행 시 다음 항목을 기록합니다.

- 작업 일시
- 실행한 작업
- 처리한 초안 파일명
- 생성된 Markdown 파일명
- 선택된 카테고리와 판단 근거
- 생성된 제목, summary, tags
- 신규 태그와 기존 태그 재사용 여부
- 연결한 이미지 파일과 선택 근거
- 적용한 기본값
- 검토 필요사항
- 실패한 작업과 실패 사유
- 다음 개선 포인트

## GitHub에 올리는 방법

처음 한 번만 저장소를 연결합니다.

```bash
git init
git add .
git commit -m "Initial What I Think site"
git branch -M main
git remote add origin https://github.com/psytor-log/psytor-log.github.io.git
git push -u origin main
```

이미 GitHub 저장소가 연결되어 있다면 다음만 실행하면 됩니다.

```bash
git add .
git commit -m "Update site"
git push
```

## GitHub Pages 배포 방법

이 프로젝트에는 `.github/workflows/deploy.yml`이 포함되어 있습니다.

GitHub 저장소에서 다음을 확인합니다.

1. Repository 이름이 `psytor-log.github.io`인지 확인합니다.
2. `Settings > Pages`로 이동합니다.
3. `Build and deployment`의 Source를 `GitHub Actions`로 선택합니다.
4. `main` 브랜치에 push하면 Actions가 자동으로 빌드하고 배포합니다.
5. 배포 후 `https://psytor-log.github.io`에서 확인합니다.

## 개인 도메인 연결

나중에 개인 도메인을 연결할 때는 다음 순서로 진행합니다.

1. 도메인 구매처에서 DNS 설정을 엽니다.
2. GitHub Pages 안내에 따라 `A` 레코드 또는 `CNAME` 레코드를 설정합니다.
3. 저장소의 `Settings > Pages > Custom domain`에 도메인을 입력합니다.
4. 필요하면 `public/CNAME` 파일에 도메인을 적어 저장소에 포함합니다.

지금은 GitHub Pages 기본 주소만 사용하므로 `CNAME` 파일은 만들지 않았습니다.

## 백업 전략

- 원본 프로젝트 폴더: 로컬 `what-i-think`
- 원격 백업: GitHub 저장소 `psytor-log.github.io`
- 글 원본: `inbox/processed`
- 발행 글: `content`
- 이미지 원본 후보: `inbox/images`
- 발행 이미지: `public/images`

Markdown과 이미지 파일을 그대로 보관하므로 나중에 다른 정적 사이트 도구로 옮기기 쉽습니다.

## 자주 발생할 수 있는 문제와 해결 방법

### npm install이 실패할 때

Node.js 20 이상을 설치했는지 확인합니다.

```bash
node -v
npm -v
```

### 새 글이 생성되지 않을 때

`inbox/posts`에 `.txt` 또는 `.md` 파일이 있는지 확인합니다.

### 이미지가 연결되지 않을 때

`inbox/images`에 `.jpg`, `.jpeg`, `.png`, `.webp` 파일이 있는지 확인합니다.

### 카테고리가 마음에 들지 않을 때

생성된 Markdown 파일의 `category`를 직접 수정하고 파일을 원하는 `content/{category}` 폴더로 옮길 수 있습니다. `tags.json`과 `log.txt`도 함께 확인합니다.

### GitHub Pages가 갱신되지 않을 때

GitHub 저장소의 `Actions` 탭에서 배포 실패 여부를 확인합니다. 실패한 경우 로그에서 `npm ci` 또는 `npm run build` 오류를 먼저 봅니다.

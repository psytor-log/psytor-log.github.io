# 이미 배포된 사이트 운영법

이 문서는 이미 배포된 `What I Think` 사이트를 유지하고 글을 올리는 방법을 정리한 문서입니다.

- 공개 주소: https://psytor-log.github.io/
- GitHub 저장소: https://github.com/psytor-log/psytor-log.github.io
- 로컬 폴더: `I:\AI for works\what-i-think`

## 1. 평소 운영 흐름

새 글을 올릴 때의 기본 순서입니다.

```bash
npm run new-post
npm run build
git add .
git commit -m "Add new post"
git push
```

`git push`가 끝나면 GitHub Actions가 자동으로 사이트를 빌드하고 배포합니다.

## 2. 새 글 준비

초안 파일을 아래 폴더에 넣습니다.

```text
inbox/posts
```

지원 형식:

- `.txt`
- `.md`

파일명은 자유롭게 작성해도 됩니다.

예:

```text
inbox/posts/AI시대에 이해한다는 것.txt
```

## 3. 이미지 준비

이미지 후보는 아래 폴더에 넣습니다.

```text
inbox/images
```

지원 형식:

- `.jpg`
- `.jpeg`
- `.png`
- `.webp`

`npm run new-post` 실행 시 제목, 본문, 이미지 파일명을 비교해 대표 이미지를 선택합니다.

선택된 이미지는 아래 경로로 복사됩니다.

```text
public/images/{category}
```

## 4. 새 글 반영 명령

```bash
npm run new-post
```

이 명령은 다음 작업을 합니다.

- `inbox/posts`의 초안 파일 확인
- 카테고리 자동 분류
- 제목 추출
- summary 생성
- tags 생성
- slug 생성
- Markdown 파일 생성
- 대표 이미지 복사 및 연결
- `content/tags.json` 갱신
- `log.txt` 기록
- 원본 초안을 `inbox/processed`로 이동

카테고리 판단이 어려우면 `essay`를 기본값으로 사용합니다.

## 5. 글이 생성되는 위치

카테고리에 따라 아래 폴더 중 하나에 생성됩니다.

```text
content/essay
content/study
content/books
content/portfolio
```

파일명은 다음 형식입니다.

```text
YYYY-MM-DD-slug.md
```

## 6. 생성된 글 확인

생성된 Markdown 파일의 frontmatter를 확인합니다.

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

확인할 항목:

- 제목이 자연스러운지
- 카테고리가 맞는지
- summary가 글의 핵심을 담는지
- tags가 3~7개인지
- cover 이미지가 적절한지
- 본문에 어색한 줄바꿈이 없는지

## 7. 로컬에서 미리 보기

```bash
npm run dev
```

보통 아래 주소에서 확인합니다.

```text
http://localhost:4321
```

## 8. 빌드 점검

배포 전에는 빌드를 확인합니다.

```bash
npm run build
```

빌드가 실패하면 GitHub Actions에서도 실패할 가능성이 높습니다. 로컬 빌드 오류를 먼저 해결합니다.

## 9. GitHub에 반영

```bash
git status
git add .
git commit -m "Add new post"
git push
```

커밋 메시지는 작업 내용에 맞게 바꿉니다.

예:

```bash
git commit -m "Add essay about AI and understanding"
```

## 10. 배포 상태 확인

GitHub Actions 상태 확인:

```powershell
gh run list --repo psytor-log/psytor-log.github.io --limit 5
```

특정 실행을 기다릴 때:

```powershell
gh run watch RUN_ID --repo psytor-log/psytor-log.github.io --exit-status
```

공개 사이트 확인:

```text
https://psytor-log.github.io/
```

## 11. tags.json 관리

`content/tags.json`에는 태그 사용 이력이 누적됩니다.

각 태그는 다음 정보를 가집니다.

```json
{
  "AI": {
    "first_used_date": "2026-05-16",
    "last_used_date": "2026-05-16",
    "count": 1,
    "related_categories": ["essay", "study"]
  }
}
```

새 글을 만들 때 스크립트가 자동으로 갱신합니다.

태그가 너무 많이 늘어나면 같은 의미의 태그를 정리합니다.

## 12. log.txt 관리

`log.txt`는 작업 이력입니다.

`npm run new-post` 실행 시 다음 내용이 기록됩니다.

- 작업 일시
- 처리한 초안 파일명
- 생성된 Markdown 파일명
- 선택된 카테고리
- 카테고리 판단 근거
- 생성된 제목
- 생성된 summary
- 생성된 tags
- 신규 태그
- 재사용 태그
- 연결한 이미지 파일
- 이미지 선택 근거
- 적용한 기본값
- 검토 필요사항
- 실패한 작업과 실패 사유
- 다음 개선 포인트

## 13. 백업 전략

이 사이트는 두 곳에 보관됩니다.

- 로컬 폴더: `I:\AI for works\what-i-think`
- GitHub 저장소: `psytor-log/psytor-log.github.io`

중요한 폴더:

- 발행 글: `content`
- 발행 이미지: `public/images`
- 처리된 원본 초안: `inbox/processed`
- 작업 로그: `log.txt`
- 태그 기록: `content/tags.json`

## 14. 자주 생기는 문제

### 새 글이 생성되지 않을 때

`inbox/posts`에 `.txt` 또는 `.md` 파일이 있는지 확인합니다.

### 이미지가 연결되지 않을 때

`inbox/images`에 지원 형식의 이미지가 있는지 확인합니다.

### 카테고리가 마음에 들지 않을 때

생성된 Markdown 파일의 `category`를 직접 수정하고, 파일을 원하는 `content/{category}` 폴더로 옮깁니다.

필요하면 `content/tags.json`과 `log.txt`도 같이 확인합니다.

### GitHub Pages가 갱신되지 않을 때

저장소의 `Actions` 탭에서 실패한 workflow를 확인합니다.

로컬에서 먼저 확인합니다.

```bash
npm run build
```

### GitHub Actions에서 Node.js 20 경고가 나올 때

현재 배포에는 문제가 없었습니다. 다만 GitHub Actions runner 정책이 바뀌면 `.github/workflows/deploy.yml`을 Node 24 기준으로 업데이트할 수 있습니다.

## 15. 자연어 요청 예시

> 새 글 반영해줘. inbox/posts와 inbox/images를 확인해서 What I Think 홈페이지에 업로드하고, 처리 결과를 log.txt에 남겨줘.

> 오늘 작성한 글을 Essay 카테고리에 올려줘. 태그는 자동으로 추천하고 tags.json과 log.txt에 기록해줘.

> 이 글은 포트폴리오 글이야. 문제, 접근, 결과, 배운 점 구조로 정리해서 홈페이지에 올려줘.

> 이미지는 inbox/images에 있는 파일 중 가장 어울리는 것을 대표 이미지로 사용해줘. 선택 근거를 log.txt에 남겨줘.

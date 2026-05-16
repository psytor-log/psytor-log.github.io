# What I Think

`What I Think`는 생각, 공부, 독서, 프로젝트 기록을 Markdown으로 관리하는 개인 홈페이지입니다.

- 공개 주소: https://psytor-log.github.io/
- GitHub 저장소: https://github.com/psytor-log/psytor-log.github.io
- 방식: Astro + GitHub Pages
- 저장 형식: Markdown 글 + 일반 이미지 파일
- 사이트 성격: Thinking Log

## 문서 안내

처음 구축하는 방법과 이미 배포된 사이트를 운영하는 방법을 분리했습니다.

- [처음 만드는 법](./SETUP_GUIDE.md)
- [이미 배포된 사이트 운영법](./OPERATION_GUIDE.md)
- [글쓰기 규칙](./WRITING_RULES.md)
- [태그 규칙](./TAG_RULES.md)

## 현재 상태

- `psytor-log.github.io` 저장소 생성 완료
- `main` 브랜치 push 완료
- GitHub Actions 배포 완료
- `https://psytor-log.github.io/` 정상 접속 확인 완료

## 기본 구조

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

## 자주 쓰는 명령

로컬 실행:

```bash
npm run dev
```

새 글 반영:

```bash
npm run new-post
```

빌드 확인:

```bash
npm run build
```

GitHub 배포:

```bash
git add .
git commit -m "Update site"
git push
```

## 새 글 반영 요청 예시

> 새 글 반영해줘. inbox/posts와 inbox/images를 확인해서 What I Think 홈페이지에 업로드하고, 처리 결과를 log.txt에 남겨줘.

> 오늘 작성한 글을 Essay 카테고리에 올려줘. 태그는 자동으로 추천하고 tags.json과 log.txt에 기록해줘.

> 이 글은 포트폴리오 글이야. 문제, 접근, 결과, 배운 점 구조로 정리해서 홈페이지에 올려줘.

> 이미지는 inbox/images에 있는 파일 중 가장 어울리는 것을 대표 이미지로 사용해줘. 선택 근거를 log.txt에 남겨줘.

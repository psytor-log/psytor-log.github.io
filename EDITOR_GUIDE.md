# What I Think Editor

이 사이트는 Decap CMS를 `/admin/` 경로에 붙여서 Markdown 글과 이미지를 편집할 수 있게 준비했습니다.

## 접속 주소

```text
https://psytor-log.github.io/admin/
```

## 가능한 작업

- Essay, Study, Books, Portfolio 글 작성
- 기존 Markdown 글 수정
- 글 삭제
- 태그, 요약, 작성일, 초안 여부 수정
- 대표 이미지 업로드
- 본문 안에 이미지 삽입

이미지는 기본적으로 아래 폴더에 저장됩니다.

```text
public/images/uploads
```

사이트에서는 아래 주소로 사용됩니다.

```text
/images/uploads/파일명
```

## OAuth 브리지 설정

GitHub Pages는 정적 호스팅이라서 GitHub OAuth 로그인을 처리할 서버가 없습니다. 그래서 Decap CMS의 GitHub 백엔드를 실제 공개 사이트에서 쓰려면 OAuth 브리지가 하나 필요합니다.

이 저장소에는 Cloudflare Worker용 OAuth 브리지 코드가 `oauth-worker`에 들어 있습니다.

GitHub OAuth App과 Cloudflare Worker 배포가 끝나면 `public/admin/config.yml`의 아래 부분에 OAuth 브리지 주소를 추가합니다.

```yaml
backend:
  name: github
  repo: psytor-log/psytor-log.github.io
  branch: main
  base_url: https://your-oauth-bridge.example.com
  auth_endpoint: auth
```

비밀값은 저장소에 넣지 않습니다. GitHub OAuth App의 client secret 같은 값은 OAuth 브리지 서비스 쪽 환경변수에만 둡니다.

자세한 배포 절차는 `oauth-worker/README.md`를 봅니다.

## 권한 원칙

이 에디터는 GitHub 저장소에 커밋하는 방식입니다. 따라서 실제로 글을 수정하려면 `psytor-log/psytor-log.github.io` 저장소에 push 권한이 있어야 합니다.

다른 사람이 `/admin/` 주소를 알아도 저장소 권한이 없으면 콘텐츠를 저장하거나 삭제할 수 없습니다.

## 로컬 테스트

로컬 테스트는 Decap CMS local backend가 필요합니다.

```bash
npx decap-server
npm run dev
```

그 다음 아래 주소로 접속합니다.

```text
http://localhost:4321/admin/
```

## 본문 편집 중 크래시 응급 조치

`Cannot find a descendant at path`, `Failed to execute removeChild`, `toArray` 류 오류가 본문 작성 중 다시 발생하면 Decap CMS의 Rich Text/Slate 편집 경로 크래시입니다. 5/24에 적용했던 raw-only 우회를 다시 켜는 방식이 가장 좁고 안전한 응급 처치입니다.

`public/admin/config.yml`의 5개 본문(`body`) 필드(`about`, `essay`, `study`, `books`, `portfolio`)에 다음 옵션을 추가합니다.

```yaml
{ label: "본문", name: "body", widget: "markdown", modes: ["raw"], buttons: [...], editor_components: ["sized-image"] }
```

그러면 raw 마크다운 입력 모드만 남아서 크래시 경로가 차단됩니다. 단 이 모드에서는 툴바 버튼과 본문 이미지 삽입 컴포넌트가 보이지 않으므로 마크다운 문법을 직접 타이핑해야 합니다 (`**굵게**`, `_기울임_`, `![설명](/images/uploads/파일명)`).

응급 복구가 끝나면 `src/pages/admin.astro` 상단의 `config.yml?v=YYYYMMDD-HHMM` 쿼리값을 새 시각으로 바꿔서 브라우저가 캐시된 옛 config 를 사용하지 않도록 합니다.

# 처음 만드는 법

이 문서는 `What I Think` 홈페이지를 처음 구축할 때 필요한 절차를 정리한 문서입니다.

이미 이 프로젝트는 아래 주소로 배포되어 있습니다.

- 공개 주소: https://psytor-log.github.io/
- GitHub 저장소: https://github.com/psytor-log/psytor-log.github.io

새 PC에서 다시 세팅하거나, 같은 구조의 새 사이트를 만들 때 이 문서를 보면 됩니다.

## 1. 준비물

- Node.js 20 이상
- Git
- GitHub 계정
- GitHub CLI

버전 확인:

```bash
node -v
npm -v
git --version
```

## 2. GitHub CLI 설치

Windows에서는 `winget`으로 설치할 수 있습니다.

```powershell
winget install --id GitHub.cli -e --accept-source-agreements --accept-package-agreements
```

설치 확인:

```powershell
gh --version
```

현재 PowerShell에서 `gh`를 찾지 못하면 새 PowerShell을 열거나 아래 경로로 직접 실행합니다.

```powershell
& 'C:\Program Files\GitHub CLI\gh.exe' --version
```

## 3. GitHub CLI 로그인

```powershell
gh auth login --hostname github.com --web --git-protocol https
```

브라우저가 열리면 GitHub에 로그인하고 권한을 승인합니다.

로그인 계정 확인:

```powershell
gh api user --jq .login
```

이 프로젝트는 `psytor-log` 계정을 기준으로 합니다.

```text
psytor-log
```

## 4. 프로젝트 생성

처음부터 새로 만든다면 Astro 프로젝트를 만들고 필요한 폴더를 구성합니다.

이 프로젝트의 기준 폴더는 다음과 같습니다.

```text
I:\AI for works\what-i-think
```

핵심 구조:

```text
content/
  essay/
  study/
  books/
  portfolio/
public/
  images/
inbox/
  posts/
  images/
  processed/
scripts/
src/
```

## 5. 의존성 설치

```bash
npm install
```

## 6. 로컬 실행 확인

```bash
npm run dev
```

브라우저에서 보통 아래 주소를 엽니다.

```text
http://localhost:4321
```

## 7. 빌드 확인

```bash
npm run build
```

빌드가 성공하면 `dist` 폴더가 생성됩니다. 이 폴더는 GitHub Actions가 배포할 결과물입니다.

## 8. GitHub 저장소 생성

이 사이트는 GitHub Pages 사용자 사이트이므로 저장소 이름이 중요합니다.

```text
psytor-log.github.io
```

GitHub CLI로 생성:

```powershell
gh repo create psytor-log.github.io --public --description "What I Think - personal thinking log built with Astro"
```

이미 저장소가 있다면 생성하지 않습니다.

## 9. GitHub에 처음 올리기

```bash
git init
git add .
git commit -m "Initial What I Think site"
git branch -M main
git remote add origin https://github.com/psytor-log/psytor-log.github.io.git
git push -u origin main
```

이미 `origin`이 연결되어 있다면 `git remote add`는 생략합니다.

## 10. GitHub Pages 설정

저장소에서 다음을 확인합니다.

1. GitHub 저장소로 이동합니다.
2. `Settings > Pages`를 엽니다.
3. `Build and deployment`의 Source를 `GitHub Actions`로 설정합니다.
4. `.github/workflows/deploy.yml`이 있는지 확인합니다.
5. `main` 브랜치에 push하면 Actions가 자동으로 빌드하고 배포합니다.

배포 주소:

```text
https://psytor-log.github.io/
```

## 11. 정상 작동 점검

로컬 빌드:

```bash
npm run build
```

GitHub Actions 확인:

```powershell
gh run list --repo psytor-log/psytor-log.github.io --limit 5
```

사이트 응답 확인:

```powershell
Invoke-WebRequest -Uri 'https://psytor-log.github.io/' -UseBasicParsing
```

응답 코드가 `200`이면 공개 사이트가 열리는 상태입니다.

## 12. 개인 도메인 연결

나중에 개인 도메인을 연결할 때 진행합니다.

1. 도메인 구매처에서 DNS 설정을 엽니다.
2. GitHub Pages 안내에 따라 `A` 레코드 또는 `CNAME` 레코드를 설정합니다.
3. GitHub 저장소의 `Settings > Pages > Custom domain`에 도메인을 입력합니다.
4. 필요하면 `public/CNAME` 파일에 도메인을 적습니다.

현재는 GitHub Pages 기본 주소만 사용하므로 `CNAME` 파일은 없습니다.

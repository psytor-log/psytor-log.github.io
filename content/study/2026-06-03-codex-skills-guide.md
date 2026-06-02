---
title: "Codex에서 스킬을 잘 쓰는 법"
date: 2026-06-03T00:08:00.000+09:00
category: study
tags: ["Codex", "AI", "gstack", "자동화", "작업흐름"]
summary: "Codex에서 gstack 스킬 경로 오류 메시지가 뜨는 이유를 분석하고, 스킬을 안정적으로 호출하고 기록하며 검증하는 실전 사용법을 정리했다."
cover: ""
draft: false
source_file: "cms"
created_by: "codex"
---

Codex에서 스킬을 쓰다 보면 가끔 이런 종류의 메시지를 만난다.

```text
Get-Content : 'C:\Users\dejan\.codex\skills\gstack-investigate\SKILL.md' 경로는 존재하지 않으므로 찾을 수 없습니다.
```

겉으로 보면 스킬이 설치되지 않은 것처럼 보인다. 하지만 실제 원인은 대개 더 단순하다. Codex가 잘못된 위치에서 스킬 파일을 찾았기 때문이다.

## 왜 이 메시지가 뜨는가

이 작업 환경에는 스킬 경로가 하나만 있는 것이 아니다. 전역 스킬, 사용자 에이전트 스킬, 프로젝트 로컬 스킬이 함께 존재한다.

예를 들면 다음과 같은 경로가 동시에 쓰일 수 있다.

```text
C:\Users\dejan\.codex\skills
C:\Users\dejan\.agents\skills
I:\AI for works\.agents\skills
```

문제의 메시지는 `C:\Users\dejan\.codex\skills\gstack-investigate\SKILL.md`를 찾으려 했지만, 실제 `investigate` 스킬은 프로젝트 쪽인 `I:\AI for works\.agents\skills\gstack-investigate\SKILL.md`에 있었기 때문에 발생했다.

즉, 스킬 자체가 없어서가 아니라 “스킬 이름은 맞지만 기준 디렉터리가 틀린” 상황이다.

이런 일이 생기는 이유는 보통 세 가지다.

1. `AGENTS.md`에는 전역 규칙과 프로젝트 규칙이 함께 들어 있다.
2. gstack 스킬은 전역 설치와 프로젝트 설치를 모두 지원한다.
3. Codex가 처음에 추정한 경로가 현재 프로젝트의 실제 스킬 위치와 다를 수 있다.

그래서 스킬을 제대로 쓰려면 “스킬 이름”뿐 아니라 “현재 작업 루트에서 어느 스킬 디렉터리를 써야 하는지”를 먼저 확인해야 한다.

## Codex에서 스킬을 쓰는 기본 순서

스킬은 마법 명령어처럼 바로 실행하는 것보다, 작은 절차를 지키면 훨씬 안정적이다.

첫째, 현재 작업 폴더를 확인한다.

```powershell
Get-Location
```

둘째, 프로젝트의 스킬 디렉터리가 있는지 본다.

```powershell
Test-Path '.agents\skills'
Get-ChildItem '.agents\skills'
```

셋째, 필요한 스킬의 `SKILL.md`를 직접 읽는다.

```powershell
Get-Content '.agents\skills\gstack-investigate\SKILL.md' -TotalCount 120
```

넷째, 스킬 문서를 “참고 자료”가 아니라 “작업 절차”로 본다. 특히 `/investigate`는 원인 확인 없이 바로 수정하지 말라는 성격이 강하다. 반대로 `/ship`은 테스트, 버전, changelog, 커밋, PR까지 이어지는 배포 절차에 가깝다.

## 스킬을 잘 쓰는 감각

스킬은 명령어라기보다 작업 모드에 가깝다. 그래서 “무엇을 할지”보다 “어떤 기준으로 일할지”를 바꾸는 데 유용하다.

버그를 고칠 때는 `/investigate`가 좋다. 원인 조사, 가설, 구현, 검증을 분리해서 섣부른 수정을 막아준다.

PR이나 변경 사항을 확인할 때는 `/review`가 좋다. 코드를 칭찬하는 것이 아니라 실제 위험, 회귀, 누락된 테스트를 먼저 찾는 방식으로 생각하게 만든다.

배포 전에는 `/ship`이 맞다. 로컬 변경 확인, 테스트, 버전 정리, changelog, 커밋, 푸시, PR 생성까지 이어지는 흐름을 강제한다.

브라우저로 실제 화면을 확인해야 하면 `/browse`, `/qa`, `/qa-only`가 맞다. 화면이 있는 작업은 코드만 보고 끝내면 놓치는 문제가 많다.

## 좋은 요청 예시

Codex에게 스킬을 잘 쓰게 하려면 요청에 의도를 붙이는 것이 좋다.

```text
/investigate로 원인부터 확인하고 고쳐줘.
```

```text
/review 관점으로 이번 diff에서 위험한 부분만 찾아줘.
```

```text
/qa-only로 배포 전 화면 문제를 리포트만 해줘. 수정은 하지 마.
```

```text
/ship으로 테스트하고 PR까지 만들어줘.
```

스킬 이름을 직접 쓰지 않아도 된다. “왜 깨졌는지 원인부터 분석해줘”, “이 PR 리뷰해줘”, “배포 가능한 상태로 정리해줘”처럼 말해도 Codex가 맞는 스킬을 고를 수 있다. 다만 스킬을 확실히 쓰고 싶다면 `/investigate`처럼 이름을 명시하는 편이 가장 안전하다.

## 이 홈페이지 작업에서 배운 점

이번 메시지의 핵심은 스킬 실패가 아니라 경로 해석 실패였다.

처음에는 전역 경로를 보았다.

```text
C:\Users\dejan\.codex\skills\gstack-investigate\SKILL.md
```

하지만 실제로는 프로젝트 로컬 경로를 봐야 했다.

```text
I:\AI for works\.agents\skills\gstack-investigate\SKILL.md
```

그래서 스킬 관련 오류가 뜨면 바로 “스킬이 없다”고 판단하지 말고, 먼저 세 가지를 확인하는 것이 좋다.

1. 현재 작업 디렉터리가 맞는가.
2. `AGENTS.md`가 안내하는 스킬 루트가 어디인가.
3. 프로젝트 로컬 `.agents\skills`가 전역 스킬보다 우선되어야 하는 상황인가.

이 세 가지를 확인하면 대부분의 스킬 경로 문제는 빠르게 정리된다.

## 내 기준의 실전 규칙

Codex에서 스킬을 잘 쓰려면 다음 규칙만 기억해도 충분하다.

1. 버그는 먼저 `/investigate`로 원인을 본다.
2. 화면이 있으면 브라우저 검증을 포함한다.
3. 배포 전에는 `/review`나 `/ship`으로 한 번 더 잠근다.
4. 스킬 오류가 나면 이름보다 경로를 먼저 의심한다.
5. 프로젝트마다 `AGENTS.md`, `work.lock`, `log.txt` 규칙을 지킨다.

스킬은 일을 대신하는 버튼이 아니다. 작업의 기준을 높이고, 빠뜨리기 쉬운 절차를 다시 잡아주는 안전장치에 가깝다. Codex를 잘 쓰는 핵심은 스킬을 많이 부르는 것이 아니라, 지금 작업에 맞는 스킬을 고르고 그 스킬이 요구하는 검증까지 끝내는 데 있다.

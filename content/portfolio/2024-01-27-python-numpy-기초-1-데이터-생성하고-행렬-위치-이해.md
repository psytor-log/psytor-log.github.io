---
title: "[Python] numpy 기초 #1_데이터 생성하고 행렬 위치 이해"
date: 2024-01-27
category: portfolio
tags: ["python_라이브러리", "프로젝트", "기록", "AI"]
summary: "데이터 분석을 하든, 머신러닝을 하든, 자연어 처리를 하든 알아야 할 python의 기초 라이브러리 Numpy다. 라이브러리 설치 방법. conda install numpy 또는 pip install numpy numpy의 몇 가지 코드 연습. 넘파이 처음 공부할 때 알아야 할 점. np.arang(n)로 생성한 n..."
cover: ""
draft: true
source_file: "naver-blog"
source_blog_url: "https://blog.naver.com/coaching_blog/223335184855"
source_blog_category: "python_라이브러리"
source_blog_log_no: "223335184855"
created_by: "naver-import"
import_review_note: "네이버 카테고리 'python_라이브러리' 기준으로 확인했고, 제목/본문에 만들기/구현/프로젝트 성격이 있어 portfolio로 배치."
---

데이터 분석을 하든, 머신러닝을 하든, 자연어 처리를 하든 알아야 할 python의 기초 라이브러리
Numpy다.
​

라이브러리 설치 방법.
​
conda install numpy
또는
pip install numpy
​

numpy의 몇 가지 코드 연습.
​

![Python numpy 기초 #1_데이터 생성하고 행렬 위치 이해](/images/uploads/naver-223335184855-01.png)

넘파이 처음 공부할 때 알아야 할 점.
​
np.arang(n)로 생성한 n 개의 수는 n-1까지만 만들어진다.
np. arange(45)를 했으면 0~44까지 만든다. 숫자가 45개지 번호를 45번까지 만드는 것이 아님.
random으로 숫자 배열을 만들어서 인공지능 실습에 사용된다.
​
행렬을 여러 가지 만들 수 있다.
인공지능은 행렬로 계산하기 때문에 넘파이 개념을 잘 이해해 두는 것이 필수다.
​

![Python numpy 기초 #1_데이터 생성하고 행렬 위치 이해](/images/uploads/naver-223335184855-02.png)

위 코드를 작성하면 이런 결과가 나온다.
​

행렬의 의치 이해하기.
​

![Python numpy 기초 #1_데이터 생성하고 행렬 위치 이해](/images/uploads/naver-223335184855-03.png)

[[1,2]
[4,5]
[7,8]]
을 만들었다.
​
mat 변수에 3행 2열이 있다.
각각의 위치도 숫자로 표현하는데 0행, 0열부터 카운트하게 된다.
​

![Python numpy 기초 #1_데이터 생성하고 행렬 위치 이해](/images/uploads/naver-223335184855-04.png)

mat 행렬에서 2번째 행, 2번째 열에 있는 수는 '5'다.
​

![Python numpy 기초 #1_데이터 생성하고 행렬 위치 이해](/images/uploads/naver-223335184855-05.png)

mat 행렬에서 2번째 행, 1번째 열이 있는 수는 '7'이다.
​

위치를 정확하게 알면 행렬의 곳곳의 숫자를 불러오는 것도 가능하다.
​

![Python numpy 기초 #1_데이터 생성하고 행렬 위치 이해](/images/uploads/naver-223335184855-06.png)

mat 행렬에서
1행에 1열,
2행에 2열,
3행에 1열을 불러온다고 해보자.
​
mat[ ] 에서 [0,1,2] 행을 지정하고, [0,1,0] 열을 지정하면
행0열0, 행1열1, 행2열0으로 매칭이 돼서 그 위치의 수를 불러온다.
​
[1,5,7]
​
대괄호를 두 번 사용한다는 점을 기억하자.

![Python numpy 기초 #1_데이터 생성하고 행렬 위치 이해](/images/uploads/naver-223335184855-07.png)

한 번만 사용하면 오류가 난다.
인텍싱이 많이 됐다. 2차원 행렬인데 3개를 넣었다는 오류 메시지다.
​

![Python numpy 기초 #1_데이터 생성하고 행렬 위치 이해](/images/uploads/naver-223335184855-08.png)

그럼 차원을 맞춰서 입력하면 어떻게 될까?
그럼 mat 행렬의 1행2열에 있는 숫자 '2'와 리스트 [0,1,0] 이 들어 있는 튜플 형태가 된다.
​

행렬의 전체 row 또는 전체 column 선택하기.
​

![Python numpy 기초 #1_데이터 생성하고 행렬 위치 이해](/images/uploads/naver-223335184855-09.png)

전체 선택은 : 로 처리한다.
: 를 사용해서 범위를 지정할 수 있는데 아무것도 입력하지 않으면 전체가 선택된다.

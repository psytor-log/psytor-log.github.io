---
title: "pandas 기초 #3. Titanic dataset을 활용한 데이터 다루기 연습"
date: 2023-12-30
category: study
tags: ["python_라이브러리", "공부", "기록", "AI"]
summary: "보통 타이타닉 dataset은 Machine Learning을 연습할 때 사용되는 dataset이지만 여기서는 기본적인 pandas 함수를 연습하기 위한 샘플로 활용해 본다. 일단 titanic data를 검색해서 다운 받았다. 다운 받은 파일은 Machine Learning 을 위해서 train.csv와 test...."
cover: ""
draft: true
source_file: "naver-blog"
source_blog_url: "https://blog.naver.com/coaching_blog/223307609109"
source_blog_category: "python_라이브러리"
source_blog_log_no: "223307609109"
created_by: "naver-import"
import_review_note: "네이버 카테고리 'python_라이브러리' 기준으로 study에 배치."
---

​
보통 타이타닉 dataset은 Machine Learning을 연습할 때 사용되는 dataset이지만
여기서는 기본적인 pandas 함수를 연습하기 위한 샘플로 활용해 본다.
​
일단 titanic data를 검색해서 다운 받았다.
다운 받은 파일은 Machine Learning 을 위해서 train.csv와 test.csv 파일로 나눠져 있었다.
여기서는 pandas 연습만 해볼 예정이니까 titanic_train.csv 파일만 사용해 보려고 한다.

![pandas 기초 #3. Titanic dataset을 활용한 데이터 다루기 연습](/images/uploads/naver-223307609109-01.png)

작업을 하는 폴더에 이렇게 파일을 넣어줘야 불러오는 것이 편하다. 나는 Pandas를 연습을 위해 만들어 둔 폴더에 파일을 넣었다.
다른 폴더에 파일이 있어도 된다. 하지만 파일이 있으면 불러올 때 경로를 모두 지정해 줘야하는 번거로움이 생긴다.

![pandas 기초 #3. Titanic dataset을 활용한 데이터 다루기 연습](/images/uploads/naver-223307609109-02.png)

​
csv 파일을 불러온다.
pandas로 불어올 때는 pd.read_csv("파일이 있는 경로와 파일명.csv")를 입력하면 된다.
​
​
타이타닉 데이터를 titanic 에 넣고, 불어오면 다음과 같이 나타난다.

![pandas 기초 #3. Titanic dataset을 활용한 데이터 다루기 연습](/images/uploads/naver-223307609109-03.png)

불어온 파일은 891 행이 있고, label 값은 12개의 column에 기록되어 있다.
읽어온 파일은 처음 5개 row, 마지막 5개 row를 표시해 준다.
​
만약 5개 row 가 아닌 특정 갯수의 row를 보고 싶다면 .head() 함수를 사용할 수 있다.

![pandas 기초 #3. Titanic dataset을 활용한 데이터 다루기 연습](/images/uploads/naver-223307609109-04.png)

titanic에 있는 row 를 처음부터 10개까지 보여달라는 명령은 titanic.head(10) 이라고 하면 된다.
끝에서 10개를 보고

![pandas 기초 #3. Titanic dataset을 활용한 데이터 다루기 연습](/images/uploads/naver-223307609109-05.png)

싶다면 .head() -> .tail()을 사용하면 된다.
​
Pandas 에서는 각 열(column) 값의 데이터 유형을 확인하는 것도 가능하다.

![pandas 기초 #3. Titanic dataset을 활용한 데이터 다루기 연습](/images/uploads/naver-223307609109-06.png)

데이터 타입을 의미하는 .dtypes를 사용하면 된다. 이때 마지막에 괄호는 넣지 않는다.
dtype은 함수가 아니라 속성을 보여주는 것이기 때문이다. 즉 계산을 하는 것이 아니라 데이터의 형태를 보여주는 것이니까 () 는 뺀다.
​
dtype의 의미는 다음과 같다.
​
int64 : 정수
object : 문자
float64 : 소수점
​
이런 방식으로 데이터를 잘 가져왔는지, 데이터에 누락된 정보는 없는지 확인할 수 있다.

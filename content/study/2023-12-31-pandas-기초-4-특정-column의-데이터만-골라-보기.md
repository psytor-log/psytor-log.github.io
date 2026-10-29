---
title: "pandas 기초 #4. 특정 column의 데이터만 골라 보기"
date: 2023-12-31
category: study
tags: ["python_라이브러리", "공부", "기록"]
summary: "타이타닉 데이터를 pd.read_csv로 읽어와서 titanic 이란 변수명이 넣은 뒤, 데이터에서 \"Age\" column에 있는 값만 확인하고 싶다면, titanic[\"Age\"]만 data라는 변수에 넣어서 확인할 수 있다. data.head(20) 은 data 에 있는 값을 위에서 20개까지 보여달라는 명령이다...."
cover: ""
draft: true
source_file: "naver-blog"
source_blog_url: "https://blog.naver.com/coaching_blog/223308564621"
source_blog_category: "python_라이브러리"
source_blog_log_no: "223308564621"
created_by: "naver-import"
import_review_note: "네이버 카테고리 'python_라이브러리' 기준으로 study에 배치."
---

![pandas 기초 #4. 특정 column의 데이터만 골라 보기](/images/uploads/naver-223308564621-01.png)

타이타닉 데이터를 pd.read_csv로 읽어와서 titanic 이란 변수명이 넣은 뒤, 데이터에서 "Age" column에 있는 값만 확인하고 싶다면,
titanic["Age"]만 data라는 변수에 넣어서 확인할 수 있다.
​
data.head(20) 은 data 에 있는 값을 위에서 20개까지 보여달라는 명령이다.
단일한 열을 선택할 때는 [] 대괄호를 사용해서 column명을 지정해 주면 된다.
​

![pandas 기초 #4. 특정 column의 데이터만 골라 보기](/images/uploads/naver-223308564621-02.png)

선택한 데이터의 수를 확인해 보고 싶다면,
data.shape
titanic["Age"].shape
모두 같은 값을 출력하니까 편한 걸 사용하면 된다.
​
.shape은 데이터의 속성을 확인하는 명령이기 때문에 .shape() 처럼 사용하지 않는다.

다수의 columns를 확인하고 싶다면 다음과 같이 한다.

![pandas 기초 #4. 특정 column의 데이터만 골라 보기](/images/uploads/naver-223308564621-03.png)

titanic 데이터에서 나이와 성별을 확인하고 싶다면 위 이미지처럼 ["Age", "Sex"] columns를 선택하면 된다.
대괄호를 두 번 해주는 이유는, 안쪽 [] 는 python의 리스트를 의미하고, 바깥 [] 는 DataFrame을 선택한다는 의미다.
​
두 개의 columns를 포함하고 있기 때문에 .shape을 해보면
891개 데이터 수, 2차원이라는 것을 확인할 수 있다.

---
title: "[Python] pandas 기초 #13. 테이블에 있는 데이터 변경하기"
date: 2024-01-26
category: study
tags: ["python_라이브러리", "공부", "기록"]
summary: "타이타닉 데이터에 있는 성별 표시를 간단하게 바꿔보면서 테이블에 있는 정보를 변경하는 법을 실습해 본다. 변경은 .replace( ) 함수를 사용한다. 타이타닉 데이터를 불러온다. pandas를 import 해준다. 그리고 pd.read_csv( )를 사용해서 데이터를 로드해 주자. 불러온 데이터를 titanic 변..."
cover: ""
draft: true
source_file: "naver-blog"
source_blog_url: "https://blog.naver.com/coaching_blog/223334636050"
source_blog_category: "python_라이브러리"
source_blog_log_no: "223334636050"
created_by: "naver-import"
import_review_note: "네이버 카테고리 'python_라이브러리' 기준으로 study에 배치."
---

타이타닉 데이터에 있는 성별 표시를 간단하게 바꿔보면서 테이블에 있는 정보를 변경하는 법을 실습해 본다.
변경은 .replace( ) 함수를 사용한다.
​

타이타닉 데이터를 불러온다.
​
pandas를 import 해준다.
그리고 pd.read_csv( )를 사용해서 데이터를 로드해 주자.
​

![Python pandas 기초 #13. 테이블에 있는 데이터 변경하기](/images/uploads/naver-223334636050-01.png)

불러온 데이터를 titanic 변수에 넣은 화면.
​
성별 column에 male / female로 표시된 것을
남자는 M
여자는 F
로 변경해 보자.
​
titanic['Sex'].replace({"male" : "M", "female" : "F"})
titanic 테이블에 ['Sex'] column에 있는 데이터를 male은 M으로 바꾸고 female은 F로 바꾸라는 코드다.

![Python pandas 기초 #13. 테이블에 있는 데이터 변경하기](/images/uploads/naver-223334636050-02.png)

코드를 입력하고 titanic["Sex"] 를 불러오면
어라! 바뀌지 않았다.
​
​
.replace( ) 는 원본 데이터를 바꾸는 것이 아니라 변경하도록 처리만 하는 함수다.
그래서

![Python pandas 기초 #13. 테이블에 있는 데이터 변경하기](/images/uploads/naver-223334636050-03.png)

titanic[ " Gender " ] = titanic[ " Sex " ]. replace ({ " male " : " M " , " female " : " F " })
​
이렇게 titanic["Gender"]라는 column을 만들어서 변경 처리된 자료를 넣어줘야 한다.
​
titanic 테이블 마지막 column에 Gender 가 추가된 것을 확인할 수 있다.
​
​

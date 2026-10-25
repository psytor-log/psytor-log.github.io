---
title: "pandas 기초 #10. column에 있는 데이터 수는 몇 개일까?"
date: 2024-01-09
category: study
tags: ["python_라이브러리", "공부", "기록"]
summary: "python 에서 표를 다루는 pandas 라이브러리 실습을 해보자. 여기서는 데이터를 카테고리로 구분하고, 각 카테고리의 데이터가 몇 개인지 알아보는 실습을 한다. 실습을 위해 타이타닉 데이터를 가져온다. (구글에서 검색 후 실습에 필요한 데이터를 활용해도 괜찮고, 예시로 사용된 데이터를 쓰고 싶다면 링크 참조) ..."
cover: ""
draft: true
source_file: "naver-blog"
source_blog_url: "https://blog.naver.com/coaching_blog/223317619410"
source_blog_category: "python_라이브러리"
source_blog_log_no: "223317619410"
created_by: "naver-import"
import_review_note: "네이버 카테고리 'python_라이브러리' 기준으로 study에 배치."
---

python 에서 표를 다루는 pandas 라이브러리 실습을 해보자.
여기서는 데이터를 카테고리로 구분하고, 각 카테고리의 데이터가 몇 개인지 알아보는 실습을 한다.
​
실습을 위해 타이타닉 데이터를 가져온다.
(구글에서 검색 후 실습에 필요한 데이터를 활용해도 괜찮고, 예시로 사용된 데이터를 쓰고 싶다면 링크 참조)
링크에 문제가 있다면, 데이터 카테고리를 구분할 수 있는 Dataset을 활용하면 좋다.
​
https://drive.google.com/file/d/1Ot7PCAdsNPLSPlmG5jll9fSa1qJAdwAf/view?usp=drive_link
​
파일이 준비되면 불러오기 쉬운 폴더에 넣어준다.
나는 vs code에서 주피터 환경으로 작업을 하려고 한다. vs code를 사용하신다면 코드 작성 폴더에 데이터 파일을 넣자. 그래야 불러오기 편리하다.
​
데이터는 잠시 뒤에 불러오기로 하고, 먼
import pasdas as pd 로 라이브러리를 소환한다.

![pandas 기초 #10. column에 있는 데이터 수는 몇 개일까?](/images/uploads/naver-223317619410-01.png)

![pandas 기초 #10. column에 있는 데이터 수는 몇 개일까?](/images/uploads/naver-223317619410-02.png)

ship 이라는 변수에 타이타닉 데이터를 불러와서 넣었다. pd.read_csv() 라고 입력하고, ( ) 안에 파일 경로 + 파일명을 적어준다.
​

![pandas 기초 #10. column에 있는 데이터 수는 몇 개일까?](/images/uploads/naver-223317619410-03.png)

타이타닉 데이터를 ship 변수에 넣었으니까
ship['Pcalss'].value_counts() 명령을 입력하면
3등석 : 491명
2등석 : 184명
1등석 : 216명이 타이타닉에 탑승했다는 것을 알 수 있다.
​
같은 결과가 나오지만 다른 방식으로 코드를 작성하는 것도 가능하다.

![pandas 기초 #10. column에 있는 데이터 수는 몇 개일까?](/images/uploads/naver-223317619410-04.png)

.groupby() 함수를 사용해서 'Pclass'를 선택하고, ['Pclass']의 .count( )를 구하는 코드다.
.vlaue_counts와 차이점은 Pclass가 내림차순으로 정리되어 나온다는 것이다.
또 차이점은 결측치에 대한 count도 가능하다는 점이다.
​

![pandas 기초 #10. column에 있는 데이터 수는 몇 개일까?](/images/uploads/naver-223317619410-05.png)

각 등실 별로 Cabin이 있는 곳을 탐색해 보니
1등석 : 176명
2등석 : 16명
3등석 : 12명
​
위 값은 데이터가 누락된 칸의 정보를 빼고 나온 것이다.

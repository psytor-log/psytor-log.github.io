---
title: "[Python] seaborn으로 타이타닉 생존자 그래프 그려보자."
date: 2024-01-26
category: study
tags: ["python_라이브러리", "공부", "기록"]
summary: "타이타닉 생존 여부와 탑승자 나이의 관계를 시각적으로 확인해 보려고 한다. 파이썬을 사용하는 방법은 많다. 무료 강의에서 주로 보는 것을 google의 colab이다. 파이참도 있고, 아나콘다 쥬피터 노트북도 있고, 뭐도 있고, 뭐도 있고.... 이 블로그의 대부분 실습은 vs code의 주피터 환경에서 진행된다는 ..."
cover: ""
draft: true
source_file: "naver-blog"
source_blog_url: "https://blog.naver.com/coaching_blog/223334715582"
source_blog_category: "python_라이브러리"
source_blog_log_no: "223334715582"
created_by: "naver-import"
import_review_note: "네이버 카테고리 'python_라이브러리' 기준으로 study에 배치."
---

타이타닉 생존 여부와 탑승자 나이의 관계를 시각적으로 확인해 보려고 한다.
​
파이썬을 사용하는 방법은 많다.
무료 강의에서 주로 보는 것을 google의 colab이다.
​
파이참도 있고,
아나콘다 쥬피터 노트북도 있고,
뭐도 있고, 뭐도 있고....
​
이 블로그의 대부분 실습은
vs code의 주피터 환경에서 진행된다는 점을 참고하자.
​

환경을 이야기하는 이유는
파이썬 라이브러리를 설치하는 방식에서 약간씩 차이가 있는 것 같아서다.
​
주피터 노트북 환경에서 seaborn 을 설치해 보자.
​
pip install seaborn

![Python seaborn으로 타이타닉 생존자 그래프 그려보자.](/images/uploads/naver-223334715582-01.png)

https://blog.naver.com/coaching_blog/223317091489

![Python seaborn으로 타이타닉 생존자 그래프 그려보자.](/images/uploads/naver-223334715582-02.jpg)

타이타닉 데이터를 다운 받고 로드하는 것을 위 포스팅을 참고해도 좋다.
​
여기서는 타이타닉 데이터를 활용한 실습을 진행해 본다.
​

![Python seaborn으로 타이타닉 생존자 그래프 그려보자.](/images/uploads/naver-223334715582-03.png)

먼저 탑승자의 나이 분포를 그래프로 그려보자.
​
seaborn은 통상 sns로 줄여서 사용한다.
sns.distplot( ) 으로 titianic의 ['Age'] column에 있는 데이터를 그래프로 나타내는 코드다.
​

![Python seaborn으로 타이타닉 생존자 그래프 그려보자.](/images/uploads/naver-223334715582-04.png)

x축에 Age, y축에 밀도를 보여준다.
​

![Python seaborn으로 타이타닉 생존자 그래프 그려보자.](/images/uploads/naver-223334715582-05.png)

bins = 50을 추가하면 막대기의 개수를 늘릴 수 있다.

![Python seaborn으로 타이타닉 생존자 그래프 그려보자.](/images/uploads/naver-223334715582-06.png)

bins는 표시되는 막대의 수를 의미한다.
​

이제 생존자 데이터와 사망자 데이터를 분리해서 저장해 보자.
생존자와 사망자 데이터를 따로 시각화를 해보면 직관적으로 확인할 수 있다.
​

![Python seaborn으로 타이타닉 생존자 그래프 그려보자.](/images/uploads/naver-223334715582-07.png)

Survived column에 1은 생존자를 의미한다.
​
["Survived"] == 1 은 column의 값이 1인 경우 True를 반환하게 된다.
titanic[ ] 안에 다시 titanic["Survived"] == 1을 넣는 것은
titanic["Survived"] 값이 1이라서 True인 것을 다시 titanic 전체 데이터에서 선택하기 때문이다.
​
말이 좀 어려운데 코드를 이것저것 바꿔가면서 실습하면 점점 이해가 된다.
​
이렇게
생존자 데이터만 모아서 df_1에 넣는다.
​
​

![Python seaborn으로 타이타닉 생존자 그래프 그려보자.](/images/uploads/naver-223334715582-08.png)

사망자 데이터만 df_0에 넣는다.
​

![Python seaborn으로 타이타닉 생존자 그래프 그려보자.](/images/uploads/naver-223334715582-09.png)

.shape으로 몇 개씩 들어있는지 확인!
​

그래프를 그려보자.
​

![Python seaborn으로 타이타닉 생존자 그래프 그려보자.](/images/uploads/naver-223334715582-10.png)

sns.distplot으로 그래프를 그릴 수 있다.
​
df_0 테이블에서 'Age' 데이터를 그래프로 그리고, label로 'not'을 표시한다.
df_1 테이블에서도 마찬가지다. df_0과 구분하기 위해 label을 'survived'로 지정한다.
​
그래프를 그려주는 matplotlb 라이브러리를 불러오자.
​
colab에서 할 때는 matplotlib이 없어도 그래프가 그려졌는데
vs code에서는 그래프를 그려지지만 label 표시가 안 되더라.
​
그래서
plt.legent( ) 로 label을 표시해 주고,
plt.show( ) 로 그래프 출력하면 다음과 같다.
​

![Python seaborn으로 타이타닉 생존자 그래프 그려보자.](/images/uploads/naver-223334715582-11.png)

타이타닉 사고 때 어린아이의 안전을 우선적으로 확보했나 보다.
​
짧은 실습으로 python을 공부하는 포스팅은 앞으로도 계속!!

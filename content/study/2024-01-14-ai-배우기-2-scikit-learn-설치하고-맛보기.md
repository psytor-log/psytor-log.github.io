---
title: "[AI 배우기 #2] scikit-learn 설치하고 맛보기"
date: 2024-01-14
category: study
tags: ["AI", "공부", "기록"]
summary: "※ 실습은 vs code에서 주피터 노트북 환경을 만들어서 진행한다. [주피터 노트북 환경 준비하기] vs code를 실행하고, 파일 만들기 아이콘을 눌러서 실습을 진행할 새로운 파일을 만들어 줬다. 파일명은 1_sklearn.ipynb 로 했다. [scikit-learn 설치하기] 간단하게 pip를 사용해서 설치할..."
cover: ""
draft: true
source_file: "naver-blog"
source_blog_url: "https://blog.naver.com/coaching_blog/223322263790"
source_blog_category: "AI"
source_blog_log_no: "223322263790"
created_by: "naver-import"
import_review_note: "네이버 카테고리 'AI' 기준으로 study에 배치."
---

​
※ 실습은 vs code에서 주피터 노트북 환경을 만들어서 진행한다.
​
​
[주피터 노트북 환경 준비하기]
​

![AI 배우기 #2 scikit-learn 설치하고 맛보기](/images/uploads/naver-223322263790-01.png)

vs code를 실행하고,
파일 만들기 아이콘을 눌러서 실습을 진행할 새로운 파일을 만들어 줬다.
​
파일명은 1_sklearn.ipynb 로 했다.
​
​
​
​
​
​
[scikit-learn 설치하기]
​
간단하게 pip를 사용해서 설치할 수 있다.
​

![AI 배우기 #2 scikit-learn 설치하고 맛보기](/images/uploads/naver-223322263790-02.png)

​
프로그래밍을 막 배우기 시작할 무렵에
난 설치방법부터 무척 헷갈렸다.
​
conda로 설치하기,
가상환경에 설치하기,
pip 설치하기 등등.
​
이런 경험 때문에 포스팅은 한 가지 설치 방법으로만 진행한다.
​
​
​
​
[설치를 했으니까 간단한 예측 모형 실습을 해보자.]
​

![AI 배우기 #2 scikit-learn 설치하고 맛보기](/images/uploads/naver-223322263790-03.png)

scikit-learn을 불러올 때는
from sklearn을 사용한다.
​
from sklearn import tree
​
실습할 것은 의사결정트리 모델이다.
의사결정트리는 회귀와 분류를 할 수 있는 머신러닝 모델의 한 종류다.
​
실습을 위해 간단한 데이터를 만들어 보자.
​

![AI 배우기 #2 scikit-learn 설치하고 맛보기](/images/uploads/naver-223322263790-04.png)

x 변수에는 [0,0] [1,1]을 넣어주고,
y 변수에는 [0,1]을 넣는다.
​
x 데이터로 y 값을 예측하고자 한다고 가정해 보자.
​
그럼 x 에 있는 [0,0] 데이터는 y 에 있는 0과 대응되고,
x 에 있는 [1,1] 데이터는 y 에 있는 1과 대응된다.
​
이해를 쉽게 하기 위해서
x 는 문제라고 하고, y를 정답이라고 생각하면 된다.
​
f(x) = y 라는 함수에서
f([0,0]) = 0이고
f([1,1)] = 1이라고 컴퓨터에 알려주는 것이다.
​
문제와 정답만 알려주고,
푸는 방법을 컴퓨터에게 찾으라고 하는 방법이
Supervised Machine Learning(지도학습)이고
푸는 방법을 찾는 알고리즘 중 '의사결정나무(DecisionTreeClassifier)를 사용해 볼 것이다.
​
​
컴퓨터에게 머신러닝을 시켜보자.

![AI 배우기 #2 scikit-learn 설치하고 맛보기](/images/uploads/naver-223322263790-05.png)

이 두 줄의 코드는
clf 라는 변수에 의사결정트리 방식을 사용할 것을 집어넣고,
문제 x 와 정답 y를 학습해서 찾은 방식을 pred에 가지고 있으라는 의미다.
​
그럼 이제부터 pred는 f(x)라는 함수를 풀 수 있게 된 것이다.
​
​
​
​
​
[예측을 시켜보자]
​

![AI 배우기 #2 scikit-learn 설치하고 맛보기](/images/uploads/naver-223322263790-06.png)

pred 에 머신러닝을 시킨 학습 방식이 들어있다.
pred.predict([[2,2]])는 어떤 값이 나올지 예측해 보는 코드다.
​
이건 f(x) = ? 과 같은 의미기도 하다.
f(x) = pred.predict() = y 라고 보면 된다.
​
결과는 array([1]) 로 나온다.
여기서 array([1])은 예측값이 1 이란 의미가 아니다.
y = [0,1] 에서 두 번째 값을 의미하는 것이다.
(리스트는 0번째부터 시작한다는 것을 기억하자.)
​
그래서
[2,2] 의 값을 1로 예측한 것이다.
​
이해를 돕기 위해 입력 데이터를 아래와 같이 바꿔보자.

![AI 배우기 #2 scikit-learn 설치하고 맛보기](/images/uploads/naver-223322263790-07.png)

x 변수에 [2,2] 가 제외된 것을 주의하자.
y 변수에도 2를 넣지 않았다.
​
이렇게 x 값과 y 값을 더 다양하게 넣고
같은 방식으로 의사결정트리 사용 학습을 시켜보자.
​

![AI 배우기 #2 scikit-learn 설치하고 맛보기](/images/uploads/naver-223322263790-08.png)

​
그리고 [2,2]의 값을 예측하게 해보면 답은?

![AI 배우기 #2 scikit-learn 설치하고 맛보기](/images/uploads/naver-223322263790-09.png)

array([2])를 예측했다.
​
array([2])는 예측값을 2라고 한 것이 아니다.
우리는 y 변수에 2를 넣지 않았다.
지도학습은 정답 보기에 없는 것을 답으로 내놓지 못한다.
​
여기서 [2]는 세 번째 값을 의미한다.
y =[0,1,3,4,5] 에서
세 번째 값은 3이다.
​
컴퓨터는 [2,2] 데이터의 값을 3으로 예측했다.
​
(0번째부터 카운트한다는 점 다시 기억하기)
​
데이터를 바꿔가면서 결과가 바뀌는 것을 연습해 보자.
​
scikit- learn 설치와 간단한 실습 끝.

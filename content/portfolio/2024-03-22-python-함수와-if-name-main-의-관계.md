---
title: "[Python] 함수와 if __name__ == \"__main__\"의 관계"
date: 2024-03-22
category: portfolio
tags: ["python_라이브러리", "프로젝트", "기록", "AI"]
summary: "인공지능에 데이터 학습을 시킬 때 customdata를 만든다. class 와 def 함수로 이뤄진 customdata를 만들면 가장 마지막 부분에 if __name__ == \"__main__\" : (이걸 'main() 함수'라고 부르자.) 을 작성하는 것으로 마무리한다. 간단한 예제로 함수와 if __name__ ..."
cover: ""
draft: true
source_file: "naver-blog"
source_blog_url: "https://blog.naver.com/coaching_blog/223392085411"
source_blog_category: "python_라이브러리"
source_blog_log_no: "223392085411"
created_by: "naver-import"
import_review_note: "네이버 카테고리 'python_라이브러리' 기준으로 확인했고, 제목/본문에 만들기/구현/프로젝트 성격이 있어 portfolio로 배치."
---

![Python 함수와 if __name__ == "__main__"의 관계](/images/uploads/naver-223392085411-01.png)

인공지능에 데이터 학습을 시킬 때 customdata를 만든다.
​
class 와 def 함수로 이뤄진 customdata를 만들면 가장 마지막 부분에
if __name__ == "__main__" : (이걸 'main() 함수'라고 부르자.)
을 작성하는 것으로 마무리한다.
​
​
간단한 예제로 함수와 if __name__ == "__main__"의 관계를 확인해 보자.
​
구구단을 출력하는 함수를 만들고, 그 아래 main() 함수를 적었다.
​

![Python 함수와 if __name__ == "__main__"의 관계](/images/uploads/naver-223392085411-02.png)

코드를 실행하면 input 값을 입력받는다.
만약 7을 입력하면 '구구단 7단' 과 함께 그 이후 구구단을 출력하게 만들었다.
​
그리고 main() 함수로 def gugudan() 함수를 실행한 결과는 다음과 같다.
​

![Python 함수와 if __name__ == "__main__"의 관계](/images/uploads/naver-223392085411-03.png)

main() 함수는 프로그램의 시작점을 의미한다.
​
복잡한 코드일수록 이런 시작점을 찾는 것이 중요해진다.
시작점부터 코드를 해석해야 하기 때문이다.
​
당연한 이야기지만 main() 함수가 없다면 프로그램은 처음부터 순차적으로 실행된다.
​
​
main() 함수는 시작점을 알리면서 추가 코드를 작성하는 것도 가능하다.
간단한 예는 이렇다.
​

![Python 함수와 if __name__ == "__main__"의 관계](/images/uploads/naver-223392085411-04.png)

def 함수는 간단하게 작성하고,
main() 함수에 text 값과 숫자를 받는 코드를 추가했다.
​
input 값으로 텍스트를 받아서 입력한 숫자만큼 출력하는 코드다.
​
text 값으로 yes!를 입력했고,
숫자를 5로 입력했더니 결과는 yes! 5회 출력.
​
​
main() 함수는 프로그램의 시작점을 지정하는 것이라고 했다.

![Python 함수와 if __name__ == "__main__"의 관계](/images/uploads/naver-223392085411-05.png)

위 코드에서 def () 함수의 순서로 출력한다면
"안녕을 영어로 하면 위와 같다"
"Hi there!"
순서로 출력되어야 하지만
main() 함수에서 def 함수 순서를 지정한 것처럼 결과가 나왔다는 걸 확인할 수 있다.
​
​
if __name__ == 'main' 는 프로그램의 시작 지점을 설정하는 것이며,
def 함수나 class 지정도 모두 가능하다.
​

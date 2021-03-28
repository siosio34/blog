---
title: React Binding 어떤 방식을 써야할가
description: bind 에 대한 개념부터 각 바인드 방식의 장단점을 비교해보고 좀 더 나은 성능을 위한 올바른 bind 과정까지 알아보자.
tags: react
createdAt: Sun Mar 28 2021 13:44:41 GMT+0900 (GMT+09:00)
updatedAt: Sun Mar 28 2021 13:44:41 GMT+0900 (GMT+09:00)
author: youngje jo / siosio3103@gmail.com
---

먼저 리액트의 binding 에 대해서 알기전에 bind의 개념에 대해서 먼저 알아보자.

```jsx
this.x = 9;
var module = {
  x: 81,
  getX: function () {
    return this.x;
  },
};

module.getX(); // 81

var retrieveX = module.getX;
// 1번 상황
console.log(retrieveX());
// 9 반환 - 함수가 전역 스코프에서 호출됐음

// module과 바인딩된 'this'가 있는 새로운 함수 생성
// 신입 프로그래머는 전역 변수 x와
// module의 속성 x를 혼동할 수 있음

var boundGetX = retrieveX.bind(module);
// 2번 상황
console.log(boundGetX()); // 81
```

출처 : [MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

먼저 위의 1번 상황을 보면 9가 호출이 되었다. 제일 처음 개발언어로 자바스크립트를 배우는 사람이거나 다른 언어를 배우다가 자바스크립트를 하게된 사람이라면 해당 현상이 잘 이해가 안 갈수 있다. 나같은 경우에도 비슷한 이슈를 겪은적이 있는데 그 당시에는 지역변수보다 전역변수의 값을 우선적으로 따르는 이상한 언어라면서 엄한 자바스크립트를 탓하기도 했다. 그럼 왜 81이 아니고 9가 선언되었는가? 그 답은 1번 상황에서 **해당 모듈은 전역으로 선언이 되었고 해당 this는 전역에 있는 this 이므로 블록 바깥에 있는 x를 참조해서 9를 출력한것을 알 수 있다.**

> **그러면 module 안쪽에 있는 x를 참조하게 할려면 어떻게 해야할가?**

이를 위해서 javascript 에서는 bind 라는 기능을 제공한다. bind 메서드를 호출하게 되면 새로운 함수를 리턴하게 된다. bind 함수의 첫 인자로는 참조한 this 객체를 설정하고 추가적인 파라미터는 바인드 된 함수의 파라미터가 있을경우 해당 함수의 인수로 들어가게 된다. 자 이제 2번 상황을 다시 보자

```jsx
var boundGetX = retrieveX.bind(module);
console.log(boundGetX()); // 81
```

boundGetX 변수는 이제 전역으로 선언한 retrieveX 에서 this 객체가 이제 전역에 있는 this가 아닌 module 내의 객체를 따르는 새로운 함수로 정의되게 되고 81이 정상적으로 나오게 되는걸 알 수 있다.

**bind 에 대해 좀 더 자세히 알아보고 싶으면 좀 더 심화적으로 알아보고 싶으면 해당 [링크](https://ko.javascript.info/bind)를 참고하자.**

> **React 내에서 Binding 을 알아보자**

먼저 아래 코드를 보자

```jsx
import React from "react";

class Baemin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
    };
  }

  handleClick(e) {
    this.setState({ isChecked: true });
    // Error !! this 는 undefined !!
  }

  render() {
    return <button onClick={this.handleClick}>우와</button>;
  }
}
```

해당 코드는 handleClick 부분에서 에러를 발생시킨다. javascript 클래스 내부에서는 함수에 대한 binding 처리가 되어 있지않다. 그래서 handleClick 함수 내부에서 this를 가져올려 할때 에러가 난다. 이 와 같은 문제를 해결하기 위해 다양한 방법으로 binding 처리를 해야되는데 그 방법은 아래와같다.

## 리액트 내에서 binding하는 방식

---

> 방법1 - 생성자에서 binding을 해주는 방법

```jsx
import React from "react";

class Baemin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.setState({ isChecked: true });
  }

  render() {
    return <button onClick={this.handleClick}>우와</button>;
  }
}
```

**장점** :

- 제일 기본적인 방법, 앞으로 나올 방식에 비해 성능이슈를 야기하지않음.

**단점** :

- 바인딩이 필요한 함수를 유지보수할때(함수를 정의할때, 수정, 삭제)할때 등 생성자에도 따로 관리를 해야된다.

---

> 방법2 - 이벤트 헨들러에 inline으로 this를 bind 하는 방법

```jsx
import React from "react";

class Baemin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
    };
  }

  handleClick(e) {
    this.setState({ isChecked: true });
  }

  render() {
    return <button onClick={this.handleClick.bind(this)}>우와</button>;
  }
}
```

**장점** :

- 방법 1에서 유지보수성을 높인 방법이다. 단순 유지보수성만 높인 코드라 방법1과 같이 성능이슈를 야기하지않는다.

**단점** :

- 가독성이 떨어진다. this.handleClick 함수를 그대로 쓰는게 아니라 .bind(this) 까지 매 이벤트 핸들러에 추가를 해줘야함. 그냥봐도 좀 많이 못생긴거 같다!

---

> 방법3 - 콜백에 화살표 문법을 사용하는 방법

```jsx
import React from "react";

class Baemin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
    };
  }

  handleClick(e) {
    this.setState({ isChecked: true });
  }

  render() {
    return <button onClick={(e) => this.handleClick(e)}>우와</button>;
  }
}
```

**장점** :

- 바인딩이 필요한 함수를 유지보수할때(함수를 정의할때, 수정, 삭제)할때 등 생성자에도 따로 관리를 할 필요가없다.

**단점** :

- onClick 함수내에 저렇게 인라인으로 선언하는 경우 해당 컴포넌트가 새로 렌더링 될때마다 콜백 객체가 새로 생성이 되는데 눈에 띌정도로 성능에 악영향을 끼치지 않겠지만 하위컴포넌트로 전달될경우 새로 객체가 생성되는 부분이므로 불필요한 리렌더링을 수행할 수도 있다.

---

> 방법4 - 함수를 정의할때부터 화살표 함수 사용.

```jsx
import React from "react";

class Baemin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
    };
  }

  handleClick = (e) => {
    this.setState({ isChecked: true });
  };

  render() {
    return <button onClick={this.handleClick}>우와</button>;
  }
}
```

**장점** :

- 바인딩이 필요한 함수를 유지보수할때(함수를 정의할때, 수정, 삭제)할때 등 생성자에도 따로 관리를 할 필요가없다.
- jsx 콜백 객체가 새로 생성될일도 없어 해당 부분으로 이슈 생기는 부분이 없고 가독성 측면에서도 좀 더 훌륭하다.
- 화살표 함수는 이벤트 핸들러를 처리할때 이벤트 객체 외에 추가적인 변수를 받을때 엄청난 가독성을 자랑한다. 아래 예제를 보자

```jsx
import React from "react";

class Baemin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
    };
  }

  handleClick = (index) => (e) => {
    this.setState({ isChecked: true });
  };

  render() {
    return <button onClick={this.handleClick(3)}>우와</button>;
  }
}
```

화살표 함수를 사용하지 않고도 커링 방식을 사용하면 똑같이 할수는 있지만 가독성이 많이 떨어진다.

```jsx
handleClick() {
		return function (e) {
			this.setState({ isChecked: true });
		};
	}
```

**단점** :

- 없어보였다... 그래서 이게 무조건 정답이라 생각했던거 같다.

## 정말 arrow function binding 은 아무런 문제가 없을가?

---

결론부터 얘기하자면 "아니다" 라고 할 수 있다. 먼저 아래 코드를 보자

![https://tva1.sinaimg.cn/large/e6c9d24egy1go4haoucatj21460jmjwk.jpg](https://tva1.sinaimg.cn/large/e6c9d24egy1go4haoucatj21460jmjwk.jpg)

⇒ Babel(presets[stage-3])

arrow function 으로 작성된 함수와 일반 함수와의 트랜스파일 결과물이 다르다.

1. arrow function 이 원래 있던 스펙이 아니다보니 기존 자바스크립트 엔진에서 돌리기 위하여 추가적으로 \_defineProperty라는 함수를 정의해서 생성자에서 추가하는 작업을 수행하고 있다.
2. prototype 을 출력해보았을때 arrow function 으로 선언한 부분은 빠져있는걸 볼 수 있다.

javascript engine 은 prototype 을 최적화하기 위한 알고리즘을 가지고 있고 해당 부분은 [여기](https://mathiasbynens.be/notes/prototypes) 에 잘 나와있다.

해당 글을 요약하자면 클래스에서 new Class() 같이 새로운 객체를 생성하고 그 안에서 method를 호출했을때 prototype안에 있는 method 일 경우 그 method를 찾는 검색시간이 짧아진다. 그리고 각 객체에서 새 method를 생성하는게 아니고 prototype에 있는 method를 공유한다. 즉 prototype 에 있는 함수에 접근하는 경우 엔진단에서 성능 최적화를 해주고 화살표 함수로 클래스 내에서 선언되는 경우 prototype 에 포함되지 않아 성능이 좀 더 떨어진다.

아래는 실제 벤치 마킹 자료이다.

![https://tva1.sinaimg.cn/large/e6c9d24egy1go4h9hoymzj20u018g4ag.jpg](https://tva1.sinaimg.cn/large/e6c9d24egy1go4h9hoymzj20u018g4ag.jpg)

[Arrow Functions in Class Properties Might Not Be As Great As We Think](https://medium.com/@charpeni/arrow-functions-in-class-properties-might-not-be-as-great-as-we-think-3b3551c440b1)

## 성능과 유지보수성 두마리의 토끼를 한번에 잡을수 없을가?

---

arrow function 은 사용하기 편하고 가독성이 좋다. 그러나 성능 문제가 있고 일반 bind 방식은 성능은 좀 더 좋지만 가독성이 좋지않고 사용하기 좀 불편하다. 두마리 토끼를 그나마 잡을 수 있는 방법은 없을가?

그나마 차선책이 하나 있다. 해당 [autobind-decorator](https://github.com/andreypopp/autobind-decorator) 라는 라이브러리를 보자

해당 라이브러리를 사용하면은 함수 선언할때 데코레이터만으로 자동으로 bind를 해준다.

```jsx
import { boundMethod } from "autobind-decorator";

class Component {
  constructor(value) {
    this.value = value;
  }

  @boundMethod
  method() {
    return this.value;
  }
}
```

각 함수별 뿐만 아니라 클래스 전체에도 바인딩을 할수 있다.

(하지만 바인딩 된 메서드는 느리므로 성능약화 이슈가 있어 권장하진않는다.)

```jsx
import { boundClass } from "autobind-decorator";

@boundClass
class Component {
  constructor(value) {
    this.value = value;
  }

  method() {
    return this.value;
  }
}
```

그러나 추가라이브러리가 필요한데에다가 아직 데코레이터 문법은 javascript 내에 표준은 아니구 팀 내 새로온 개발자들이 봤을때 익숙치 않은 문법이라는 단점은 존재한다.

## 요약

---

지금까지 다양한 bind의 개념과 각각의 binding 방법의 장단점에 대해서 알아보았다. 각각의 방법에 장단점이 존재한다. 성능을 좀 더 중요시 하는 팀, 여러 프로젝트에서 사용되는 디자인 시스템을 만드는팀(해당 디자인 시스템 컴포넌트를 가져다쓸때 prototype 최적화 지원 x, prototype 요소 공유가 안되서 새로운 요소 계속 생성 문제) 에서는 arrow function으로 작성하는 binding을 지양해야될것이다. 그와 반대로 표준이 아닌게 꺼려지는 팀, 코드 가독성이 중요한 팀, 하나의 컴포넌트가 다른 여러곳에서 사용되는게 적은 팀이라 성능이슈가 거의 일어나지 않을 팀 등은 arrow function 으로 간단히 binding을 해도 될것같다. 아직은 이게 정답이다! 최선이다! 하는 방법은 없다고 생각이 드니 팀내나 개인의 상황에 맞춰서 잘 선택하면 될듯하다.

> 추가로 binding은 **반드시 필요한 곳에만 사용하자**. binding 함수는 일반 함수보다 성능적으로 느려서 binding이 필요없는곳까지 전부 다 사용하면 성능 이슈를 야기할수 있다!

### 참고 문헌 및 사이트

---

[https://ko.reactjs.org/docs/handling-events.html](https://ko.reactjs.org/docs/handling-events.html)

[https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/bind](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

[https://ko.javascript.info/bind](https://ko.javascript.info/bind)

[https://ibrahimovic.tistory.com/29](https://ibrahimovic.tistory.com/29)

[https://medium.com/@charpeni/arrow-functions-in-class-properties-might-not-be-as-great-as-we-think-3b3551c440b1](https://medium.com/@charpeni/arrow-functions-in-class-properties-might-not-be-as-great-as-we-think-3b3551c440b1)

[https://poiemaweb.com/es6-arrow-function](https://poiemaweb.com/es6-arrow-function)

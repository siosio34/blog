---
title: CORS 에 대해서 알아보자
description: 웬만한 프론트엔드 개발자나 서버 개발자는 한번쯤 만나본 이슈 일것이다. CORS 관련 문제가 생겼을때 서버나 프론트엔드 둘중 한명이라도 이 개념에 대해서 잘 이해하고 있으면 해당 이슈를 빠르게 해결할 수 있다. 이번 글에서는 CORS가 무엇이며 이것이 생긴 이유와 해결책 등 전반적으로 CORS에 관한 모든 부분을 정리해보고자 한다.
tags: CS
createdAt: Sun Mar 28 2021 13:44:41 GMT+0900 (GMT+09:00)
updatedAt: Sun Mar 28 2021 13:44:41 GMT+0900 (GMT+09:00)
author: youngje jo / siosio3103@gmail.com
---

## 개요

**CORS(Cross-Origin Resource Sharing)** ... 웬만한 프론트엔드 개발자나 서버 개발자는 한번쯤 만나본 이슈 일것이다. CORS 관련 문제가 생겼을때 서버나 프론트엔드 둘중 한명이라도 이 개념에 대해서 잘 이해하고 있으면 해당 이슈를 빠르게 해결할 수 있다. 이번 글에서는 CORS가 무엇이며 이것이 생긴 이유와 해결책 등 전반적으로 CORS에 관한 모든 부분을 정리해보고자 한다.

## CORS 란 무엇인가 ?

CORS는 Cross Origin Resource Sharing의 약자이다. 여기서 Cross Origin 은 웹 내에서 현재 자신의 Resource(도메인, 프로토콜, 포트)가 다른 상황을 의미하며 이 경우에 자신의 출처와 다른 출처에 있는 자원을 가져오기 위해 하는 요청을 Cross Origin Request라고 한다. CORS는 웹 어플리케이션이 다른 출처에 자원에 접근할 수 있는 권한을 부여하도록 브라우저에 알려주는 체제이다. 즉 서버 내에서 다른 도메인으로 요청한 것에 대해서는 기본적으로 Cross Origin Request로 인한 에러가 발생하지 않는다. 처음엔 이 사실을 몰랐을 때 postman 내에서 보낸 요청은 잘 가는데 프론트 문제가 아니냐라는 피드백을 듣고 삽질을 엄청 했던 기억이 있다. 말로만 설명하면 잘 이해가 안 갈까 봐 아래에 MDN에서 가져온 사진이다.

![https://tva1.sinaimg.cn/large/e6c9d24egy1go4h26dfsvj213k0qigys.jpg](https://tva1.sinaimg.cn/large/e6c9d24egy1go4h26dfsvj213k0qigys.jpg)

[교차 출처 리소스 공유 (CORS)](https://developer.mozilla.org/ko/docs/Web/HTTP/CORS)

## 브라우저에서 다른 Resource 로 요청을 제한하는 이유가 뭘까?

웹 브라우저에서 다른 출처와의 요청이 아무런 제약이 없다 가정해보자. XSS 공격(요즘은 브라우저 단이나 개발 언어 자체에서 미리 위험을 알려줘서 일어날 확률은 매우 적지만...)을 통해서 사용자의 쿠키 정보가 다른 도메인에 있는 해커서버로 전송될 수도 있다. 이 이외에도 CORS 가 없으면 우리가 안전하게 웹 사이트를 이용하는데 제약이 생긴다.

## Cross Origin Request 의 종류

먼저 request의 종류를 알아보기전에 CORS Preflighted requests 라는 용어를 알아야한다. 클라이언트가 HTTP 요청을 서버로 보내기전에 OPTIONS 메서드를 통해서 다른 도메인의 리소스로 HTTP 요청을 보내 이 요청을 보내도 되는지 확인을 하는데 이를 CORS Preflighted requests 라고 한다. 브라우저에서는 simple requests 라고 판단되는 요청은 CORS Preflighted requests 를 보내지 않고 아닌 요청은 CORS Preflighted requests 보내서 다른 도메인으로 요청을 보내도 되는지 다시한번 체크를 한다.

### **simple requests**

이 요청은 HTTP Method와 HTTP Header가 아래 조건을 충족해야한다. 해당 조건을 충족하지 않으면 simple requests 가 아니라고 판단하고 preflighted requests 를 날린다.

**HTTP Method**

- GET, POST, HEAD

**HTTP HEADER(예전엔 더 많았는데 MDN 영문 최신판을 보니 많이 사라지고 저것만 남았드라...)**

- ACCEPT
- Accept-Language
- Content-Language
- Content-Type
  - application/x-www-form-urlencoded
  - multipart/form-data
  - text/plain

### **simple requests 가 아닌 요청**

s 해당 요청에서는 preflight requests 를 보내고 이에 따른 응답에 따라 추가 요청을 보낸다 그 과정은 다음과 같다.

- 단계 1: **preflight 요청**(원래 요청을 보내기전에 해당 서버에 보내도 되는지 미리 확인하는 작업)

preflight 요청은 OPTIONS 메서드를 사용하고 서버로 다음과 같은 두가지 헤더를 보내 원래 보내려고 했던 요청을 보내도되는지 확인한다.

```bash
Origin: 원래 보내려고 했던 요청의 Origin(ex. https://www.naver.com)
Access-Control-Request-Method: 원래 보내려고 했던 요청의 HTTP METHOD(ex. PUT, DELETE)
Access-Control-Request-Headers: 원래 보내려고 했던 요청의 Request Headers
```

- 단계 2: **preflight 응답**

보통 CORS에 대한 문제를 해결할때 서버개발자와 프론트엔드 개발자가 둘다 CORS에 관한 지식이 없을경우 CORS 관련 문제를 해결하기 위해 프론트엔드 쪽에서 이러저러한 삽질을 하는 경우를 간혹본다. (솔직히 나도 그랬다. 포스트맨 요청은 잘간다고 하면서...) 다음엔 이런 문제를 겪으면은 서버 개발자를 한번 노련하게 노려본후(와... 라임 찢었다...)에 서버쪽에서 response header 에 Access-Control 관련 설정을 해주셔야 한다고 당당히 얘기하자 (프론트에서 하는 방법은 있긴한데 일반적인 방법은 아니라 생각한다. 요건 뒤에서 설명한다! ) \*\*\*\*

```bash
Access-Control-Allow-Origin: https://foo.example
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
Access-Control-Max-Age: 86400
```

해당 속성에 대해서 하나하나 알아보자

**Access-Control-Allow-Origin**

보통 개발서버나 급하게 테스트를 할경우 \* 많이 입력해서 준다. 그러나 이게 실제 production 환경에 나가는건 추천하지않고 현재 서비스 하고 있는 웹사이트의 origin이나 리버스 프록시 같은 프록시 서버를 통할경우 해당 프록시 서버의 Origin을 입력하는게 바람직하다.

**Access-Control-Allow-Methods**

요것도 작업할때 * 넣어서 주신분을 많이 보았다. 그러나 난 여기서도 *를 입력하는 걸 추천하지 않는다. CORS 요청중에 원하지 않는 메소드도 허락이 될 수도 있고 무엇보다도 **"모든 브라우저에 대응" 하지 못한다.**

![https://tva1.sinaimg.cn/large/e6c9d24egy1go4h37c1ybj21260l4teh.jpg](https://tva1.sinaimg.cn/large/e6c9d24egy1go4h37c1ybj21260l4teh.jpg)

Chrome 만 서비스할거라고 하면 크게 상관은 없지만 보통 대부분의 서비스들은 다양한 웹브라우저 환경을 고려해야한다. 하지만 위와같이 생각보다 많은 브라우저 및 환경에서 _ 를 해당 헤더에 쓰는걸 허락하지 않는다. 나중에 이상한데서 삽질하기 싫으면 무조건 _ 말고 명시적으로 선언해주자.

**Access-Control-Allow-Headers**

이 키값에 대한 값으로 \* 를 썼을때는 두가지 문제가 있다. 첫번째로 위에 언급한 브라우저 호환성 이슈 문제가 있다.

![https://tva1.sinaimg.cn/large/e6c9d24egy1go4fbmyes3j211i0kwdls.jpg](https://tva1.sinaimg.cn/large/e6c9d24egy1go4fbmyes3j211i0kwdls.jpg)

두번째로 한가지 예외가 있다. 보통 로그인한 회원의 인증용도로 많이 쓰이는 Authorization Header는 \*(와일드카드) 항목에 포함되지 않는다. 그래서 해당 Authorization 헤더를 쓰고 싶으면 **반드시 명시적으로 선언해줘야한다.**

**Access-Control-Max-Age(초단위)**

우리는 Preflight 요청을 보내 이 서버에 어떤 Method를 보내도 되는지 어떤 Header가 가능한지 등 알게되었다. 그런데 매 요청마다 Preflight 요청을 보내 확인할 필요가 없을가? 답은 "굳이 그럴 필요가없다'" 해당 옵션은 한번 preflight 요청에 대한 응답값을 받으면 일정 기간이 지날때까지 다시 preflight 요청을 하지않게 하기위한 옵션이다. 예를들면 1시간동안 preflight 요청을 추가적으로 보내지 않을거면 3600을 입력하면 1시간동안 preflight 요청을 보내지 않게된다. 굳이 지정하지 않아도 브라우저 마다 default값으로 가지지않고 브라우저가 가지고 있는 값보다 지정한 Access-Control-Max-Age 값이 클경우 해당 값을 따르게 됩니다.

- **단계 3: 원래 보내려고 했던 cross origin request 요청을 보냄**

## 쿠키 정보를 전송하는 경우 ?

기본적으로 자바스크립트로 HTTP 요청을 만들어 Cross Origin request 을 보내는 경우 쿠키 정보를 보내지 않습니다. 실제로 쿠키의 값을 이용하는 서버로직이 있다던가 인증 처리를 하는 경우 해당 경우는 큰 문제가 된다. 이 방법을 해결해주기 위해서는 credentials flag를 설정해줘야하는데 방법은 아래와같다.

### 프론트엔드 설정

```jsx
const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

or;

fetch(url, { credentials: "include" });

or;

axios.defaults.withCredentials = true;
```

### 서버설정

response header 추가

```jsx
res.setHeader('Access-Control-Allow-Origin', 특정 Origin);
res.setHeader('Access-Control-Allow-Credentials', 'true');

Access-Control-Allow-Origin 에는 반드시 * 말고 특정한 Origin 을 적어줘야한다!
```

위와 같이 response header를 추가해도되고 대부분의 서버언어 프레임워크(spring, django, express) 들은 해당 설정을 간단히 설정하는 미들웨어 또는 모듈들이 있다. 예를들면 익스프레스에서는 [cors](https://expressjs.com/en/resources/middleware/cors.html) 모듈을 이용하면된다.

## 그 외 CORS 문제 해결

다시 한번 CORS 에러의 원인은 "**브라우저**" 에서 Origin 이 다른 곳에 요청을 보내는걸 막는데서 생긴다. 이 원인을 해결하기 위해서 위에선 현재 브라우저에 떠있는 Origin 이 인증된 요청에서 온 요청이란걸 서버에서 인증하기 위해서 response header 값을 설정하는것으로 해결하였다. 다른 해결방법은 또 없을가? 결론부터 말하자면 있다. CORS 에러는 브라우저가 체크한다는걸 다시 생각하면 프론트엔드와 같은 Origin 에 있는 proxy 서버를 프론트 요청을 보내고 그 해당 proxy 서버에서 요청을 보내게 하면된다. nginx나 aws ELB 같은 제품으로 proxy 서버를 따로 구축하거나 webpack 을 사용한다면 webpack-dev-server 에 proxy 기능을 이용하면된다. 방법은 아래 두사이트를 참고할걸 권장한다.

[CRA 를 사용하는경우](https://react.vlpt.us/redux-middleware/09-cors-and-proxy.html)

[Webpack 을 직접 설정하는 경우](https://react.vlpt.us/redux-middleware/09-cors-and-proxy.html)

**해당 방법을 사용하면 서버에서 CORS 셋팅을 위해 추가 작업을 안해도된다.**

단 ! webpack-dev-server를 사용하는경우엔 보통 개발환경에서만 돈다. production 환경의 프론트엔드와 백엔드의 origin 이 다르다면은 다른 proxy 서버나 서버에서 추가작업을 해줘야한다.

## 요약

CORS 의 정의와 필요한 이유 해결방법등을 쭉 설명해보았다. 해당건으로 문제를 겪었을때 해결방법은 다양하지만 **원인**만 제대로 잘 알고 있다면 각자의 프로젝트, 팀에 맞는 해결방법을 분명 찾을 수 있을것이다.

## 참고문헌 및 사이트

[https://developer.mozilla.org/ko/docs/Web/HTTP/CORS](https://developer.mozilla.org/ko/docs/Web/HTTP/CORS)

[https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials)

[https://ko.javascript.info/fetch-crossorigin](https://ko.javascript.info/fetch-crossorigin)

[https://ko.wikipedia.org/wiki/사이트*간*스크립팅](https://ko.wikipedia.org/wiki/%EC%82%AC%EC%9D%B4%ED%8A%B8_%EA%B0%84_%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8C%85)

[https://fetch.spec.whatwg.org/#cors-safelisted-request-header](https://fetch.spec.whatwg.org/#cors-safelisted-request-header)

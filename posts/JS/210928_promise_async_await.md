# 비동기, 프로미스, async/await

## 1. 싱글 스레드, 비동기, 콜백

기본적으로 자바스크립트 엔진은 싱글 스레드 환경이기 때문에, 작업을 동기적으로 처리합니다. 즉 작업을 하나씩 순서대로 처리하며, 현재 작업이 끝날 때까지 다른 작업을 수행할 수 없습니다. 이러한 특징을 블로킹(blocking)이라고 합니다.

문제는 자바스크립트 코드를 실행하는 메인 스레드가 렌더링에도 사용된다는 것입니다. 스레드가 현재 작업을 수행하느라 블로킹 상태인 동안에는, UI 업데이트나 이벤트 핸들링 등의 작업을 수행할 수 없다는 것입니다. 

예를 들어, 언제 결과 값을 받을 수 있을 지 모르는 네트워크 요청 작업을 동기적으로 수행한다면, 응답을 받을 때까지 스레드는 아무런 작업을 처리할 수 없을 것입니다. 이러한 문제는 작업을 비동기적으로 수행하여 해결합니다. 비동기 작업은 다른 작업과 병렬적으로 수행되며, 콜백 함수를 통해서 비동기 작업이 완료되었을 때의 동작을 지정할 수 있습니다. 완료된 비동기 작업의 콜백 함수는 태스크 큐에 대기하다가 이벤트 루프를 통해 실행될 수 있습니다.

콜백 함수를 통해 비동기 작업을 처리하면, 복잡한 비동기 로직을 작성하기 위해 많은 함수를 중첩해야 합니다. 중첩이 깊어질수록 가독성은 떨어지고 에러 핸들링이 어려워집니다.

이런 문제를 해결하기 위해 `Promise` 객체와 `async`, `await` 키워드가 도입되었습니다.

## 2. 프로미스 Promise

`Promise`는 비동기 작업을 쉽게 핸들링하기 위해 만들어진 객체입니다. 상태(`[[PromiseState]]`)와 결과값(`[[PromiseResult]]`) 프로퍼티를 가지며, 콜백을 연결할 수 있습니다.

### 2.1. 프로미스 상태 PromiseState

`Promise` 객체는 다음 중 하나의 상태를 가집니다. 이행과 거부 상태를 합쳐 처리되었다(settled)고 표현하기도 합니다. 객체가 처리(settled)되면, 이행 또는 거부에 해당하는 콜백을 마이크로태스크 큐에 올립니다.

- 대기(pending) : 이행되거나 거부되지 않은 초기 상태
- 이행(fulfilled) : 연산이 성공적으로 완료됨
- 거부(rejected) : 연산이 실패함

### 2.2. 프로미스 객체 생성

프로미스 객체는 다음과 같이 `Promise` 생성자에 실행 함수 `executor`를 전달해 생성할 수 있습니다.

``` js
const promise = new Promise(executor);
```

### 2.3. 실행 함수 executor

실행 함수는 `Promise` 생성자에 의해 매개변수로 `resolve`, `reject` 함수를 전달받으며 즉시 실행됩니다. 

``` js
console.log('main1');

new Promise((resolve, reject) => {
  console.log('promise executor');
  resolve('promise is fun');
});

console.log('main2');
```

실행 함수는 현재 실행 컨텍스트에서 동기적으로 실행합니다. 위와 같은 스크립트를 실행하면, 다음과 같은 순서로 로그가 찍히는 것을 볼 수 있습니다. 

``` bash
main1
promise executor
main2
```

 `resolve`는 결과값을 받아 해당 `Promise`객체를 이행 상태로 만들고, `reject`는 오류값을 받아 거부 상태로 만듭니다. `reject`되면, 콘솔에서 `Error` 객체를 `throw`한 것과 같이 표시됩니다.

``` js
const promise1 = new Promise((resolve) => resolve('promise is fun'));
console.dir(promise1)
/*
Promise {
  [[prototype]]: Promise
  [[PromiseState]]: "fulfilled"
  [[PromiseResult]]: "promise is fun"
}
*/

const promise2 = new Promise((resolve, reject) => reject('promise is hard'));
console.dir(promise2)
/*
Promise {
  [[prototype]]: Promise
  [[PromiseState]]: "rejected"
  [[PromiseResult]]: "promise is hard"
}
*/
```

실행 함수는 한 번의 `resolve` 또는 `reject`를 할 수 있습니다. 함수에서 `return`과 다르게 처리한 뒤에도 그 아래의 명령어는 실행하지만,  여러 번 실행된 `resolve`, `reject`는 무시됩니다.

``` js
const a = new Promise((resolve, reject) => {
  resolve('yes 1');
  reject('no');
  resolve('yes 2');
  console.log('promise executor');
})

a.then(v => console.log(v));

/* 출력 결과
promise executor
yes 1
*/ 
```



### 2.4. 콜백

배열을 다룰 때 `map`, `filter` 등의 메서드를 체이닝 하듯이,`Promise`객체도  `then`, `catch`, `finally` 등의 메소드를 이용해 콜백을 연결할 수 있습니다.

`then`은 해당 객체가 이행되었을 때, 그리고 `catch`는 해당 객체가 거부되었을 때 객체의 결과값을 매개변수로 받아 필요한 작업을 수행할 수 있습니다. 두 메서드 모두 `Promise` 객체를 반환하므로, 계속 이어서 메서드를 연결할 수 있습니다.

``` js
new Promise(resolve => resolve('yes'))
	.then(v => console.log('fulfilled:', v)); // 'fulfilled: yes'

new Promise((resolve, reject) => reject('no'))
	.catch(v => console.log('rejected', v)); // 'rejected: no'
```

`finally`는 이행과 거부 여부에 관계없이 실행됩니다. 처리 결과를 알 필요가 없기 때문에 매개변수로 아무 값도 전달받지 않습니다. 또 이전의 프로미스를 계속 반환하기 때문에, `finally` 이후에도 계속 체이닝을 이어나갈 수 있습니다.

``` js
new Promise(resolve => resolve(1))
  .then(v => v * 2)
  .then(v => v * 2) 
  .finally(() => console.log('finally')) // finally
  .then(v => console.log(v)) // 4
```

각 체이닝마다 `Promise` 객체는 새롭게 생성되어 반환됩니다.

``` js
const a = new Promise((resolve, reject) => reject(1));
const b = a.catch(v => v * 2);

console.log(a) // Promise { <rejected>: 1 }
console.log(a) // Promise { <fulfilled>: 2 }
```

또한  `catch`에 의해 반환된 `Promise`의 상태는 `fulfilled` 입니다. 따라서  `catch` 이후의 동작을 체이닝하기 위해서는 `catch`가 아니라 `then`을 사용해야 합니다.

``` js
new Promise((rs, rj) => rj('no'))
  .catch(() => console.log('catch1')) // 'catch1'
	.catch(() => console.log('catch2')); // 출력되지 않음

new Promise((rs, rj) => rj('no'))
	.catch(err => { console.log('catch'); return 'ok'; }) // 'catch'
	.then(v => console.log(v)); // 'ok'
```



### 2.5. onRejected vs. catch

`then` 메서드는 두 번째 매개변수로 다른 함수를 더 받을 수 있습니다.

``` js
promise.then(onFulfilled, onRejected);
```

`onRejected`함수를 통해 `catch`를 사용하지 않고도 즉시 에러 핸들링을 할 수 있습니다. 즉시 에러 핸들링이 된다는 것은, 프로미스 콜백의 마이크로태스크 큐에서의 순서에 영향을 준다는 의미입니다.

`then`과 `catch`는 `Promise` 객체의 상태가 맞지 않아 자신의 함수가 실행되지 않더라도 새로운 `Promise` 객체를 반환합니다. 

``` js
const a = Promise(resolve => resolve(1));
const b = a.catch(err => err);

console.log(a === b); // false
```

따라서 각 체인마다 작업이 마이크로태스크 큐에 추가되므로, `catch` 앞에 여러 개의 `then` 체인이 작성되어 있으면 그만큼 `catch`의 순서가 뒤로 밀리게 됩니다.

``` js
new Promise((resolve, reject) => reject('promise1'))
	.then(res => res)
	.catch(err => console.log('catch'));

new Promise(resolve => resolve('promise2'))
	.then(() => console.log('promise2-1'))
	.then(() => console.log('promise2-2'));

/*
출력 결과
'promise2-1'
'catch'
'promise2-2'
*/
```

따라서 특정 체인의 순서에서 바로 거부에 대한 작업을 수행하고 싶으면, `onRejected` 함수를 사용할 수 있습니다.

``` js
new Promise((resolve, reject) => reject('promise1'))
	.then(
  	res => res,
  	() => console.log('onRejected'))
	.catch(err => console.log('catch'));

new Promise(resolve => resolve('promise2'))
	.then(() => console.log('promise2-1'))
	.then(() => console.log('promise2-2'));

/*
출력 결과
'onRejected'
'promise2-1'
'promise2-2'
*/
```

 `onRejected` 함수를 통해 반환된 `Promise` 객체는 이행된 상태를 가지므로, 이후에 오는 `catch` 체이닝은 무시됩니다.

## 3. iterable을 다루는 Promise 메소드

아래의 메소드는 `Promise` 객체를 저장하고 있는 배열과 같은 iterable을 매개변수로 받고, 각 `Promise`들의 결과에 따라 지정된 방식으로 `Promise`를 반환합니다.

### 3.1. Promise.all()

iterable 내의 `Promise`들이 모두 이행되었을 때 이행하는 `Promise`를 반환합니다. iterable의 요소가 `Promise`가 아니어도 이행된 것으로 받아들입니다.

이행된 `Promise.all`의 `[[PromiseResult]]`는 각 `Promise`의 결과값의 배열입니다. 결과 배열의 순서는 인수 배열의 순서와 동일합니다.

``` js
const p1 = Promise.resolve('p1');
const p2 = 'p2';
const p3 = new Promise(resolve => setTimeout(resolve, 500, 'p3'));

Promise
  .all([p1, p2, p3])
	.then(values => console.log(values)); // ['p1', 'p2', 'p3'];
```

iterable의 `Promise` 가 하나라도 거부되면, 첫 번째로 거부된 `Promise`의 결과값을 사용해 자신도 거부합니다.

``` js
const p1 = Promise.reject('promise is hard');
const p2 = 'p2';
const p3 = new Promise(resolve => setTimeout(resolve, 500, 'p3'));

Promise
  .all([p1, p2, p3])
	.then(values => console.log(values))
	.catch(err => console.log(err)); // 'promise is hard'
```



### 3.2. Promise.allSettled()

ES2020에서 새롭게 소개된 메소드입니다.

iterable 내의 `Promise`가 모두 이행되거나 거부되었을 때 이행하는 `Promise` 객체를 반환합니다. 각 `Promise`의 결과에 상관없이 이행하므로, `Promise.allSettled`는 거부하지 않습니다.

이행된 `Promise.allSettled`의 `[[PromiseResult]]`는 각 `Promise`의 처리 상태와 결과값을 갖는 객체들의 배열입니다. 이행된 `Promise`는 `value` 프로퍼티를, 거부된 `Promise`는 `reason` 프로퍼티에 결과값을 저장합니다. 결과 배열의 순서는 인수 배열의 순서와 동일합니다.

``` js
const p1 = Promise.reject('promise is hard');
const p2 = 'p2';
const p3 = new Promise(resolve => setTimeout(resolve, 500, 'p3'));

const x = Promise.allSettled([p1, p2, p3])

x.then(res => console.log(res));
/*
[
	{ status: 'rejected', reason: 'promise is hard' },
	{ status: 'fulfilled', value: 'p2' },
  { status: 'fulfilled', value: 'p3' }
]
*/
```

### 3.3. Promise.race

`Promise.race` 메소드는 iterable 안에 있는 `Promise`  중 가장 먼저 settled 된 것의 결과대로 이행하거나 거부합니다.

``` js
const promise1 = new Promise(resolve => setTimeout(resolve, 500, 'yes'));
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'no'));

Promise
  .race([promise1, promise2])
	.then(res => console.log(res))
	.catch(err => console.log(err)) // 'no'
```



## 4. async/await

`async`와 `await` 키워드는 `Promise`를 좀 더 편하게 다룰 수 있도록 추가된 키워드입니다.

### 4.1. async

`async`는 함수 선언문이나 표현식 앞에 붙여 `Promise`를 반환하는 함수를 만들 수 있습니다.

``` js
async function asyncFunction() { return 1; }
console.log(asyncFunction()) // Promise { 1 }
```

명시적으로 `Promise`를 반환해도 마찬가지로 동작합니다.

``` js
const asyncFunction = async () => Promise.resolve('async is fun');
asyncFunction()
  .then(console.log); // 'async if fun'
```

`async` 함수는 내부에서  `await` 키워드를 사용해, 비동기 로직을 동기적으로 수행하도록 할 수 있습니다.

###  4.2. await

`Promise` 객체는 `[[PromiseState]]`, `[[PromiseResult]]` 라는 내부 프로퍼티(internal property)를 갖습니다. 내부 프로퍼티 `[[prototype]]`이 `__proto__`나 `Object.getPrototypeOf`등의 방법을 통해 접근할 수 있는 것과 다르게, 상태와 결과는 외부에서 직접 접근할 수 없습니다. 대신 `then` 등으로 연결한 콜백 함수에서만 `[[PromiseResult]]` 프로퍼티의 값을 전달받아 결과값에 접근할 수 있습니다. 

하지만 `await` 연산자를 사용하면 `Promise` 외부에서 결과값을 사용할 수 있습니다. `Promise` 객체를 생성하고 실행한 컨텍스트에서 그 결과를 사용할 수 있어, 콜백 패턴보다 간결하게 코드를 작성할 수 있습니다. 

`async` 함수 내부에서만 사용할 수 있는 연산자입니다. `Promise` 앞에 작성하여 해당 `Promise`가 settled 되었을 때의 값을 반환하도록 합니다.`await` 연산자는  `Promise`가 settled 될 때까지 해당 함수의 실행을 정지시킵니다. 

``` js
const asyncFunction = async () => {
  const a = await Promise.resolve('resolved');
  console.log(a); // 'resolved'
}
```

`await`이 기다리는 `Promise`가 바로 settled 되더라도, `await` 이후의 `asyncFunction`의 컨텍스트는 현재 실행 컨텍스트가 완료된 후에 실행됩니다.

``` js
const asyncFunction = async () => {
  console.log('init asyncFunction');
  const a = await Promise.resolve('resolved');
  console.log(a);
}

console.log('running context 1');
asyncFunction();
console.log('running context 2');

/*
출력 결과
'running context 1'
'init asyncFunction'
'running context 2'
'resolved'
*/
```

## 5. 정리

자바스크립트에서 비동기 처리란 직렬적으로 작업을 수행하는 싱글 스레드의 자바스크립트 런타임 환경에서, 작업을 병렬적으로 처리하게 하고 그 결과에 대한 작업을 적절한 순서로 수행하도록 코드를 작성하는 일이라고 이해할 수 있을 것 같습니다. 최근의 프론트엔드 개발에서는 ajax 기법을 통해 비동기적으로 작동하는 코드를 작성할 일이 많은 만큼, 비동기 처리 방법과 그 실행 순서에 대해 이해하는 것이 중요할 것 같습니다. 

## 6. 참고 자료

>- [모던 JavaScript 튜토리얼 - 프라미스](https://ko.javascript.info/promise-basics)
>- [MDN - Promise](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise)
>- [MDN - Promise.all()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
>- [MDN - Promise.allSettled()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
>- [MDN - Promise.race()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)
>- [모던 JavaScript 튜토리얼 - async와 await](https://ko.javascript.info/async-await)
>- [ecma262 - Await](https://tc39.es/ecma262/#await)




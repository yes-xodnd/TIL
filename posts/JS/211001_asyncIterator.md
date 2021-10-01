# 비동기 이터레이터와 제너레이터

이터레이터는 데이터에 순차적으로 접근하기 위한 인터페이스로, 비동기 데이터에 접근하기에는 적합하지 않습니다. 비동기 데이터란 프로미스로 감싸진 데이터이고, 여기에 순차적으로 접근한다는 것은 프로미스의 상태가 처리된(settled) 후에 값을 가져온다는 것을 의미합니다.

## 1. for await of

 `for await of` 구문을 통해 비동기 스트림 데이터를 열거할 수 있습니다. `for await of` 구문은 일반 이터러블 객체도 열거할 수 있습니다.

``` js
for await (const v of asyncIterable) { }
```



## 2. Symbol.asyncIterator

비동기 이터러블은 `[Symbol.asyncIterator]` 프로퍼티를 가져야 합니다. 

``` js
console.log(Symbol.asyncIterator in asyncIterable); // true
```

비동기 이터레이터는 동기 이터레이터와 마찬가지로 `next` 메서드를 인터페이스로 갖습니다. 다른 점은, `next`가 `Promise` 객체를 반환해야 한다는 점입니다.

``` js
asyncIterable.next(); // Promise { <pending> } 
```



## 3. async generator

비동기 제너레이터 함수를 이용하면 간단하게 비동기 이터레이터를 생성할 수 있습니다. 제너레이터 함수 선언문 앞에 `async` 키워드를 붙여 간단하게 비동기 제너레이터 함수를 만들 수 있습니다.

``` js
const asyncRequest = id => new Promise(resolve => setTimeout(resolve, 500, id));

const generator = (async function* (userIdList) {

  for (const userId of userIdList) {
    yield asyncRequest(userId);
  }

})([1, 2, 3, 4, 5]);
```

비동기 제너레이터 함수를 통해 생성된 제너레이터는 `Symbol.asyncIterator` 프로퍼티를 가지며, 이를 통해 접근할 수 있는 비동기 이터레이터는 제너레이터 객체 자신입니다.

``` js
console.log(Symbol.asyncIterator in generator); // true
console.log(generator[Symbol.asyncIterator]() === generator); // true
```

위의 제너레이터를 `for await of` 구문으로 순회하면, 비동기 이터레이터가 반환하는 프로미스가 대기상태(pending)일 때는 멈췄다가 처리되면(settled) 반복문의 본문을 수행합니다.



## 4. 참고 자료

>- [모던 JavaScript 튜토리얼 - 제너레이터와 비동기 이터레이션](https://ko.javascript.info/async-iterators-generators)
>- [MDN - for await ... of](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/for-await...of)
>- [MDN - Symbol.asyncIterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator)
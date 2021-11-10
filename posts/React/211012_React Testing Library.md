# 리액트 테스팅 라이브러리

## 1. Jest

Jest는 가장 널리 사용되는 자바스크립트 테스트 라이브러리 중 하나입니다. Jest는 Test Runner, Test Matcher, Test Mock 등을 통합 제공합니다. 

Facebook에서 자바스크립트 테스트를 위해 사용하고 있으며,  `create-react-app`으로 리액트 프로젝트를 생성하면 React Testing Library와 함께 기본으로 설치됩니다.

## 2. Testing Library

리액트 컴포넌트 테스트에는 Jest와 함께 React Testing Library(RTL)가 사용됩니다. RTL은 Testing Library의 리액트를 위한 버전입니다.

Testing Library는 UI 컴포넌트를 유저 중심 방식으로 테스트할 수 있게 도와주는 라이브러리입니다. 다음과 같은 가이드 원칙을 가지고 제작되었습니다.

>[The more your tests resemble the way your software is used, the more confidence they can give you.](https://twitter.com/kentcdodds/status/977018512689455106)
>
>테스트가 소프트웨어가 사용되는 방식과 더 닮을수록, 테스트가 더 큰 자신감을 줄 수 있다.

즉, Testing Libarary는 컴포넌트의 내부 구현(상태 및 로직)보다는 HTML 요소로 렌더링된 컴포넌트가 의도한대로 작동하는지에 중점을 둡니다. 

코어 라이브러리인 DOM Testing Library를 통해 DOM을 생성할 수 있고, 제공되는 query, fireEvent와 같은 API를 통해 렌더링된 HTML 요소를 선택하고 이벤트를 발생시킬 수 있습니다. RTL은 코어 라이브러리에 리액트 컴포넌트 렌더링과 일부 기능이 추가된 것입니다. 

Jest와 함께 사용하면 다음과 같이 컴포넌트를 테스트할 수 있습니다.

``` jsx
// Button.jsx
const Button = ({ onCLick, text }) => <button onClick={onClick} >{ text }</button>;
```

``` jsx
// Button.test.jsx
import { render, screen } from '@testing-library/react';

test('calls onClick prop when clicked', () => {
  // Jest의 Mock 함수
  const handleClick = jest.fn();
  // props로 전달하여 버튼을 렌더링
  const renderResult = render(<Button onClick={handleClick} text={'click me'} />);
	// 화면에 렌더링된 Button을 선택
  const button = screen.getByText(/click me/i);
  // Button에 click 이벤트 발생
	fireEvent.click(button);
  // handleClick 함수가 호출된 횟수가 1번인지 테스트
  expect(handleClick).toHaveBeenCalledTimes(1))
});
```



### 2.1. Queries

코어 API의 메서드로,  생성된 DOM에서 매칭되는 노드를 찾을 수 있습니다. 쿼리 메서드를 통해 노드를 선택한 뒤 이벤트를 발생시키는 등 테스트를 진행할 수 있습니다.

#### 2.1.1. Types of Queries

 `get`, `query`, `find`와 같은 타입이 있으며, 여러 개의 노드를 찾을 때에는 `getAll`, `queryAll`, `findAll`를 사용할 수 있습니다. 매칭 노드의 개수에 따른 결과, 재시도 여부 등에서 차이가 있으며 자세한 내용은 [여기](https://testing-library.com/docs/queries/about/#types-of-queries)에서 확인할 수 있습니다.

#### 2.1.2. By

쿼리 메서드는 `getByText`와 같이 쿼리 타입 + 쿼리 조건으로 이루어져 있습니다. 공식문서에서는 다음과 같이 분류하고 우선순위를 제안하고 있습니다.

1. Queries Accessible to Everyone
   - `ByRole`
   - `ByLabelText`
   - `ByPlaceHolderText`
   - `ByText`
   - `ByDisplayValue`
2. Semantic Queries
   - `ByAltText`
   - `ByTitle`
3. Test IDs
   - `ByTestId`

#### 2.1.3. TextMatch

대부분의 쿼리 메서드는 `TextMatch`를 인수로 받습니다. 문자열, 정규표현식, 불리언을 반환하는 함수 등이 `TextMatch`가 될 수 있습니다.

``` js
// 문자열
screen.getByText('Hello World');

// 정규표현식
screen.getByText(/hello world/i);

// 함수
screen.getByText((content, element) => content.startsWith('Hel'));
```

#### 2.1.4. Precision

쿼리 메서드의 마지막 인수로 옵션 객체를 전달할 수 있습니다. `exact: boolean` 프로퍼티를 통해 `TextMatch`와의 정확한 일치 여부를 지정할 수 있습니다. 기본값은 `true`입니다.

``` js
screen.getByText(/llo wor/i, { exact: false }); // substring
```

#### 2.1.5. DOM API

DOM API를 사용해 HTML 노드를 선택할 수도 있습니다. 하지만 이는 사용자의 행동과 다른 방식이기 때문에 권장되지 않습니다.

``` jsx
const renderResult = render(<App/>);
const button = document.querySelector('#my-button');
```

### 2.2. User Actions

사용자의 행동을 시뮬레이션하여 컴포넌트의 동작을 테스트할 수 있습니다.

#### 2.2.1. fireEvent

선택된 노드에 이벤트를 dispatch할 수 있습니다. 

``` typescript
fireEvent(node, event); // HTMLElement, Event 객체
```

예를 들어 마우스 클릭 이벤트는 다음과 같이 dispatch할 수 있습니다.

``` js
fireEvent(
	screen.getByText('click me'),
  new MouseEvent('click', {
    bubbles: true,
    cancelable: true
  })
);
```

#### 2.1.2. fireEvent[eventName]

편의성을 위한 메서드로, 다음과 같은 문법으로 사용할 수 있습니다.

``` js
fireEvent[eventName](node: HTMLElement, eventProperties: Object)
```

예를 들어, 위의 마우스 클릭 이벤트를 다음과 같이 작성할 수 있습니다.

``` js
fireEvent.click(screen.getByText('click me'));
```

다음과 같이 `eventProperty` 객체를 전달할 수도 있습니다.

``` js
const input = screen.getByPlaceholderText('키워드를 입력하세요');
fireEvent.change(input, { target: { value: 'a' } ));
```



## 3. React Testing Library

### 3.1. render

리액트 컴포넌트를 문서에 마운트하는 메서드로, RTL의 핵심적인 API 입니다. `RenderResult` 객체를 반환합니다.

``` jsx
import { render } from '@testing-library/react';
import Button from './Button';

const RenderResult = render(<Button />);
```



## 3. Examples

### 3.1. 컴포넌트 렌더링

컴포넌트가 렌더링되었는지 확인하기 위해 `toBeInTheExpect` matcher를 사용할 수 있습니다.

``` jsx
// Button.jsx

const Button = props => {
 	return <button>{ props.text }</button>;
};
```

``` jsx
// Button.test.jsx
import { render } from '@testing-library/react';
import Button from './Button';

test('render text', () => {
  const text = 'start test';
  const { getByText } = render(<Button text={text} />);
  expect(getByText(text)).toBeInTheDocument();
});
```





## 참고자료

>- [Testing Library 공식 문서](https://testing-library.com/docs/)
# React children props in TypeScript

## props.children

리액트 컴포넌트는 JSX에서 self-closing tag로 표현할 수 있습니다.

``` jsx
const Todo = () => {
  return (
  	// ...
  );
}

const App = () => {
  return (<Todo />);
};
```

여는 태그와 닫는 태그로 컴포넌트를 표현할 수도 있는데, 그 사이에 내용을 작성하면 컴포넌트에 `props.children`으로 전달됩니다.

``` jsx
const App = () => {
  return (<Greeting>Hello, world!</Greeting>);
}

const Greeting = (props) => <p>{ props.children }</p>; // Hello, world!
```



## in TypeScript

자바스크립트 코드에서는 그냥 `props.children`으로 접근하고 사용할 수 있지만, 타입스크립트에서는 `props`의 인터페이스에 `children`이 명시되어있지 않으면 사용할 수 없습니다.

``` tsx
interface Props {
  // ...
}

const Greeting = (props: Props) => <p>{ props.children }</p>;
// Error!
// 'Props' 형식에 'children' 속성이 없습니다.
```

### children 프로퍼티 추가하기

먼저 `Props` 인터페이스에 `children` 프로퍼티를 직접 추가하는 방법입니다. 어떤 타입을 내용으로 작성할지 확실하다면 좋은 방법이 될 수 있습니다.

``` tsx
interface Props {
  // ...
  children: string; // 문자열만 허용
  children: JSX.Element; // 하나의 JSX Element만 허용
  children: JSX.Element | JSX.Element[]; // 하나 이상의 JSX Element 허용
  children: any; // ...
}
```

무엇을 작성할지 알 수 없고 상관없어야 한다면, `any`를 사용하게 될 수도 있습니다. 하지만 컴포넌트가 `children`으로 받을 수 있는 타입이 있는데 `any`를 사용하는 것은 부정확하고 게으른 방법이 되겠습니다.

### React.FC

`React.FC` 타입을 이용하면 `children` 프로퍼티를 보다 적절하게 사용할 수 있습니다. 함수 컴포넌트를 나타내는 타입으로, 아래와 같이 함수 표현식으로 작성한 컴포넌트에서 사용할 수 있습니다.

``` tsx
interface Props {
	// ...
}

const Greeting: React.FC<Props> = (props) => {
  // ...
};

const Greeting: React.FC<Props> = function(props) {
  // ...
}
```

`React.FC` 는 `props`에 해당하는 타입변수 `P`를 요구하는 제네릭 함수 타입입니다.

``` ts
type FC<P = {}> = FunctionComponent<P>;

interface FunctionComponent<P = {}> {
  (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;
  propTypes?: WeakValidationMap<P> | undefined;
  contextTypes?: ValidationMap<any> | undefined;
  defaultProps?: Partial<P> | undefined;
  displayName?: string | undefined;
}

type PropsWithChildren<P> = P & { children?: ReactNode | undefined };
```

 전달된 `P`는 바로 함수 시그니처의 `props` 타입에 사용되는 것이 아니라 제네릭 타입 `PropsWIthChildren`의 타입 변수로 전달되어 사용됩니다. 한번에 합쳐서 표현하면 아래와 같은 모양이 됩니다.

``` ts
type FC<P = {}> = (props: P & { children?: ReactNode | undefined }) => ReactElement<any, any> | null;
```

그러니까 React.FC는 `Props` 인터페이스에 아래와 같은 프로퍼티를 추가하는 것과 같은 역할을 하는 제네릭 타입이라고 볼 수 있을 것 같습니다.

``` tsx
interface Props {
  // ...
  children?: ReactNode | undefined;
}

const Greeting = (props: Props) => <p>{ props.children }</p>;
```

함수 선언문에서는 사용할 수 없고, 항상 `children` 프로퍼티가 선택적이지만 포함되는 등 여러가지 이유로 `React.FC`는 권장되지 않고 있습니다. 자세한 이유는 create-react-app에서 `React.FC` 코드를 제거한 [PR](https://github.com/facebook/create-react-app/pull/8177)에서 확인할 수 있습니다.

### React.PropsWithChildren

`React.FC`에서 사용한 `PropsWithChildren` 타입을 이용하는 방법도 있습니다. [react-typescript-cheetsheet](https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase/#generic-components-with-children)에서소개하고 있는 방법입니다. 함수 자체가 아니라 파라미터인 `Props`의 타입을 정의하기 때문에 보다 유연하게 사용할 수 있습니다.

``` tsx
// react/index.d.ts
type PropsWithChildren<P> = P & { children?: ReactNode | undefined };

// Greeting.tsx
function Greeting(props: React.PropsWithChildren<Props>) {
	return (<p>{ props.children }</p>);
}
```

하지만 `children` 프로퍼티가 선택적 프로퍼티로 추가되기 때문에, 반드시 필요한 경우에는 부적절합니다.



### children 프로퍼티 추가하기 + React.ReactNode

`Props` 인터페이스에 `React.ReactNode` 타입의 `children` 프로퍼티를 추가하는 방법입니다. `children`이 필요한 경우와 그렇지 않은 경우를 명확하게 명시적으로 표현할 수 있습니다.

``` tsx
interface Props {
  // ...
  children: React.ReactNode;
}
```

## 정리

여러 상황에 맞게 사용하려면 인터페이스에 `children` 프로퍼티를 명시하는  `React.ReactNode`를 사용하는 방법이 가장 적절해 보입니다. 하지만 매번 프로퍼티를 작성하는 게 부담스럽다면 `React.PropsWithChildren`을 사용하는 것이 좋을 것 같습니다.


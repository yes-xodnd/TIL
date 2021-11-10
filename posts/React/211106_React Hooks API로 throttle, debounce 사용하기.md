# 리액트 Hooks API: useRef로 throttle, debounce 사용하기



## 문제 상황

컴포넌트가 리렌더링되면, 컴포넌트 내부의 함수도 다시 선언됩니다. 따라서, 클로저와 `setTimeout`을 이용하는 `throttle`과 `debounce` 같은 유틸 함수로 함수를 선언하면, 렌더링 될때마다 새로운 클로저가 생성되어 의도대로 작동하지 않습니다.

``` jsx
// BAD
const Input = () => {
	const [ value, setValue ] = useState('')
	const search = debounce(keyword => api.search(keyword), 500);
  // 리렌더링과 함께 매번 다시 선언되므로, 500ms 내에 입력해도 디바운스 되지 않고 매 입력마다 실행됨
  
  const handleChange = e => { 
    const { value } = e.target
    setValue(value)
		searchValue(value)
  }
  
	return <input type="text" value={value} onChange={handleChange}/>
}
```

## useCallback

`useCallback`을 사용해서 함수 선언을 저장할 수 있지만 `useCallback`은 의존성 배열에 따라 새로 함수를 선언하기 위한 API이므로 용도에 맞지 않습니다. 의존성 체크를 위해 인라인 함수를 작성하라는 오류 메시지를 출력합니다.

``` js
// BAD
const search = useCallback(debounce(keyword => api.search(keyword), 500), []);

// React Hook useCallback received a function whose dependencies are unknown. Pass an inline function instead  react-hooks/exhaustive-deps
```

## useRef

이럴 때, `useRef`를 사용하면 함수를 새로 선언하지 않고, 처음 선언된 함수에 대한 참조를 유지할 수 있습니다.

``` jsx
//GOOD
const searchRef = useRef(debounce(keyword => api.search(keyword), 500));
// 리렌더링 되어도 같은 함수(debounce의 반환 함수)에 대한 참조를 유지합니다.

const handleChange = (e) => {
  const { value } = e.target;
  setValue(value);
  searchRef.current(value);
}
```


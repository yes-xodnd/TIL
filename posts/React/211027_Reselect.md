# Reselect

[Reselect](https://github.com/reduxjs/reselect)는 memoize된 selector 함수를 만들기 위한 라이브러리입니다. 

## 1. selector

Redux 스토어의 state에서 데이터를 선택하고 계산된 값을 만드는 순수 함수를 selector라고 합니다. selector는 `useSelector`의 인자로 전달되어 실행됩니다.

``` js
const getIncompleteTodos = state => state.todos.filter(item => !item.completed) // selector
const incompleteTodos = useSelector(getIncompleteTodos)
```

`useSelector`에서 사용할 때마다 selector의 연산은 반복해서 수행됩니다. Reselect는 selector 연산 결과를 캐시하여, 인수가 변할 때만 다시 계산하므로 효율성을 높일 수 있습니다.

## 2. createSelector

Reselect의 `createSelector`를 통해 memoized selector를 만들 수 있습니다. `createSelector`는 여러 개의 input selector와, 하나의 result function을 통해 값을 계산합니다.

### 2.1. 예시

위의 코드를 `createSelector`를 이용해 다음과 같이 다시 작성할 수 있습니다.

``` js
import { createSelector } from 'reselect'

const selectTodos = state => state.todos
const selectIncompleteTodos = createSelector(
	selectTodos, // input selector
  (todos) => todos.filter(item => !item.done) // resultFunc
)
```

### 2.2. input selector 여러 개 사용하기

input selector의 반환값은 마지막 result function의 인자로 전달됩니다. 여러 input selector를 사용할 때는 각각 인수로 전달하거나, 배열로 전달할 수 있습니다.

``` js
const selectA = state => state.a
const selectB = state => state.b

const selectSum1 = createSelector(
	selectA,
  selectB,
  (a, b) => a + b
)

const selectSum2 = createSelector(
	[ selectA, selectB ],
  (a, b) => a + b
)
```

### 2.3. selector 조합하기

`createSelector`로 생성한 selector를 input selector로 사용하여 조합할 수 있습니다.

``` js
const selectA = state => state.a
const selectB = state => state.b

const selectSum = createSelector(
	[ selectA, selectB ],
  (a, b) => a + b
)

const combinedSelector = createSelector(
	selectSum,
  (sum) => sum * 2
)
```

### 2.4. 동적으로 parameter 전달하기

selector에 동적으로 인자를 전달해 값을 계산할 수도 있습니다.

``` js
const selectDynamically = createSelector(
	(state) => state.todos,
  (state, id) => id,
  (todos, id) => expensiveCalc(todos, id)
)

// SomeComponent.js
const { id } = props
const result = useSelector(state => selectDynamically(state, id))
```

## 3. 정리

간단한 사용법으로 Redux를 최적화할 수 있는 라이브러리로, Redux Toolkit에 기본으로 포함되어 있을만큼 쓸모있는 라이브러리라는 생각이 듭니다. 복잡한 연산이 필요한 selector를 사용할 때 도입하면 좋을 것 같습니다.


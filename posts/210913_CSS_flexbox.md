# CSS flexbox

HTML 요소의 레이아웃을 위해 자주 사용하는 CSS의 flexbox의 기본 개념에 대해 정리해보았습니다.

## 1. flexbox란?

MDN에서는 flexbox의 개념을 다음과 같이 소개하고 있습니다. 

>[MDN  - flexbox의 기본 개념](https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox)
>
>- 일명 flexbox라 불리는 Flexible Box module은 flexbox 인터페이스 내의 아이템 간 공간 배분과 강력한 정렬 기능을 제공하기 위한 1차원 레이아웃 모델 로 설계되었습니다.
>- flexbox를 1차원이라 칭하는 것은, 레이아웃을 다룰 때 한 번에 하나의 차원(행이나 열)만을 다룬다는 뜻입니다. 이는 행과 열을 함께 조절하는 CSS 그리드 레이아웃의 2차원 모델과는 대조됩니다.

'공간 배분과 정렬 기능을 제공 1차원 레이아웃 모델' 이라고 요약할 수 있을 것 같습니다.

## 2. flexbox의 필요성

CSS는 스타일링과 레이아웃을 위한 여러 기능을 제공하고 있지만, 다음과 같이 간단해보이는 레이아웃을 구현하는 데 어려움이 있었습니다. 

- 자식 요소를 세로로 가운데 정렬하기
- 사용 가능한 너비와 높이에 관계없이 하나의 컨테이너에 포함된 모든 자식 요소가 주어진 높이와 너비를 같은 크기로 점유하기
- 다단 레이아웃에 포함된 모든 단이 서로 다른 크기의 콘텐츠를 포함하고 있더라도 동일한 높이로 채택하기

이런 레이아웃을 간단히 구현하도록 도와주는 것이 CSS3에 추가된 flexbox 입니다.



## 3. flexbox 개념들

### 3.1. 축 axis

위의 개념에서 언급했듯이, flexbox는 1차원 레이아웃 모델이므로, 수평 축 또는 수직 축을 주축(main-axis)으로 하여 flex 아이템들을 정렬하게 됩니다. 주축이 아닌 축은 교차축(cross axis)이 됩니다.



### 3.2. flex 컨테이너 & flex 아이템

flexbox는 하나의 flex 컨테이너와 하나 이상의 flex 아이템으로 구성됩니다. 

``` html
<div class="flex-container">
  <div class="flex-item"></div>
  <div class="flex-item"></div>
  <div class="flex-item"></div>
</div>
```

 `display: flex` 프로퍼티를 선언하면, 요소를 flex 컨테이너로 만들 수 있습니다. 바로 아래에 있는 자식 요소들은 flex 아이템이 됩니다.

``` css
.flex-container {
  display: flex;
}
```

flex 컨테이너에 지정할 수 있는 속성은 다음과 같습니다.

- `justify-content` : 주 축에서의 flex 아이템 정렬을 지정합니다.
- `align-items`: 교차 축에서의 flex 아이템 정렬을 지정합니다.
- `align-content`: 교차 축의 flex line 정렬을 지정합니다.
- `flex-direction` : 주 축과 교차 축의 방향을 지정합니다.
- `flex-wrap` : 주 축에서의 줄바꿈을 지정합니다.
- `flex-flow`: `flex-direction`과  `flex-wrap`의 단축 속성입니다.

flex 아이템에 지정할 수 있는 속성은 다음과 같습니다.

- `flex-grow`: 주 축에서의 너비 증가 비율을 지정합니다.
- `flex-shrink`: 주 축에서의 너비 감소 비율을 지정합니다.
- `flex-basis` : flex 아이템의 기본 너비를 설정합니다.
- `flex`: `flex-grow`, `flex-shrink`, `flex-basis`의 단축 속성입니다.
- `order` : 순서를 설정합니다. 
- `align-self`: 교차 축에서의 정렬 방법을 설정합니다.

## 참고 자료

>- [MDN - flexbox의 기본 개념](https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox)
>- [Naver D2 - flexbox로 만들 수 있는 10가지 레이아웃](https://d2.naver.com/helloworld/8540176)
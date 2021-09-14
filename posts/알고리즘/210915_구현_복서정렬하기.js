/*
 [문제 설명]
 프로그래머스 위클리 챌린지 6주차 문제입니다.
 링크 : https://programmers.co.kr/learn/courses/30/lessons/85002
 
 복서들의 몸무게와 상대전적이 주어졌을 때,
 조건에 따라 복서 번호를 정렬해 반환합니다.
 
 [풀이]
 구현 문제입니다.

 - 자바스크립트 배열 메소드 Array.sort를 사용하였습니다.
 
 - Array.sort의 compareFunction에서
   삼항연산자 대신 논리연산자 OR을 사용하여
   코드를 더 간단히 작성하였습니다.
 
 - 승률을 계산할 때, 논리곱 단축평가(&&)를 사용하여 코드를 간단히 작성하였습니다.
 
 - 간단한 객체이므로, 팩토리 패턴으로 Boxer 객체를 생성해 사용하였습니다.
 */

function solution(weights, head2head) {
  return sortData(getData()).map(({ id }) => id);

  function sortData(data) {
    return data.sort((a, b) =>
      b.winRate  - a.winRate
   || b.winHeavy - a.winHeavy
   || b.weight   - a.weight
   || a.id - b.id
    );
  }

  function getData() {
    const data = weights.map(createBoxer);

    for (let i = 0; i < weights.length; i++) {
      for (let j = i + 1; j < weights.length; j++) {
        if (head2head[i][j] === "N") continue;

        const [winner, loser] = (head2head[i][j] === "W")
        ? [ data[i], data[j] ]
        : [ data[j], data[i] ];

        winner.win += 1;
        loser.lose += 1;

        if (winner.weight < loser.weight) winner.winHeavy += 1;
      }
    }

    for (const boxer of data) {
      const count = boxer.win + boxer.lose;
      boxer.winRate = count && boxer.win / count;
    }

    return data;
  }

  function createBoxer(weight, i) {
    return {
      id: i + 1,
      weight,
      win: 0,
      lose: 0,
      winHeavy: 0,
      winRate: 0,
    };
  }
}

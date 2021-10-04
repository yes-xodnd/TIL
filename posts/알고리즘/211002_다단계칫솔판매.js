/* 
[문제 설명]
링크 : https://programmers.co.kr/learn/courses/30/lessons/77486

매 소득의 10퍼센트를 추천인에게 분배하는 트리 구조의 조직이 있습니다.
판매자와 판매량 정보가 주어졌을 때, 각 조직원이 얻은 총 수익을 배열로 반환합니다.


[풀이]
조직원 노드마다 추천인 노드의 참조를 저장하여
트리를 탐색해 올라갈 수 있도록 구현하였습니다.
*/

function solution(enroll, referral, seller, amount) {
  const register = {};

  for (const name of enroll) {
    register[name] = { ref: null, profit: 0 };
  }

  for (let i = 0; i < referral.length; i++) {
    if (referral[i] === "-") continue;
    register[enroll[i]].ref = register[referral[i]];
  }

  for (let i = 0; i < seller.length; i++) {
    divide(register[seller[i]], amount[i] * 100);
  }

  return enroll.map(name => register[name].profit);

  function divide(node, total) {
    const dividend = parseInt(total / 10);
    
    if (dividend) {
      node.profit += total - dividend;
      if (node.ref) divide(node.ref, dividend);

    } else {
      node.profit += total;
    }
  }
}

const answer = solution(
  ["john", "mary", "edward", "sam", "emily", "jaimie", "tod", "young"],
  ["-", "-", "mary", "edward", "mary", "mary", "jaimie", "edward"],
  ["young", "john", "tod", "emily", "mary"],
  [12, 4, 2, 5, 10]
);

console.log(answer);

/* 
[문제 설명]
링크 : https://programmers.co.kr/learn/courses/30/lessons/77486

매 소득의 10퍼센트를 추천인에게 분배하는 트리 구조의 조직이 있습니다.
판매자와 판매량 정보가 주어졌을 때, 각 조직원이 얻은 총 수익을 배열로 반환합니다.


[풀이]
소득, 추천인 Node 정보를 저장하고 수익분배 메소드를 갖는
Node 클래스를 정의하여 사용하였습니다.

Node에 대한 참조는 이름으로 접근할 수 있도록 객체를 Hashmap으로 사용하였습니다.
*/

class Node {
  constructor() {
    this.ref = null;
    this.profit = 0;
  }

  addRef(refNode) {
    this.ref = refNode;
  }

  sell(total) {
    const dividend = parseInt(total / 10);

    if (dividend === 0) {
      this.profit += total;
    } else {
      this.profit += total - dividend;
      if (this.ref) this.ref.sell(dividend);
    }
  }
}

function solution(enroll, referral, seller, amount) {
  const register = {};

  for (const name of enroll) {
    register[name] = new Node();
  }

  for (let i = 0; i < referral.length; i++) {
    if (referral[i] === "-") continue;

    const node = register[enroll[i]];
    const refNode = register[referral[i]];

    node.addRef(refNode);
  }


  for (let i = 0; i < seller.length; i++) {
    register[seller[i]].sell(amount[i] * 100);
  }

  return enroll.map(name => register[name].profit);
}

const answer = solution(
  ["john", "mary", "edward", "sam", "emily", "jaimie", "tod", "young"],
  ["-", "-", "mary", "edward", "mary", "mary", "jaimie", "edward"],
  ["young", "john", "tod", "emily", "mary"],
  [12, 4, 2, 5, 10]
);

console.log(answer);

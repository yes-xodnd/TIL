/* 
[문제 설명]
프로그래머스 위클리 챌린지 8주차 문제입니다. 
링크 : https://programmers.co.kr/learn/courses/30/lessons/86491

여러 개의 명함의 가로, 세로 길이를 담은 배열이 주어졌을 때,
모든 명함을 넣을 수 있는 최소 크기의 명함지갑 크기를 알아내는 문제입니다.

가로보다 세로가 길 수도 있으며, 회전해서 넣을 수도 있습니다.

[풀이]
각 명함의 두 길이 중에 긴 것끼리, 짧은 것끼리 비교하여
가장 큰 값을 찾습니다.

solution1은 반복문을 이용해 하나씩 비교하는 방식이고,
solution2는 배열 메소드 reduceh를 이용하는 방식입니다.

제공된 테스트 케이스에서 가장 오래 걸리는 케이스는
solution1에서 3.84ms, solution2에서 6.34ms로
reduce를 사용하면 코드가 간결한 대신 속도가 느린 것을 알 수 있습니다.

*/


function solution1(sizes) {
  let maxA = 0;
  let maxB = 0;

  for (let i = 0; i < sizes.length; i++) {
    const [w, h] = sizes[i];
    const a = Math.max(w, h);
    const b = Math.min(w, h);

    if (a > maxA) maxA = a;
    if (b > maxB) maxB = b;
  }

  return maxA * maxB;
}

function solution2(sizes) {
  return sizes
    .reduce(([ma, mb], [a, b]) => [ 
      Math.max(ma, Math.max(a, b)), 
      Math.max(mb, Math.min(a, b))
    ], [0, 0])
    .reduce((a, b) => a * b);
} 
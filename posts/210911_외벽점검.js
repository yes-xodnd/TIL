/*
 * [문제 설명]
 * 원형 벽의 길이와 취약지점 배열, 각 친구가 움직일 수 있는 거리가 주어졌을 때,
 * 취약 지점을 수리할 수 있는 최소 인원의 수를 반환합니다.
 * 
 * 전부 수리하는 것이 불가능하다면 -1을 반환합니다.
 * 
 * [풀이]
 * 순열을 활용한 완전 탐색입니다.
 * 순열의 길이를 1개부터 생성하고 수리가능여부를 확인합니다. 
 * 가능하면 길이를 반환, 불가능하면 길이 += 1
 * 
 * [관련 링크]
 * 문제 : https://programmers.co.kr/learn/courses/30/lessons/60062
 * 풀이 : https://tech.kakao.com/2019/10/02/kakao-blind-recruitment-2020-round1/
 */
 
/**
 * @param {number} n 벽의 길이
 * @param {number[]} weak 취약지점 배열
 * @param {number[]} dist 각 친구가 움직일 수 있는 거리
 * @returns {number} 최소 투입 인원 수, 불가능할 경우 -1
 */
function solution(n, weak, dist) {
  const weakSpreads = getWeakSpreads();
  
  for (let count = 1; count < dist.length + 1; count++) {
      
    for (const order of getPermutations(dist, count)) {
      if (canRepair(order)) return count;
    }
  }
  return -1;
  

  function canRepair(order) {
    for (const w of weakSpreads) {
      let i = 0;
      
      for (let d of order) {
        i = upperBound(w, w[i] + d, i);
        if (i === w.length) return true;
      }
    }
    return false;
  }
  
  function getWeakSpreads() {
    let result = [];
    
    for (let i = 0; i < weak.length; i++) {
      result.push([ 
        ...weak.slice(i), 
        ...weak.slice(0, i).map(v => v + n)
      ]);
    }
    
    return result;
  }
}

// 탐색 대상 배열이 1 이상 15 이하의 작은 크기이므로 선형탐색으로 구현
function upperBound(arr, target, start) {
  for (let i = start; i < arr.length; i++) {
    if (arr[i] > target) return i;
  }
  return arr.length;
}

function getPermutations(arr, length) {
  let result = [];
  
  // 중복된 요소가 있을 수 있으므로 index를 이용해 순열을 구함
  (function go(indexes = []) {
      
    if (indexes.length === length) {
      result.push(indexes.map(v => arr[v]));
      return;
    }
    
    for (let i = 0; i < arr.length; i++) {
      if (indexes.includes(i)) continue;
      go([ ...indexes, i ]);
    }
  })();
  
  return result;
}
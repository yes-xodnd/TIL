/*

[문제 설명]
프로그래머스 위클리 챌린지 7주차 문제입니다.
링크 : https://programmers.co.kr/learn/courses/30/lessons/86048

입장 순서와 퇴장 순서가 저장된 배열이 주어졌을 때,
각 사람마다 반드시 만난 사람의 수를 계산해 반환합니다.

[풀이]
구현 문제입니다. 
반드시 만날 수 있는 조건을 계산하는 것이 까다로웠지만,
구현 자체는 크게 어려운 점이 없었습니다.

한 명씩 퇴장시키면서, 퇴장할 때 방에 남아있던 사람을 계산해
숫자를 세어주면 반드시 만나는 사람을 계산할 수 있습니다.

enter를 매번 순회하며 index를 찾지 않도록
미리 계산하고 메모하여 사용하였습니다.


[슈도코드]

let result = [0] * enter.length
let room = []
let enter_start_index = 0

for p1 of leave:
    if not_entered_Room(p1):
        room += enter[enter_start_index:enter.indexOf(p1)]
        enter_start_index = enter.indexOf(p1) + 1
    else:
        room.remove(p1)
    
    for p2 of room:
        result[p1] += 1
        result[p2] += 1

return result
*/

function solution(enter, leave) {
  const enterIndex = getIndex(enter);

  let result = Array.from(enter, () => 0);
  let room = [];
  let j = 0;

  for (let p1 of leave) {
    const E = enterIndex[p1];
    
    // if p1 in room
    if (E >= j) {
      room = [ ...room, ...enter.slice(j, E) ];
      j = E + 1;

    } else {
      room.splice(room.indexOf(p1), 1);
    }

    for (let p2 of room) {
      result[p1 - 1] += 1;
      result[p2 - 1] += 1;
    }
  }
  return result;

  function getIndex(arr) {
    let result = Array(arr.length + 1).fill(0);
    
    for (let i = 0; i < arr.length; i++) {
      result[arr[i]] = i;
    }
    return result;
  }
}
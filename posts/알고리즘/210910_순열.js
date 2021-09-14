/**
 * 배열에서 원하는 길이의 순열 목록을 반홥합니다.
 * 
 * @param {*[]} arr 배열
 * @param {number} length 순열 길이
 * @returns {*[]} 순열 목록
 */
 function permutations(arr, length) {
  let result = [];

  (function go(data = []) {
    if (data.length === length) {
      result.push(data);
      return;
    }

    for (let i = 0; i < arr.length; i++) {
      if (data.includes(arr[i])) continue;
      go([ ...data, arr[i] ]);
    }
  })();

  return result;
}
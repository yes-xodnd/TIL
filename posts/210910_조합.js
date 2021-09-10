
/**
 * 배열에서 원하는 길이의 조합 목록을 반환합니다.
 * 
 * @param {*[]} arr 배열
 * @param {number} length 조합 길이
 * @returns {*[]} 조합 목록
 */
function combinations(arr, length) {
  let result = [];

  (function go(lastIndex = -1, data = []) {
    if (data.length === length) {
      result.push(data);
      return;
    }

    for (let i = lastIndex + 1; i < arr.length; i++) {
      go(i, [ ...data, arr[i] ]);
    }
  })();

  return result;
}
/**
 * 오름차순 정렬된 배열에서 target보다 큰 요소가 처음 나오는 인덱스를 반환합니다.
 * 
 * @param {number[]} arr 오름차순 정렬된 배열
 * @param {number} target 기준 값
 * @returns {number} 조건에 부합하는 요소의 인덱스. 없을 경우 -1
 */
function upperBound(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  
  if (target < arr[low]) return 0;
  if (target >= arr[high]) return -1;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);

    // target을 초과해야하므로, 
    // if arr[mid] === target then low = mid + 1
    if (target >= arr[mid]) {
      low = mid + 1;
    
    // arr[mid - 1] === target일 수 있으므로 -1 없음
    } else {
      high = mid;
    }
  }
  return high;
}

console.log(upperBound([1, 2, 3, 3, 3, 3, 4, 5, 6, 7], 3))
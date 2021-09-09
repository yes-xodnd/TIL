/**
 * 오름차순 정렬된 배열에서 target과 같거나 큰 요소가 처음으로 나타나는 인덱스를 반환합니다.
 * 배열에 중복된 요소가 있을 때 활용할 수 있습니다.
 * 
 * @param {number[]} arr 오름차순 정렬된 배열
 * @param {number} target 찾고자 하는 값
 * @returns {number} 조건에 부합하는 요소의 인덱스. 없을 경우 -1 반환
 */
function lowerBound(arr, target) {
  let low = 0;
  let high = arr.length - 1;
 
  // 배열에서 가장 작은 값이 target과 같거나 클 경우
  if (target <= arr[low]) return 0;

  // 배열에서 가장 큰 값이 target보다 작을 경우
  if (target > arr[high]) return -1;

  // if (low === high) then answer = high 이므로 break
  // 종료 조건문이 (low <= high) 일 경우 high = mid 때문에 무한반복
  while (low < high) {
    const mid = Math.floor((low + high) / 2);

    if (target <= arr[mid]) {
      // 같거나 큰 값이므로 -1을 하지 않음
      high = mid;

    } else {
      low = mid + 1;
    }
  }
  return high;
}
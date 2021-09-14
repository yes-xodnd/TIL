(function main() {
  test(1000, 10, false);
})();


/**
 * 오름차순 정렬된 배열에서 원하는 값의 인덱스를 반환합니다.
 * 배열에 값이 존재하지 않을 경우 -1을 반환합니다.
 * 자료의 개수 N에 대해 O(logN)의 시간복잡도를 갖습니다.
 *  
 * @param {number[]} arr 오름차순 정렬된 배열
 * @param {number} target 찾고자 하는 값
 * 
 * @returns {number} target의 인덱스, 없을 경우 -1
 */
function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const item = arr[mid];

    if (target === item) {
      return mid;
    }

    if (target < item) {
      high = mid - 1;

    } else {
      low = mid + 1;
    }
  }

  return -1;
}


function binarySearchForTest(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  let searchCount = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const item = arr[mid];

    if (item === target) {
      return { index: mid, searchCount };
    }

    searchCount += 1;

    if (target < item) {
      high = mid - 1;

    } else {
      low = mid + 1;
    }
  }
  
  return { index: -1, searchCount };
}


/**
 * binarySearch 함수를 테스트합니다.
 * 
 * @param {number} count 시행횟수
 * @param {number} arrLength 배열의 길이
 * @param {boolean} logCaseResult 각 케이스 결과 출력 여부
 */
function test(count = 10, arrLength = 10, logCaseResult = true) {
  console.log('#### init test ####');
  let searchCountTotal = 0;

  for (let i = 0; i < count; i++) {
    const arr = createRandIntArray(arrLength);
    const target = getRandomItem(arr);
    const { index, searchCount } =  binarySearchForTest(arr, target);
    searchCountTotal += searchCount;

    const result = arr.findIndex(item => item === target) === index;
    
    if (logCaseResult) {
      console.log(`
      # case${i + 1}
        array  : ${arr}
        target : ${target}
        index  : ${index}
        count  : ${searchCount}

        result: ${result}
      `);
    }

    if (!result) console.log(`틀렸습니다.\n${arr}\n${target}\n${index}`);
  }

  console.log(`
    arrayLength    : ${arrLength}
    searchCountAvg : ${(searchCountTotal / count).toFixed(2) }
  `);
}

function createRandIntArray(length) {
  let result = [];
  
  while (result.length < length) {
    const num = randInt(result[result.length - 1]);
    if (!result.includes(num)) result.push(num);
  }

  return result;

  function randInt(min = 0) {
    return min + Math.floor(Math.random() * 10)
  }
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * (arr.length - 1))];
}
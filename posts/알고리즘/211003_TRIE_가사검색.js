/*
[문제 설명]
카카오 2020 블라인드 채용 코딩테스트 문제입니다.
링크 : https://programmers.co.kr/learn/courses/30/lessons/60060

단어들의 목록과, 와일드카드가 있는 쿼리들의 목록이 주어졌을 때
각 쿼리에 매치되는 단어의 개수를 배열로 반환합니다.

[풀이]
문자열 탐색에 효율적인 trie 자료구조를 이용해 풀이하였습니다.

쿼리는 단어의 length, startsWith / endsWith를 표현하고 있습니다.

1. 방향 
startsWith는 단어의 앞에서부터, endsWith는 뒤에서부터 비교해야 합니다.
두 가지의 비교를 위해 정방향 trie와 역방향 trie를 사용합니다.

역방향은 제너레이터로 간단하게 

노드마다 단어 length에 대한 정보를 저장하고 탐색하는 것은 복잡하므로,
각 길이마다 두 종류의 trie를 생성해 사용합니다.

쿼리를 한 글자씩 순회하다가 와일드카드를 만나면 노드 탐색을 중지합니다.
그 때 마지막 노드의 단어 개수가 쿼리에 매치되는 단어의 개수입니다.

*/


class Node {
  constructor() {
    this.childNodes = {};
    this.count = 0;
  }
}

class Trie {
  constructor({ reverse } = { reverse: false }) {
    this.root = new Node();
    this.isReverse = reverse;
  }
  
  insert(word) {
    const iter = this.isReverse ? reverse(word) : word;
    let curr = this.root;

    curr.count += 1;

    for (const char of iter) {
      if (!(char in curr.childNodes)) {
        curr.childNodes[char] = new Node();
      }

      curr = curr.childNodes[char];
      curr.count += 1;
    }
  }

  getMatchCount(query) {
    const iter = this.isReverse ? reverse(query) : query;
    let curr = this.root;
  
    for (const char of iter) {
      if (char === '?') break;
      if (!curr.childNodes[char]) return 0;
      
      curr = curr.childNodes[char];
    }
    return curr.count;
  }
}

function solution(words, queries) {
  const trieMap = {};
  const trieMapR = {}; // reverse
  const answer = [];

  for (const word of words) {
    const length = word.length;

    if (!trieMap[length]) {
      trieMap[length] = new Trie();
      trieMapR[length] = new Trie({ reverse: true });
    }
    
    trieMap[length].insert(word);
    trieMapR[length].insert(word);
  }

  for (const query of queries) {
    let trie;

    if (!trieMap[query.length]) {
      answer.push(0);
      continue;
    }

    trie = query[0] === '?'
      ? trieMapR[query.length]
      : trieMap[query.length];

    answer.push(trie.getMatchCount(query));
  }

  return answer;
}

function* reverse(str) {
  for (let i = str.length - 1; i >= 0; i--) {
    yield str[i];
  }
}

const answer = solution(
  ["frodo", "front", "frost", "frozen", "frame", "kakao"],
  ["fro??", "????o", "fr???", "fro???", "pro?"]
);

console.log(answer);
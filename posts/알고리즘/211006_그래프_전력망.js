/*
[설명]
프로그래머스 위클리 챌린지 9주차 문제입니다.
링크 : https://programmers.co.kr/learn/courses/30/lessons/86971

그래프의 엣지를 제거했을 때,
나눠져 생기는 두 개의 그래프의 크기 차이 중
가장 작은 것을 구해 반환합니다.

[풀이]
노드와 그래프 클래스를 통해 그래프를 만들고,
각 엣지마다 1) 제거 2) 크기차이비교 3) 재연결 하여
가장 작은 크기차이를 구합니다.

그래프의 크기는 BFS를 이용해 구하였습니다.
*/

class Node {
  constructor(id) {
    this.id = id;
    this.adjNodes = new Set();
  }
}

class Graph {
  constructor(size, edges) {
    this.nodes = Array.from(Array(size + 1), (_, i) => new Node(i));
    for (const [a, b] of edges) {
      this.link(a, b);
    }
  }
  
  link(id1, id2) {
    const node1 = this.nodes[id1];
    const node2 = this.nodes[id2];
    node1.adjNodes.add(node2);
    node2.adjNodes.add(node1);
  }
  
  cut(id1, id2) {
    const node1 = this.nodes[id1];
    const node2 = this.nodes[id2];
    node1.adjNodes.delete(node2);
    node2.adjNodes.delete(node1);
  }

  getSize(id = 1) {
    const visited = Array.from(this.nodes, () => false);
    const queue = [ this.nodes[id] ];
    let count = 0;
    
    while (queue.length) {
      const node = queue.shift();
      
      visited[node.id] = true;
      count += 1;

      for (const adjNode of [ ...node.adjNodes ]) {
        if (visited[adjNode.id]) continue;
        queue.push(adjNode);
      }
    }
    return count;
  }
}

function solution(n, wires) {
  const graph = new Graph(n, wires);
  let minDiff = n;

  for (const [a, b] of wires) {
    graph.cut(a, b);

    const count = graph.getSize(a);
    const diff = Math.abs(n - (count * 2));
    minDiff = Math.min(minDiff, diff);

    graph.link(a, b);
  }

  return minDiff;
}

const answer = solution(9,	[[1,3],[2,3],[3,4],[4,5],[4,6],[4,7],[7,8],[7,9]]);
console.log(answer);
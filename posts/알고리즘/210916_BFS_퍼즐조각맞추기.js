/*
[문제 설명]
프로그래머스 위클리 챌린지 3주차 문제입니다. 
링크 : https://programmers.co.kr/learn/courses/30/lessons/84021

게임판의 빈 칸에 딱 맞는 블록을 찾아 채웠을 때,
최대로 채울 수 있는 칸의 수를 반환합니다.

블록은 회전할 수 있습니다.
블록은 반전시킬 수 없습니다.

[풀이]
2차원 배열을 다루는 법을 물어보는 문제입니다.

DFS 또는 BFS를 통해 빈칸과 블록의 위치를 찾습니다.
빈칸과 블록의 위치를 바탕으로 표준화된 행렬을 생성합니다.

빈칸과 블록의 길이가 같을 경우,
블록 행렬을 회전시키며 빈칸 행렬과 동일한 형태인지 확인합니다.

행렬의 회전은 파이썬의 내장함수인 zip을 응용하여 구현하였습니다.

[행렬 회전 슈도코드]
def rotate(arr):
  result = []
  
  for (i in range(0, arr[0])):
    result.push(arr.map(v => v[0]).reverse())

  return result;
*/


function solution(game_board, table) {

  const blanks = getChunks(game_board, 0).map(createItem);
  const blocks = getChunks(table, 1).map(createItem);

  let answer = 0;

  for (const blank of blanks) {
    for (const block of blocks) {
      if (block.used || block.length !== blank.length) {
        continue;
      }

      if (isMatch(blank, block)) {
        block.used = true;
        answer += block.length;
        break;
      }
    }
  }

  return answer;

  function isMatch(block, blank) {
    let b1 = block.board;
    let b2 = blank.board;

    for (let i = 0; i < 4; i++) {
      if (isSameBoard(b1, b2)) {
        return true;
      }
      b1 = rotateBoard(b1);
    }

    return false;
  }

  function isSameBoard(b1, b2) {
    return b1.join('') === b2.join('');
  }

  function rotateBoard(board) {
    const result = [];
    for (let i = 0; i < board[0].length; i++) {
      result.push(board.map(v => v[i]).reverse());
    }
    return result;
  }

  function createVector(chunk) {
    let rows = chunk.map(([r]) => r);
    let cols = chunk.map(([_, c]) => c);

    const minR = Math.min(...rows);
    const minC = Math.min(...cols);

    rows = rows.map(r => r - minR);
    cols = cols.map(c => c - minC);

    const board = createEmptyBoard(
      Math.max(...rows) + 1,
      Math.max(...cols) + 1
    );

    for (let i = 0; i < chunk.length; i++) {
      board[rows[i]][cols[i]] = 1;
    }

    return board;
  }

  function createItem(chunk) {
    return {
      length: chunk.length,
      used: false,
      board: createVector(chunk),
    };
  }

  function getChunks(board, target = 0) {
    const D = [ [1, 0], [0, 1], [-1, 0], [0, -1] ];
    const visited = createEmptyBoard(board.length);
    const result = [];

    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board.length; c++) {
        if (!visited[r][c] && board[r][c] === target) {
          visited[r][c] = 1;
          result.push(bfs(r, c));
        }
      }
    }
    return result;

    function bfs(sr, sc) {
      const locs = [[sr, sc]];
      let i = 0;

      while (i < locs.length) {
        const [r, c] = locs[i++];

        for (const [dr, dc] of D) {
          const nr = r + dr;
          const nc = c + dc;

          if (
            isSafe(nr, nc) 
            && board[nr][nc] === target
            && !visited[nr][nc] 
            ) {
            visited[nr][nc] = 1;
            locs.push([nr, nc]);
          }
        }
      }
      return locs;
    }
  }

  function isSafe(r, c) {
    return 0 <= r && r < table.length && 0 <= c && c < table.length;
  }

  function createEmptyBoard(r, c) {
    return Array.from(Array(r), () => Array(c || r).fill(0));
  }
}

console.log(solution([[1,1,0,0,1,0],[0,0,1,0,1,0],[0,1,1,0,0,1],[1,1,0,1,1,1],[1,0,0,0,1,0],[0,1,1,1,0,0]]
,[[1,0,0,1,1,0],[1,0,1,0,1,0],[0,1,1,0,1,1],[0,0,1,0,0,0],[1,1,0,1,1,0],[0,1,0,0,0,0]]))
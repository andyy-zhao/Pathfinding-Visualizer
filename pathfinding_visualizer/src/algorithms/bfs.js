export function breadthFirstSearch(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.parent = null;
    startNode.level = 0;
    const queue = [];
    queue.push(startNode);
    startNode.isVisited = true;
  
    function explore(node, queue) {
      const nodeNeighbours = getNodeNeighbours(node, grid);
      for (const neighbour of nodeNeighbours) {
        if (!neighbour.isVisited && !neighbour.isWall) {
          neighbour.isVisited = true;
          neighbour.parent = node;
          neighbour.level = node.level + 1;
          queue.push(neighbour);
        }
      }
    }
  
    function getNodeNeighbours(node, grid) {
      const neighbors = [];
      const { col, row } = node;
      if (row > 0) neighbors.push(grid[row - 1][col]);
      if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
      if (col > 0) neighbors.push(grid[row][col - 1]);
      if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
      return neighbors;
    }
  
    while (queue.length > 0) {
      let node = queue.shift();
      visitedNodesInOrder.push(node);
      if (node === finishNode) {
        explore(node, queue);
        return visitedNodesInOrder.filter(node => !node.isWall);
      }
      explore(node, queue);
    }
    return visitedNodesInOrder;
}
  
// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the breadthFirstSearch method above.
export function getNodesInShortestPathOrderBFS(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      if (currentNode.parent) {
        currentNode = currentNode.parent;
      } else {
        return nodesInShortestPathOrder;
      }
    }
    return nodesInShortestPathOrder;
}
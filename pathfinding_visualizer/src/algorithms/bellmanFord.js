// Performs Bellman Ford algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
export function bellmanFord(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    // all nodes have distance infinity except for the start node
    for (const row of grid) {
        for (const node of row) {
            node.distance = node === startNode ? 0 : Infinity;
            node.previousNode = null;
        }
    }
    const nodes = getAllNodes(grid);
    // iterate |V| - 1 times, relaxing edges |V|-1 times
    for (let i = 0; i < nodes.length - 1; i++) {
        for (const node of nodes) {
            if (node.isWall) continue;
            if (!visitedNodesInOrder.includes(node)) {
                visitedNodesInOrder.push(node);
            }
            const neighbors = getUnvisitedNeighbors(node, grid);
            for (const neighbor of neighbors) {
                const newDistance = node.distance + 1;
                if (newDistance < neighbor.distance) {
                    neighbor.distance = newDistance;
                    neighbor.previousNode = node;
                }
            }
        }
    }
    // Checking for negative cycles
    for (const node of nodes) {
        const neighbors = getUnvisitedNeighbors(node, grid);
        for (const neighbor of neighbors) {
            const newDistance = node.distance + 1;
            if (newDistance < neighbor.distance) {
                // no shortest path exists
                return visitedNodesInOrder;
            }
        }
    }
    return visitedNodesInOrder;
}
  
function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}
  
function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
}


export function getNodesInShortestPathOrderBellmanFord(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}
  
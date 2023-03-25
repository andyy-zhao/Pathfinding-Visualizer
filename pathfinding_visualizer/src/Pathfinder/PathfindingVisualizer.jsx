import { Node } from './Node/Node';
import { useState, useEffect } from 'react';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { greedyBestFirstSearch, getNodesInShortestPathOrderGreedy } from '../algorithms/greedyBestFirst';
import { breadthFirstSearch, getNodesInShortestPathOrderBFS } from '../algorithms/bfs';
import { bellmanFord, getNodesInShortestPathOrderBellmanFord } from '../algorithms/bellmanFord';

import './PathfindingVisualizer.css';

const START_NODE_ROW = 12;
const START_NODE_COL = 5;
const FINISH_NODE_ROW = 12;
const FINISH_NODE_COL = 45;

export const PathfindingVisualizer = () => {
    const [grid, setGrid] = useState(() => getInitialGrid(false));
    const [mouseIsPressed, setMouseIsPressed] = useState(false);
    const [startNodeRow, setStartNodeRow] = useState(START_NODE_ROW);
    const [startNodeCol, setStartNodeCol] = useState(START_NODE_COL);
    const [finishNodeRow, setFinishNodeRow] = useState(FINISH_NODE_ROW);
    const [finishNodeCol, setFinishNodeCol] = useState(FINISH_NODE_COL);
    const [isDraggingStartNode, setIsDraggingStartNode] = useState(false);
    const [isDraggingFinishNode, setIsDraggingFinishNode] = useState(false);
    const [randomMazeBtnClick, setRandomMazeBtnClick] = useState(false);

    useEffect(() => {
        const initialGrid = getInitialGrid(randomMazeBtnClick);
        setGrid(initialGrid);
    },[randomMazeBtnClick])


    const handleMouseDown = (row, col) => {
        if (row === startNodeRow && col === startNodeCol) {
            setIsDraggingStartNode(true);
            const newGrid = getNewGridWithStartNodeUpdated(grid, row, col);
            setGrid(newGrid);
            setMouseIsPressed(true);
            return;
        }
        else if (row === finishNodeRow && col === finishNodeCol) {
            setIsDraggingFinishNode(true);
            const newGrid = getNewGridWithFinishNodeUpdated(grid, row, col);
            setGrid(newGrid);
            setMouseIsPressed(true);
            return;
        }
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid);
        setMouseIsPressed(true);
        
    }
    const handleMouseEnter = (row, col) => {
        if (!mouseIsPressed) return;
        if (isDraggingStartNode) {
            if (row === finishNodeRow && col === finishNodeCol) {
                return;
            }
            setStartNodeCol(col);
            setStartNodeRow(row);
            const newGrid = getNewGridWithStartNodeUpdated(grid, row, col);
            setGrid(newGrid);
            return;
        }
        if (isDraggingFinishNode) {
            if (row === startNodeRow && col === startNodeCol) {
                return;
            }
            setFinishNodeCol(col);
            setFinishNodeRow(row);
            const newGrid = getNewGridWithFinishNodeUpdated(grid, row, col);
            setGrid(newGrid);
            return;
        }
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid);
    }

    const handleMouseUp = () => {
        setMouseIsPressed(false);         
        if (isDraggingStartNode) {
            setIsDraggingStartNode(false);
        }
        if (isDraggingFinishNode) {
            setIsDraggingFinishNode(false);
        }
    }
    const getNewGridWithStartNodeUpdated = (grid, row, col) => {
        const newGrid = grid.slice();
        const startNode = newGrid[row][col];
        const newStartNode = {
            ...startNode, 
            isStart: true,
        };
        newGrid[row][col] = newStartNode;
        for (let i = 0; i < newGrid.length; i++) {
            for (let j = 0; j < newGrid[i].length; j++) {
                if (i !== row || j !== col) {
                    newGrid[i][j].isStart = false;
                }
            }
        }
        return newGrid;
    }

    const getNewGridWithFinishNodeUpdated = (grid, row, col) => {
        const newGrid = grid.slice();
        const finishNode = newGrid[row][col];
        const newFinishNode = {
            ...finishNode, 
            isFinish: true,
        };
        newGrid[row][col] = newFinishNode;
        for (let i = 0; i < newGrid.length; i++) {
            for (let j = 0; j < newGrid[i].length; j++) {
                if (i !== row || j !== col) {
                    newGrid[i][j].isFinish = false;
                }
            }
        }
        newGrid[row][col].isWall = false;
        return newGrid;
    }

    const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
          if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
              animateShortestPath(nodesInShortestPathOrder);
            }, 10 * i);
            return;
          }
          setTimeout(() => {
            const node = visitedNodesInOrder[i];
            const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
            if (nodeElement) {
              nodeElement.className = 'node node-visited';
            }
          }, 10 * i);
        }
    };

    const animateShortestPath = (nodesInShortestPathOrder) => {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
          setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
            if (nodeElement) {
              nodeElement.className = 'node node-shortest-path';
            }
          }, 50 * i);
        }
    };

    const visualizeDijkstra = () => {
        const startNode = grid[startNodeRow][startNodeCol];
        const finishNode = grid[finishNodeRow][finishNodeCol];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    };

    const visualizeGreedyBestFirst = () => {
        const startNode = grid[startNodeRow][startNodeCol];
        const finishNode = grid[finishNodeRow][finishNodeCol];
        const visitedNodesInOrder = greedyBestFirstSearch(grid, startNode, finishNode);
        const nodesInShortestPathOrderGreedy = getNodesInShortestPathOrderGreedy(finishNode);
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrderGreedy);
    };

    const visualizeBFS = () => {
        const startNode = grid[startNodeRow][startNodeCol];
        const finishNode = grid[finishNodeRow][finishNodeCol];
        const visitedNodesInOrder = breadthFirstSearch(grid, startNode, finishNode);
        const nodesInShortestPathOrderBFS = getNodesInShortestPathOrderBFS(finishNode);
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrderBFS);
    };

    const visualizeBellmanFord = () => {
        const startNode = grid[startNodeRow][startNodeCol];
        const finishNode = grid[finishNodeRow][finishNodeCol];
        const visitedNodesInOrder = bellmanFord(grid, startNode, finishNode);
        const nodesInShortestPathOrderBFS = getNodesInShortestPathOrderBellmanFord(finishNode);
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrderBFS);
    };
    
    const getRandomMaze = () => {
        setRandomMazeBtnClick(true);
        const initialGrid = getInitialGrid(randomMazeBtnClick);
        for (let i = 0; i < initialGrid.length; i++) {
            for (let j = 0; j < initialGrid[0].length; j++) {
                const node = initialGrid[i][j];
                const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
                nodeElement.classList.remove('node-visited');
                nodeElement.classList.remove('node-shortest-path');
                if (node.isStart) {
                    nodeElement.classList.add('node-start');
                }
                if (node.isFinish) {
                    nodeElement.classList.add('node-finish');
                }
            }
        }
        setGrid(initialGrid);
        setMouseIsPressed(false);
        setStartNodeRow(START_NODE_ROW);
        setStartNodeCol(START_NODE_COL);
        setFinishNodeRow(FINISH_NODE_ROW);
        setFinishNodeCol(FINISH_NODE_COL);
    }

    const resetGrid = () => {
        setRandomMazeBtnClick(false);
        const initialGrid = getInitialGrid(randomMazeBtnClick);
        for (let i = 0; i < initialGrid.length; i++) {
            for (let j = 0; j < initialGrid[0].length; j++) {
                const node = initialGrid[i][j];
                const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
                nodeElement.classList.remove('node-visited');
                nodeElement.classList.remove('node-shortest-path');
                if (node.isStart) {
                    nodeElement.classList.add('node-start');
                }
                if (node.isFinish) {
                    nodeElement.classList.add('node-finish');
                }
            }
        }
        setGrid(initialGrid);
        setMouseIsPressed(false);
        setStartNodeRow(START_NODE_ROW);
        setStartNodeCol(START_NODE_COL);
        setFinishNodeRow(FINISH_NODE_ROW);
        setFinishNodeCol(FINISH_NODE_COL);
    }

    return (
        <>
            <button onClick={visualizeDijkstra}>
                Visualize Dijkstra's Algorithm
            </button>
            <button onClick={visualizeGreedyBestFirst}>
                Visualize Greedy Best First Algorithm
            </button>
            <button onClick={visualizeBFS}>
                Visualize Breadth First Search Algorithm
            </button>
            <button onClick={visualizeBellmanFord}>
                Visualize DP Bellman Ford Search Algorithm
            </button>
            <button onClick={resetGrid}>
                Reset
            </button>
            <button onClick={getRandomMaze}>
                Random Maze
            </button>
            <div className="grid">
                {grid.map((row, index) => {
                    return (
                        <div key={index}>
                            {row.map((node, nodeIdx) => {
                                const {isStart, isFinish, row, col, isWall} = node;
                                return (
                                    <Node
                                        key={nodeIdx}
                                        col={col}
                                        isFinish={isFinish}
                                        isStart={isStart}
                                        isWall={isWall}
                                        mouseIsPressed={mouseIsPressed}
                                        onMouseDown={(row, col) => handleMouseDown(row, col)}
                                        onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                                        onMouseUp={() => handleMouseUp()}
                                        row={row}
                                    ></Node>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </>
    )
}

const getInitialGrid = (randomMazeBtnClick) => {
    const grid = [];
    for (let row = 0; row < 24; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    if (randomMazeBtnClick) {
        for (const row of grid) {
            for (const node of row) {
                node.isWall = Math.random() < 0.3;
            }
        }
    }
    return grid;
};

const createNode = (col, row) => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};


const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node, 
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
}


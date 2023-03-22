import { Node } from './Node/Node';
import { useState, useEffect } from 'react';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { greedyBestFirstSearch, getNodesInShortestPathOrderGreedy } from '../algorithms/greedyBestFirst';

import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 5;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 45;

export const PathfindingVisualizer = () => {
    const [grid, setGrid] = useState(() => getInitialGrid());
    const [mouseIsPressed, setMouseIsPressed] = useState(false);
    const [startNodeRow, setStartNodeRow] = useState(START_NODE_ROW);
    const [startNodeCol, setStartNodeCol] = useState(START_NODE_COL);
    const [finishNodeRow, setFinishNodeRow] = useState(FINISH_NODE_ROW);
    const [finishNodeCol, setFinishNodeCol] = useState(FINISH_NODE_COL);
    const [isDraggingStartNode, setIsDraggingStartNode] = useState(false);
    const [isDraggingFinishNode, setIsDraggingFinishNode] = useState(false);

    useEffect(() => {
        const initialGrid = getInitialGrid();
        setGrid(initialGrid);
    },[])

    const handleMouseDown = (row, col) => {
        if (row === startNodeRow && col === startNodeCol) {
            setIsDraggingStartNode(true);
        } else if (row === finishNodeRow && col === finishNodeCol) {
            setIsDraggingFinishNode(true);
        } else {
            const newGrid = getNewGridWithWallToggled(grid, row, col);
            setGrid(newGrid);
            setMouseIsPressed(true);
        }
    }
    const handleMouseEnter = (row, col) => {
        if (!mouseIsPressed) return;
        if (isDraggingStartNode) {
            const newGrid = grid.slice();
            const oldStartNode = newGrid[startNodeRow][startNodeCol];
            const newStartNode = newGrid[row][col];
            oldStartNode.isStart = !oldStartNode.isStart;
            oldStartNode.className = 'node';
            newStartNode.isStart = !newStartNode.isStart;
            newStartNode.className = 'node node-start';
            setStartNodeRow(row);
            setStartNodeCol(col);
            setGrid(newGrid);
            
        } else if (isDraggingFinishNode) {
            setFinishNodeRow(row);
            setFinishNodeCol(col);
        } 
        else {
            const newGrid = getNewGridWithWallToggled(grid, row, col);
            setGrid(newGrid);
        }
    }
    const handleMouseUp = () => {
        setMouseIsPressed(false);         
        setIsDraggingStartNode(false);
        setIsDraggingFinishNode(false);
        
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

    const resetGrid = () => {
        const initialGrid = getInitialGrid();
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
    }

    return (
        <>
            <button onClick={visualizeDijkstra}>
                Visualize Dijkstra's Algorithm
            </button>
            <button onClick={visualizeGreedyBestFirst}>
                Visualize Greedy Best First Algorithm
            </button>
            <button onClick={resetGrid}>
                Reset
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

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
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

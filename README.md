# Pathfinding Visualizer
Welcome to pathfinding visualizer! I built this application because I was fascinated by pathfinding algorithms after learning about them in CS341, and I wanted to visualize them in action. I hope you enjoy playing around with this visualization tool as much as I enjoyed creating it. 
You can access it here: https://pathfindr.netlify.app/.

## Algorithms:
This application supports the following algorithms: 

**Dijkstra's Algorithm**: The father of pathfinding algorithms. Guarantees the shortest path between nodes in a weighted graph. In the real world, this could represent finding shortest paths in road networks. Dijkstra's algorithm has a runtime of O(|E|+|V|log|V|). 

**Greedy Best First Search**: Prioritizes exploring weighted nodes that are closest to the endpoint based on a heuristic function. Does not guarantee the shortest path, but can be fast and efficient. 

**Breadth First Search**: Works on unweighted graphs. Guarantees shortest path and is a great algorithm, but may not be the fastest algorithm for large graphs.

**Bellman-Ford Algorithm**: Unlike Dijkstra's, works with graphs that have negative weights. Utilizes dynamic programming and guarantees shortest-path. 


## Technologies Used:

* HTML
* CSS
* JavaScript
* ReactJS

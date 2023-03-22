import './Node.css';
import startIcon from "../../assets/rocket.png"
import finishIcon from '../../assets/asteroid.png'

export const Node = ({
    col,
    isFinish,
    isStart,
    isWall,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    row,
}) => {
  const extraClassName = isFinish
    ? 'node-finish'
    : isStart
    ? 'node-start'
    : isWall
    ? 'node-wall'
    : '';
  const icon = isStart ? <img src={startIcon} alt="rocket start" className="start-icon" /> : null;
  const iconFinish = isFinish ? <img src={finishIcon} alt="mars finish" className="finish-icon" /> : null;
    return (
        <div
          id={`node-${row}-${col}`}
          className={`node ${extraClassName}`}
          onMouseDown={() => onMouseDown(row, col)}
          onMouseEnter={() => onMouseEnter(row, col)}
          onMouseUp={() => onMouseUp()}>{icon}{iconFinish}</div>
    );
};
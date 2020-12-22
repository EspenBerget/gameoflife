
import './Grid.css';
import Cell from './Cell';
import { useEffect, useState } from 'react';

function useGrid(row, column) {
    const [ grid, setGrid ] = useState(Array(row*column).fill(false));

    function clear() {
        setGrid(Array(row*column).fill(false));
    }

    function flip(ix) {
        return () => {
            let new_grid = grid.slice(); // LEARNED: use slice!
            new_grid[ix] = !grid[ix]
            setGrid(new_grid);
            console.log(ix);
        };
    }

    function getValue(ix) {
        if (ix >= 0 && ix < row*column) {
            if (grid[ix]) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    function countNeighbors(ix) {
        // ix-1-column  ix-column   ix-column+1
        // ix-1         ix          ix+1
        // ix-1+column  ix+column   ix+column+1
        let left = [ix-column,ix-column+1,ix+1,ix+column,ix+column+1];
        let right = [(ix-1)-column,ix-column,ix-1,(ix-1)+column,ix+column];
        let center = [(ix-1)-column,ix-column,(ix-column)+1,ix-1,ix+1,(ix-1)+column,ix+column,ix+column+1];
        let cur;
        if ((ix+1) % column === 0) {
            cur = left;
        } else if ((ix+1) % column === 1) {
            cur = right;
        } else {
            cur = center;
        }
        return cur.map(getValue).reduce((acc, x) => x+acc);
    }

    function nextState(cell, ix) {
        let neightbors = countNeighbors(ix);
        if (cell) {
            return neightbors === 2 || neightbors === 3;
        } else {
            return neightbors === 3;
        }
    }

    function step() {
        let new_grid = grid.slice();
        setGrid(new_grid.map(nextState));
    }

    return { grid, flip, step, clear}
}

function Grid(props) {
    const { grid, flip, step, clear } = useGrid(props.row, props.column);
    const [ isRunning, setRunning] = useState(false);

    useEffect(() => {
        let i;
        if (isRunning) {
            i = setInterval(step, 1000);

        }

        return () => { clearInterval(i) };
    });

    function run() {
        setRunning(true);
    }
    function stop() {
        setRunning(false);
    }

    return (
        <div className="container">
            <div className="grid">
                { grid.map((cell, ix) => 
                    <Cell key={ix} state={cell} whenUpdate={flip(ix)} />
                  )
                }
            </div>
            <div className="controls">
                <button onClick={step}>Step</button>
                <button className={!isRunning && "go"}  onClick={run}>Run</button>
                <button className={isRunning && "stop"} onClick={stop}>Stop</button>
                <button onClick={clear}>Clear</button>
            </div>
        </div>
    );
}

export default Grid;

import './Grid.css';
import Cell from './Cell';
import Example from './Example';
import { useEffect, useState } from 'react';

function getExamples(row, column) {
    let basic = Array(row*column).fill(false);

    let center = (row*column) / 2;
    let half = column / 2;
    let origin = center + half;

    let toad = basic.slice();
    toad[origin] = true;
    toad[origin+1] = true;
    toad[origin-1] = true;
    toad[origin+column] = true;
    toad[origin+column-1] = true;
    toad[origin+column-2] = true;

    let funky = basic.slice();
    funky[origin] = true;
    funky[origin+1] = true;
    funky[origin-1] = true;
    funky[origin-column] = true;
    funky[origin+column] = true;

    
    return [
        ["toad", toad],
        ["funky", funky]
    ];
}

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
        if (ix % column === 0) {
            cur = left;
        } else if (ix % column === (column-1)) {
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

    return { grid, flip, step, clear, setGrid }
}

function Grid(props) {
    const { grid, flip, step, clear, setGrid } = useGrid(props.row, props.column);
    const [ isRunning, setRunning] = useState(false);

    const examples = getExamples(props.row, props.column);

    useEffect(() => {
        let i;
        if (isRunning) {
            i = setInterval(step, 1000);

        }

        return () => { clearInterval(i) };
    });

    function loadExample(arr) {
        setRunning(false);
        setGrid(arr.slice());
    }

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
                <button className={!isRunning ? "go" : undefined}  onClick={run}>Run</button>
                <button className={isRunning ? "stop" : undefined} onClick={stop}>Stop</button>
                <button onClick={clear}>Clear</button>
            </div>
            <div className="examples">
                <h3>Examples</h3>
                { examples.map(([title, arr], ix) => 
                    <Example key={ix} title={title} whenPressed={() => loadExample(arr)} />
                  )
                }
            </div>
        </div>
    );
}

export default Grid;
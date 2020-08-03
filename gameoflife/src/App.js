import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import './App.css';
const numRows = 30;
const numColumns = 50;

//checks neighbor cells across the grid
const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const emptyGrid = () => {
  const rows = [];
  // creates the grid
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numColumns), () => 0));
  }
  return rows;
};
// setting up states
const App = () =>  {
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [generation, setGeneration] = useState(0);
  const [grid, setGrid] = useState(() => {
    return emptyGrid();
  });


//gives current value for the running state, generation and speed
const runningRef = useRef(running);
runningRef.current = running;

const generationRef = useRef(generation);
generationRef.current = generation

const speedRef = useRef(speed)
speedRef.current = speed

// makes the generation count go up by 1
const generationStep = () => {
  setGeneration((generation) => generation + 1)
}

const runGame = useCallback(() => {
  // If it's not running end game
  if (!runningRef.current) {
    return;
  }
  //uses recursive to update the state
  setGrid((g) => {
    return produce(g, (gridCopy) => {
      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
          //Figure out how many neighbors each cell has
          let neighbors = 0;
          operations.forEach(([x, y]) => {
            const newI = i + x;
            const newJ = j + y;
            //Bounds of your grid to make sure it doesnt go above or below
            if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numColumns) {
              neighbors += g[newI][newJ];
            }
          });
          //If current cell is dead, but has 3 neighbors it comes alive
          if (neighbors < 2 || neighbors > 3) {
            gridCopy[i][j] = 0;
          } else if (g[i][j] === 0 && neighbors === 3) {
            gridCopy[i][j] = 1;
          }
        }
      }
    });
    
  }
  );
  setGeneration(++generationRef.current);
  setTimeout(runGame, speedRef.current);
  
}, []);

  const step = useCallback(() => {
    if(!runningRef.current) {
        return
    }
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numColumns; j++) {
            //Figure out how many neighbors each cell has
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              //Bounds of your grid to make sure it doesnt go above or below
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numColumns) {
                neighbors += g[newI][newJ];
              }
            });
            //If current cell is dead, but has 3 neighbors it comes alive
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
      
    }
    );
    generationStep();
}, [])

  
return (
  <>
    <div className='container'>
         <h1>Conway's Game Of Life</h1>
         <h2>Rules</h2>
         <li>Any live cell with two or three live neighbours survives.</li>
         <li>Any dead cell with three live neighbours becomes a live cell.</li>
         <li>All other live cells die in the next generation. Similarly, all other dead cells stay dead.</li>
<div className='controlbuttons'>
  {/* Start and Stop the Game */}
    <button onClick={() => {
        setRunning(!running)
          if (!running){
          runningRef.current = true;
          runGame();
        }
      }
    }
    >
    {running ? 'stop' : 'start'}
    </button>

    {/* creates a random seed */}
    <button
    onClick={() => {
      const rows = [];
      for (let i = 0; i < numRows; i++) {
        rows.push(
          Array.from(Array(numColumns), () => (Math.random() > .6 ? 1 : 0))
          );
        }
        setGrid(rows);
      } 
    }
    >
    random seed
    </button>
    <button onClick={() => {
        setGrid(emptyGrid())
        setGeneration(0);
      }}
    >
    clear
    </button>

    {/* slows down the movents */}
    <button
          onClick={() => {
            if (speedRef.current < 3000) {
              return setSpeed(speedRef.current + 100);
          } else {
              return setSpeed((speedRef.current = 1100));
          }
        }}
        >
        Speed -
        </button>

        {/* speeds up the movements */}
        <button
          onClick={() => {
            if (speedRef.current > 200) {
              return setSpeed(speedRef.current - 200);
          } else if (speedRef.current <= 100 && speedRef.current >= 50) {
              return setSpeed(speedRef.current - 50);
          } else {
              return setSpeed((speedRef.current = 10));
          }
        }}
        >
        Speed +
        </button>
        {/* able to run the game 1 step at a time */}
        <button
        onClick={() => {
          if(!running) {
            setRunning(true)
            runningRef.current = true;
            step()
            setRunning(false)
            runningRef.current = false
        }
        }}>
          step
        </button>
        
    </div>


    <div className="grid-container">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numColumns}, 20px`,
        }}
      >
        {/* creates the grid */}
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i}-${j}`}
              //Checks to see if girds are alive
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][j] = grid[i][j] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][j] ? "turquoise" : "lightgray",
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
      </div>
    <h1>Generations: {generation}</h1>
    </div>
  </>
  );
}

export default App;






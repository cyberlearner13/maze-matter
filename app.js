// Boiler Plate code for Matter
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine; 

const width = window.innerWidth;
const height = window.innerHeight;
const cellsHorizontal = 8;
const cellsVertical = 5;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const render = Render.create({
    element: document.body, // additive process, adds new additonal element
    engine,
    options:{
        wireframes: false,
        height,
        width
    }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [Bodies.rectangle(width/2, 0, width, 2, {
    isStatic: true
}),Bodies.rectangle(width/2, height, width, 2, {
    isStatic: true
}),Bodies.rectangle(0, height/2, 2, height, {
    isStatic: true
}),Bodies.rectangle(width, height/2, 2, height, {
    isStatic: true
})];



World.add(world, walls);

// Maze Generation

const shuffle = arr => {
    let counter = arr.length;

    while(counter > 0){
        const index = Math.floor(Math.random()*counter);
        counter--;
        [arr[counter], arr[index]] = [arr[index], arr[counter]];
    }

    return arr;
}
// Grids...

const grid = Array(cellsVertical).fill(null).map(()=> Array(cellsHorizontal).fill(false));
const verticals = Array(cellsVertical).fill(null).map(()=> Array(cellsHorizontal-1).fill(false));
const horizontals = Array(cellsVertical-1).fill(null).map(()=> Array(cellsHorizontal).fill(false));

// Starting Cell

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

// Let's go!

const stepThroughCell = (row, column) => {
    // If I have visited the cell at [row, column] -> then return!
    if(grid[row][column]) return;

    // Mark the cell as being visited
    grid[row][column] = true;

    // Assemble randomly-ordered list of neighbors
    const neighbors = shuffle([
        [row-1, column, 'top'],
        [row, column+1, 'right'],
        [row+1, column, 'bottom'],
        [row, column-1, 'left']
    ]);

    // For each neighbor...
    for(let neighbor of neighbors){
        
        const [nextRow, nextColumn, direction] = neighbor;

        // See if that neighbor is out of bounds
        if(nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal){
            continue;
        }

        // If we have visited that neighbor, continue to next neighbor
        if(grid[nextRow][nextColumn]){
            continue;
        }

        // Remove a wall from either one of the arrays
        if(direction === 'left'){
            verticals[row][column-1] = true;
        } else if (direction === 'right'){
            verticals[row][column] = true;
        } else if (direction === 'top'){
            horizontals[row-1][column] = true;
        } else if( direction === 'bottom'){
            horizontals[row][column] = true;
        }
        stepThroughCell(nextRow, nextColumn);
    }
    
    // Visit that next cell
}

stepThroughCell(startRow, startColumn);

// Drawing the Maze on the screen

horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) =>{
        if(open) return;
        // Draw walls only if open is false:
        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX/2,
            rowIndex * unitLengthY + unitLengthY,
            unitLengthX,
            5, {
                isStatic: true,
                label: 'wall',
                render:{
                    fillStyle: 'red'
                }
            });
        World.add(world, wall);
    });
});

verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) return;
         // Draw walls only if open is false:
         const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX,
            rowIndex * unitLengthY + unitLengthY/2,
            5,
            unitLengthY, {
                isStatic: true,
                label: 'wall',
                render:{
                    fillStyle: 'red'
                }
            });
        World.add(world, wall);
   
    });
});

// Goal

const goal = Bodies.rectangle(
    width - unitLengthX / 2,
    height - unitLengthY / 2,
    unitLengthX * .7,
    unitLengthY * .7,
    {
        isStatic: true,
        label: 'goal',
        render:{
            fillStyle: 'green'
        }
    }
);

World.add(world, goal);

// Ball
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(
    unitLengthX /2,
    unitLengthY /2,
    ballRadius,
    {
        label: 'ball',
        render:{
            fillStyle: 'blue'
        }
    }
);

World.add(world, ball);

document.addEventListener('keydown', e => {
    const { x, y } = ball.velocity;
    switch(e.code){
        case 'KeyW': Body.setVelocity(ball, {x, y: y - 5}); break;
        case 'KeyA': Body.setVelocity(ball, {x: x - 5, y}); break;
        case 'KeyS': Body.setVelocity(ball, {x, y: y + 5}); break;
        case 'KeyD': Body.setVelocity(ball, {x: x + 5, y}); break;
        default: break;
    }
});

// Win condition

Events.on(engine, 'collisionStart', e => {
    e.pairs.forEach(collison => {
        const labels = ['ball', 'goal'];
        
        if(labels.includes(collison.bodyA.label) && labels.includes(collison.bodyB.label)){
           world.gravity.y = 1;
           world.bodies.forEach(body => {
               if(body.label === 'wall'){
                   Body.setStatic(body, false);
                   document.querySelector('.winner').classList.remove('hidden');
               }
           })
        }
    });
});
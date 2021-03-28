// Boiler Plate code for Matter
const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } = Matter;

const engine = Engine.create();
const { world } = engine; 

const width = 800;
const height = 600;

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

World.add(world, MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas)
}))

// Walls
const walls = [Bodies.rectangle(400, 0, 800, 50, {
    isStatic: true
}),Bodies.rectangle(400, 600, 800, 50, {
    isStatic: true
}),Bodies.rectangle(0, 300, 50, 600, {
    isStatic: true
}),Bodies.rectangle(800, 300, 50, 600, {
    isStatic: true
})];



World.add(world, walls);
World.add(world, Bodies.rectangle(200,200,50,50));

// Random Shapes

for(let i=0; i<20; i++){
    if(Math.random() > 0.5){
        World.add(world, Bodies.rectangle(Math.random() * width,Math.random() * height,50,50));
    } else {
        World.add(world, Bodies.circle(Math.random() * width,Math.random() * height, 35,{
            render:{
                fillStyle: '#741c9a'
            }
        }));
    }
    
}
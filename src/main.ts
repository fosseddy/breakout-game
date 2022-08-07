const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
console.assert(canvas != null, "Canvas was not found in DOM");

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.border = "1px solid black";

const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
console.assert(ctx != null, "2d context is not supported, i guess");

let x = 10;
let prevTimestamp = 0;
function gameLoop(timestamp: number) {
    const dt = (timestamp - prevTimestamp) * 0.001;
    console.assert(dt > 0);

    prevTimestamp = timestamp;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = "#000";
    ctx.fillRect(x, 10, 100, 10);

    x += 1;

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

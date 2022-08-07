const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

const PLATFORM_WIDTH = 100;
const PLATFORM_HEIGHT = 10;

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
console.assert(canvas != null, "Canvas was not found in DOM");

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.border = "1px solid black";

const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
console.assert(ctx != null, "2d context is not supported");

type Hex = string;

type Platform = {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  color: Hex;
};

enum Direction {
  LEFT = 0,
  RIGHT
}

const p: Platform = {
  x: CANVAS_WIDTH / 2 - PLATFORM_WIDTH / 2,
  y: CANVAS_HEIGHT - PLATFORM_HEIGHT * 2,
  w: 100,
  h: 10,
  speed: 200,
  color: "#000"
};

let d: Direction = Direction.RIGHT;

let prevTimestamp = 0;
function gameLoop(timestamp: number) {
  const dt = (timestamp - prevTimestamp) * 0.001;
  console.assert(dt > 0);
  prevTimestamp = timestamp;

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = p.color;
  ctx.fillRect(p.x, p.y, p.w, p.h);

  if (d === Direction.RIGHT) {
    p.x += p.speed * dt;
    if (p.x + p.w >= CANVAS_WIDTH) d = Direction.LEFT;
  } else {
    p.x -= p.speed * dt;
    if (p.x <= 0) d = Direction.RIGHT;
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

document.addEventListener("keydown", (e: KeyboardEvent) => {
  switch (e.code) {
    case "KeyD":
    case "ArrowRight":
      d = Direction.RIGHT;
      break;

    case "KeyA":
    case "ArrowLeft":
      d = Direction.LEFT;
      break;

    default: break;
  }
});

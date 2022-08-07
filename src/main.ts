const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 200;

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
  s: number;
  c: Hex;
};

const p: Platform = {
  x: CANVAS_WIDTH / 2 - PLATFORM_WIDTH / 2,
  y: CANVAS_HEIGHT - PLATFORM_HEIGHT * 2,
  w: 100,
  h: 10,
  s: 200,
  c: "#000"
};

type Ball = {
  x: number;
  y: number;
  w: number;
  h: number;
  sx: number;
  sy: number;
  c: Hex;
};

const b: Ball = {
  x: CANVAS_WIDTH / 2 - 10,
  y: 10,
  w: 10,
  h: 10,
  sx: 100,
  sy: 100,
  c: "#f00"
};

let prevTimestamp = 0;
function gameLoop(timestamp: number) {
  const dt = (timestamp - prevTimestamp) * 0.001;
  console.assert(dt > 0);
  prevTimestamp = timestamp;

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = p.c;
  ctx.fillRect(p.x, p.y, p.w, p.h);

  ctx.fillStyle = b.c;
  ctx.fillRect(b.x, b.y, b.w, b.h);

  p.x += p.s * dt;

  if (p.x + p.w > CANVAS_WIDTH) {
    p.x = CANVAS_WIDTH - p.w;
  } else if (p.x < 0) {
    p.x = 0;
  }

  b.x += b.sx * dt;
  b.y += b.sy * dt;

  if (b.x + b.w >= CANVAS_WIDTH || b.x <= 0) {
    b.sx *= -1;
  }

  if (b.y >= CANVAS_HEIGHT - b.h || b.y <= 0) {
    b.sy *= -1;
  }

  const coll_x = b.x + b.w >= p.x && p.x + p.w >= b.x;
  const coll_y = b.y + b.h >= p.y && p.y + p.h >= b.y;

  if (coll_x && coll_y) {
    b.sy *= -1;
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

document.addEventListener("keydown", (e: KeyboardEvent) => {
  switch (e.code) {
    case "KeyD":
    case "ArrowRight":
      if (p.s < 0) {
        p.s *= -1;
      }
      break;

    case "KeyA":
    case "ArrowLeft":
      if (p.s > 0) {
        p.s *= -1;
      }
      break;

    default: break;
  }
});

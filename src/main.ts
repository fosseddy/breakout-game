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

type Vec2 = {
  x: number;
  y: number;
}

function vec2(x: number, y: number): Vec2 {
  return { x, y };
}

type Platform = {
  pos: Vec2;
  size: Vec2;
  color: string;
}

const platform: Platform = {
  pos: vec2(
    CANVAS_WIDTH / 2 - PLATFORM_WIDTH / 2,
    CANVAS_HEIGHT - PLATFORM_HEIGHT * 2
  ),
  size: vec2(PLATFORM_WIDTH, PLATFORM_HEIGHT),
  color: "#000"
};

let prevTimestamp = 0;
function gameLoop(timestamp: number) {
  const dt = (timestamp - prevTimestamp) * 0.001;
  console.assert(dt > 0);
  prevTimestamp = timestamp;

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  platform.pos.x += dt;

  if (platform.pos.x + platform.size.x > CANVAS_WIDTH) {
    platform.pos.x = CANVAS_WIDTH - platform.size.x;
  } else if (platform.pos.x < 0) {
    platform.pos.x = 0;
  }

  {
    const { pos, size, color } = platform;
    ctx.fillStyle = color;
    ctx.fillRect(pos.x, pos.y, size.x, size.y);
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

document.addEventListener("keydown", (e: KeyboardEvent) => {
  switch (e.code) {
    case "KeyD":
    case "ArrowRight":
      platform.pos.x += 1;
      break;

    case "KeyA":
    case "ArrowLeft":
      platform.pos.x -= 1;
      break;

    default: break;
  }
});

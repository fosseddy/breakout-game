const GAME_WIDTH = 500;
const GAME_HEIGHT = 300;

const BAR_WIDTH = 60;
const BAR_HEIGHT = 10;

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
console.assert(canvas != null, "Canvas was not found in DOM");

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
canvas.style.border = "1px solid black";

const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
console.assert(ctx != null, "2d context is not supported");

type Vec2 = {
  x: number;
  y: number;
}

type Rect = {
  pos: Vec2;
  size: Vec2;
}

type Bar = {
  pos: Vec2;
  size: Vec2;
  color: string;
}

type Bullet = {
  pos: Vec2;
  size: Vec2;
  color: string;
}

type Target = {
  pos: Vec2;
  size: Vec2;
  color: string;
  alive: boolean;
}

function vec2(x: number, y: number): Vec2 {
  return { x, y };
}

function overlaps(a: Rect, b: Rect): boolean {
  return a.pos.x + a.size.x > b.pos.x &&
         b.pos.x + b.size.x > a.pos.x &&
         a.pos.y + a.size.y > b.pos.y &&
         b.pos.y + b.size.y > a.pos.y;
}

function createTargets(): Target[] {
  let result: Target[] = [];

  const colors = ["steelblue", "green", "yellow", "pink", "coral", "lavender", "plum"];

  const size = vec2(40, 10);
  const pad = 5;

  let x = size.x + pad * 2;
  let y = 5;

  let rows = Math.floor(GAME_WIDTH / (size.x + pad * 2)) - 2;

  for (let i = 0; i <= rows; i++) {
    const t: Target = {
      pos: vec2(x, y),
      color: colors.at(Math.floor(Math.random() * colors.length))!,
      alive: true,
      size
    };

    console.assert(t.color != undefined, "Generated index is out of range");

    result.push(t);

    x += size.x + 5;
  }

  x = pad;
  y = 5 + size.y + pad;

  rows = Math.floor(GAME_WIDTH / (size.x + pad * 2));

  for (let i = 0; i <= rows; i++) {
    const t: Target = {
      pos: vec2(x, y),
      color: colors.at(Math.floor(Math.random() * colors.length))!,
      alive: true,
      size
    };

    console.assert(t.color != undefined, "Generated index is out of range");

    result.push(t);

    x += size.x + 5;
  }

  x = size.x + pad * 2;
  y = 5 + size.y * 2 + pad * 2;

  rows = Math.floor(GAME_WIDTH / (size.x + pad * 2)) - 2;

  for (let i = 0; i <= rows; i++) {
    const t: Target = {
      pos: vec2(x, y),
      color: colors.at(Math.floor(Math.random() * colors.length))!,
      alive: true,
      size
    };

    console.assert(t.color != undefined, "Generated index is out of range");

    result.push(t);

    x += size.x + 5;
  }

  return result;
}

const bar: Bar = {
  pos: vec2(GAME_WIDTH / 2 - BAR_WIDTH / 2, GAME_HEIGHT - BAR_HEIGHT * 2),
  size: vec2(BAR_WIDTH, BAR_HEIGHT),
  color: "#000"
};

const bullet: Bullet = {
  pos: vec2(bar.pos.x - 5 + bar.size.x / 2, bar.pos.y - 10),
  size: vec2(10, 10),
  color: "#f00"
};

const targets: Target[] = createTargets();

let left = false;
let right = false;
let bar_dx = 0;
let bullet_dx = 1;
let bullet_dy = -1;

let prevTimestamp = 0;
function gameLoop(timestamp: number) {
  const dt = (timestamp - prevTimestamp) * 0.001;
  console.assert(dt > 0);
  prevTimestamp = timestamp;

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Update
  bar_dx = 0;
  if (left) bar_dx += -1;
  if (right) bar_dx += 1;

  bar.pos.x += 250 * bar_dx * dt;

  if (bar.pos.x + bar.size.x > GAME_WIDTH) {
    bar.pos.x = GAME_WIDTH - bar.size.x;
  } else if (bar.pos.x < 0) {
    bar.pos.x = 0;
  }

  if (bullet.pos.x + bullet.size.x > GAME_WIDTH || bullet.pos.x < 0) {
    bullet_dx *= -1;
  }

  if (bullet.pos.y < 0 || bullet.pos.y + bullet.size.y > GAME_HEIGHT) {
    bullet_dy *= -1;
  }

  if (overlaps(bullet, bar)) {
    bullet_dy *= -1;
    if (bar_dx !== 0) {
      bullet_dx = bar_dx;
    }
  }

  bullet.pos.x += bullet_dx * 180 * dt;
  bullet.pos.y += bullet_dy * 180 * dt;

  for (const t of targets) {
    if (t.alive) {
      if (overlaps(bullet, t)) {
        t.alive = false;
        bullet_dy *= -1;
      }
    }
  }

  // Draw
  {
    const { pos, size, color } = bar;
    ctx.fillStyle = color;
    ctx.fillRect(pos.x, pos.y, size.x, size.y);
  }

  {
    const { pos, size, color } = bullet;
    ctx.fillStyle = color;
    ctx.fillRect(pos.x, pos.y, size.x, size.y);
  }

  for (const t of targets) {
    if (t.alive) {
      const { pos, size, color } = t;
      ctx.fillStyle = color;
      ctx.fillRect(pos.x, pos.y, size.x, size.y);
    }
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

document.addEventListener("keydown", (e: KeyboardEvent) => {
  switch (e.code) {
    case "KeyD":
    case "ArrowRight":
      right = true;
      break;

    case "KeyA":
    case "ArrowLeft":
      left = true;
      break;

    case "Space":
      break;

    default: break;
  }
});

document.addEventListener("keyup", (e: KeyboardEvent) => {
  switch (e.code) {
    case "KeyD":
    case "ArrowRight":
      right = false;
      break;

    case "KeyA":
    case "ArrowLeft":
      left = false;
      break;

    default: break;
  }
});

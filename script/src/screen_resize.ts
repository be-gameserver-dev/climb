// screen_resize.ts
"use strict";

const canvas = document.getElementById("screen") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
ctx.imageSmoothingEnabled = false;

const SCREEN_SIZE_X = 15;
const SCREEN_SIZE_Y = 12;
const TILE_SIZE = 22;

function resizeCanvas(): void {
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    // 가로/세로 비율 계산
    const scaleX = winW / (SCREEN_SIZE_X * TILE_SIZE);
    const scaleY = winH / (SCREEN_SIZE_Y * TILE_SIZE);

    // 최소 배율 0 이상, 소수 배율도 허용하여 화면에 맞춤
    const scale = Math.min(scaleX, scaleY);

    canvas.width = Math.floor(SCREEN_SIZE_X * TILE_SIZE * scale);
    canvas.height = Math.floor(SCREEN_SIZE_Y * TILE_SIZE * scale);
}

// 최초 1회 + 리사이즈 대응
window.addEventListener("resize", resizeCanvas);
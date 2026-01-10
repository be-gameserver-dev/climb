"use strict";
const canvas = document.getElementById("screen");
const SCREEN_SIZE_X = 15;
const SCREEN_SIZE_Y = 12;
const TILE_SIZE = 22;
function resizeCanvas() {
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const scaleX = winW / (SCREEN_SIZE_X * TILE_SIZE);
    const scaleY = winH / (SCREEN_SIZE_Y * TILE_SIZE);
    const scale = Math.min(scaleX, scaleY);
    canvas.width = Math.floor(SCREEN_SIZE_X * TILE_SIZE * scale);
    canvas.height = Math.floor(SCREEN_SIZE_Y * TILE_SIZE * scale);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

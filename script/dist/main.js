import { BG_tile_imgs, DrawTile, clearScreen, Dialog_tile_imgs, addText, removeText, replaceText, drawTexts, applyRenderState } from "./render.js";
import { Map } from "./map.js";
import { Player } from "./player.js";
console.clear();
const gameSetting = {
    boostmode: false
};
const player = new Player();
const camera = { x: 0, y: 0 };
const map = new Map();
function drawMap(camera, mapdata, Xoffset = 0, Yoffset = 0) {
    for (const [y, Ydata] of Object.entries(mapdata)) {
        const numY = parseInt(y, 16);
        if (numY > 12)
            continue;
        for (let x = camera.x - 7; x <= camera.x + 7; x++) {
            const tile = Ydata[x];
            if (typeof tile === "number") {
                DrawTile(BG_tile_imgs[tile], x + Xoffset, numY + Yoffset);
            }
            else if (tile !== null && typeof tile === "object") {
                const id = tile.id;
                const xflip = tile.xflip;
                const yflip = tile.yflip;
                if (typeof id !== "number")
                    continue;
                DrawTile(BG_tile_imgs[id], x + Xoffset, numY + Yoffset, xflip, yflip);
            }
            else if (typeof tile == "string") {
                if (tile == "path") {
                    DrawTile(BG_tile_imgs[274], x + Xoffset, numY + Yoffset);
                }
            }
        }
    }
}
function drawDialog(type = "base") {
    let dialogdata;
    const base = {
        "8": [10, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 10],
        "9": [10, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 5, 10],
        "A": [10, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 5, 10],
        "B": [10, 2, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 3, 10]
    };
    const setting = {};
    const charSelect = {};
    if (type == "base")
        dialogdata = base;
    else if (type == "setting")
        dialogdata = setting;
    else if (type == "charSelect")
        dialogdata = charSelect;
    else
        return;
    for (const [y, Ydata] of Object.entries(dialogdata)) {
        const numY = parseInt(y, 16);
        if (numY > 12)
            continue;
        Ydata.forEach((value, index) => {
            DrawTile(Dialog_tile_imgs[value], index - 7, numY);
        });
    }
}
let dialogScoremodel = "0 4 4 4 1 #n 2 6 6 6 3";
let lastTime = performance.now();
let base_start_uuid = addText(`   [시작]`, -5, 8.9, 0.65);
let base_char_uuid = addText(`   [캐릭터]`, -5, 9.7, 0.65);
let base_setting_uuid = addText(`   [설정]`, -5, 10.5, 0.65);
let score_uuid = addText('Score : N/A', 4, -10, 0.65);
let select = "start";
let screen_type = "base";
let gameStartAnimated = false;
let dialogEndY = 0.5;
let dialogScoreYpos = -10;
let renderAcc = 0;
function start() {
    screen_type = "gameStart";
    map.update(player.start(map.data, camera) || camera);
    gameStartAnimated = true;
    removeText(base_start_uuid);
    removeText(base_char_uuid);
    removeText(base_setting_uuid);
}
function ArrowUp() {
    switch (screen_type) {
        case "base":
            switch (select) {
                case "start":
                    select = "setting";
                    break;
                case "char":
                    select = "start";
                    break;
                case "setting":
                    select = "char";
                    break;
            }
            break;
        default: return;
    }
}
function ArrowDown() {
    switch (screen_type) {
        case "base":
            switch (select) {
                case "start":
                    select = "char";
                    break;
                case "char":
                    select = "setting";
                    break;
                case "setting":
                    select = "start";
                    break;
                default: return;
            }
            break;
        default: return;
    }
}
function ArrowLeft() { }
function ArrowRight() { }
function Enter() {
    switch (screen_type) {
        case "base":
            switch (select) {
                case "start":
                    start();
                    break;
                default: return;
            }
            break;
        default: return;
    }
}
function onKeyDown(event) {
    switch (event.key) {
        case "ArrowUp":
            ArrowUp();
            break;
        case "ArrowDown":
            ArrowDown();
            break;
        case "ArrowLeft":
            ArrowLeft();
            break;
        case "ArrowRight":
            ArrowRight();
            break;
        case "z":
        case "Enter":
            Enter();
            break;
    }
}
window.addEventListener("keydown", onKeyDown);
function gameLoop(time) {
    requestAnimationFrame(gameLoop);
    const dt = (time - lastTime) / 1000;
    lastTime = time;
    if (gameStartAnimated) {
        const lerpSpeed = 0.05;
        dialogScoreYpos += (dialogEndY - dialogScoreYpos) * lerpSpeed;
        if (Math.abs(dialogEndY - dialogScoreYpos) < 0.01) {
            dialogScoreYpos = dialogEndY;
            gameStartAnimated = false;
        }
    }
    const targetFPS = gameSetting.boostmode ? 60 : 30;
    renderAcc += dt;
    const frameTime = 1 / targetFPS;
    if (renderAcc < frameTime)
        return;
    renderAcc -= frameTime;
    clearScreen();
    applyRenderState();
    drawMap(camera, map.data);
    player.CharacterDraw();
    const submodel = dialogScoremodel.split(" ");
    let xoffset = 0;
    let yoffset = 0;
    submodel.forEach((value) => {
        if (value.slice(0, 1) === "#") {
            if (value.slice(1, 2) === "n") {
                xoffset = 0;
                yoffset += 1;
            }
        }
        else {
            const idx = parseInt(value);
            DrawTile(Dialog_tile_imgs[idx], 3 + xoffset, dialogScoreYpos + yoffset);
            xoffset += 1;
        }
    });
    if (!player.is_start) {
        drawDialog();
        switch (screen_type) {
            case "base":
                switch (select) {
                    case "start":
                        DrawTile(Dialog_tile_imgs[9], -5.3, 8.7);
                        break;
                    case "char":
                        DrawTile(Dialog_tile_imgs[9], -5.3, 9.5);
                        break;
                    case "setting":
                        DrawTile(Dialog_tile_imgs[9], -5.3, 10.3);
                        break;
                }
                break;
            default: return;
        }
    }
    replaceText(score_uuid, `Score : ${player.height}`, 3.85, dialogScoreYpos + 0.75, 0.5);
    drawTexts();
}
requestAnimationFrame(gameLoop);

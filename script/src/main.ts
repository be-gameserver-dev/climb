// main.ts
import { Map, MapData } from "./map.js";
import { Player } from "./player.js";
import { DrawTile, BG_tile_imgs, Dialog_tile_imgs, clearScreen,
    drawTexts, applyRenderState, addText, removeText, replaceText,
    drawModel } from "./render.js";

console.clear()

// 디버그 모드
let debug_mode = {
    enabled : true,
};

(globalThis as any).debug_mode = debug_mode;
Object.seal(debug_mode);

/** 카메라 타입 */
interface Camera {
    x:number;
    y:number;
}

/** 게임 설정 */
const gameSetting:{[key:string]:boolean|string|number} = {
    boostmode :false,
};

// 플레이어 생성
const player: Player = new Player();

// 카메라 생성
const camera:Camera = {x:0,y:0};

// 맵 생성
const map: Map = new Map();

/** 맵 그리기 */
function drawMap(camera:Camera,
    mapdata:MapData,
    Xoffset:number = 0,
    Yoffset:number = 0): void {
    for (const [y,Ydata] of Object.entries(mapdata)) {
        const numY = parseInt(y,16); 
        if (numY > 12) continue;
        for (let x = camera.x-8; x<= camera.x+8; x++) {
            const tile = Ydata[x];

            if (typeof tile === "number") {
                DrawTile(BG_tile_imgs[tile],x+Xoffset,numY+Yoffset)
            } else if (tile !== null && typeof tile === "object"){
                const id = tile.id;
                const xflip = tile.xflip;
                const yflip = tile.yflip;
                if (typeof id !== "number") continue
                DrawTile(BG_tile_imgs[id],x+Xoffset,numY+Yoffset,xflip,yflip)
            } else if (typeof tile == "string"){
                if (tile == "path") {
                    DrawTile(BG_tile_imgs[274],x+Xoffset,numY+Yoffset)
                }
            }
        }
    }
}

export function map_animation(dir:string):void{
    const off = 1;
    switch (dir) {
        case "up":
            map_offsetY -= off;
            break;
        case "down":
            map_offsetY += off;
            break;
        case "left":
            map_offsetX -= off;
            break; 
        case "right":
            map_offsetX += off;
            break;
        default:return;
    }
}

/** 대화창 그리기 */
function drawDialog(type:"base" | "setting" | "charSelect" = "base"):void{
    let model:string
    let offsetx = 0
    let offsety = 0

    const base_model = `
    10 0 #r11 4 1 10 #n
    10 7 #r11 8 5 10 #n
    10 7 #r11 8 5 10 #n
    10 2 #r11 6 3 10`;

    // 추가 예정
    const setting_model = ``;
    const charSelect_model = ``;

    switch (type) {
        case "base":
            model = base_model;
            offsetx = -7;
            offsety = 8;
            break;
        case "setting":
            model = setting_model;
            break;
        case "charSelect":
            model = charSelect_model;
            break;
        default: return;
    }

    drawModel(Dialog_tile_imgs,model,offsetx,offsety);
}

let dialogScoremodel = "0 #r4 4 1 #n 2 #r4 6 3"

//=============== 게임로직================

let lastTime = performance.now();

let text_base_start_uuid = addText(`   [시작]`,-5,8.9,0.65);
let text_base_char_uuid = addText(`   [캐릭터]`,-5,9.7,0.65);
let text_base_setting_uuid = addText(`   [설정]`,-5,10.5,0.65);
let text_score_uuid = addText('Score : N/A',2.85,-10,0.65)

let select:"start"|"char"|"setting" = "start";
let screen_type:string = "base";
let gameStartAnimated = false;
let dialogEndY = 0.5;
let dialogScoreYpos = -10;
let renderAcc = 0;

let map_animation_dir = "up";
let map_offsetX = 0;
let map_offsetY = 0;
let map_animation_speed = 0.1;

function start():void{
    screen_type = "gameStart";
    map.update(player.start(map.data,camera) || camera);
    gameStartAnimated = true;
    removeText(text_base_start_uuid);
    removeText(text_base_char_uuid);
    removeText(text_base_setting_uuid);
}

function ArrowUp():void{
    switch (screen_type) {
        case "base":
            switch (select) {
                case "start":select = "setting";break;
                case "char":select = "start";break;
                case "setting":select = "char";break;
            } 
            break;
        case "gameStart":
            map.update(player.move(map.data,camera,"North") || camera);
            map_animation("down");
            break;
        default:return;
    }
}

function ArrowDown():void{
    switch (screen_type) {
        case "base":
            switch (select) {
                case "start":select = "char";break;
                case "char":select = "setting";break;
                case "setting":select = "start";break;
                default:return;
            } 
            break;
        default:return;
    }
}

function ArrowLeft():void{}

function ArrowRight():void{}

function Enter():void{
    switch (screen_type) {
        case "base":
            switch (select) {
                case "start": start();break;
                default:return;
            } 
            break;
        default:return;
    }
}

function onKeyDown(event:KeyboardEvent){
    switch (event.key) {
        case "ArrowUp":ArrowUp();break;
        case "ArrowDown":ArrowDown();break;
        case "ArrowLeft":ArrowLeft();break;
        case "ArrowRight":ArrowRight();break;
        case "z": case "Enter":Enter();break;
    }

    // 디버그모드 키
    if (!debug_mode.enabled) return;
    switch (event.key) {
        case "n":map.newline(camera.x);map_animation("up");break;
    }
}

window.addEventListener("keydown",onKeyDown)

/** 게임 루프 */
function gameLoop(time: number) {
    requestAnimationFrame(gameLoop);
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    // 게임 연산

    if (map_offsetX > 0) {
        map_offsetX -= map_animation_speed;
        if (map_offsetX < 0) map_offsetX = 0;
    } else if (map_offsetX < 0) {
        map_offsetX += map_animation_speed;
        if (map_offsetX > 0) map_offsetX = 0;
    }
    if (map_offsetY > 0) {
        map_offsetY -= map_animation_speed;
        if (map_offsetY < 0) map_offsetY = 0;
    } else if (map_offsetY < 0) {
        map_offsetY += map_animation_speed;
        if (map_offsetY > 0) map_offsetY = 0;
    }

    if (gameStartAnimated) {
        const lerpSpeed = 0.05;
        dialogScoreYpos += (dialogEndY - dialogScoreYpos) * lerpSpeed;
        if (Math.abs(dialogEndY - dialogScoreYpos) < 0.01) {
            dialogScoreYpos = dialogEndY;
            gameStartAnimated = false;
        }
    }

    // FPS 제어
    const targetFPS = gameSetting.boostmode ? 60 : 30; // 부스트 모드시 60FPS, 아닐때 30FPS
    renderAcc += dt;
    const frameTime = 1 / targetFPS;
    if (renderAcc < frameTime) return;
    renderAcc -= frameTime;

    // 게임 화면

    clearScreen();

    applyRenderState()

    drawMap(camera, map.data, map_offsetX, map_offsetY);

    player.CharacterDraw();

    drawModel(Dialog_tile_imgs,dialogScoremodel,2,dialogScoreYpos)

    if (!player.is_start) {
        drawDialog();
        switch (screen_type) {
            case "base":
                switch (select){
                    case "start":DrawTile(Dialog_tile_imgs[9],-5.3,8.7);break;
                    case "char":DrawTile(Dialog_tile_imgs[9],-5.3,9.5);break;
                    case "setting":DrawTile(Dialog_tile_imgs[9],-5.3,10.3);break;
                }
                break;
            default:return
        }
    }

    replaceText(text_score_uuid,`Score : ${player.height}`,2.85,dialogScoreYpos+0.75,0.5)

    drawTexts();

}

requestAnimationFrame(gameLoop);

resizeCanvas();
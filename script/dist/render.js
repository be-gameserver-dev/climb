const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
export const SCREEN_SIZE_X = 15;
export const SCREEN_SIZE_Y = 12;
export const TILE_SIZE = 22;
export function GetTilePos(x, y) {
    const TILE_W = canvas.width / SCREEN_SIZE_X;
    const TILE_H = canvas.height / SCREEN_SIZE_Y;
    const centerX = Math.floor(TILE_W * 7);
    return {
        x: Math.ceil(centerX + x * TILE_W),
        y: Math.ceil(y * TILE_H),
        w: Math.ceil(TILE_W),
        h: Math.ceil(TILE_H)
    };
}
export const BG_tile_imgs = { isLoaded: false };
export const Char_tile_imgs = { isLoaded: false };
export const Dialog_tile_imgs = { isLoaded: false };
const BGimg = new Image();
BGimg.src = "./Assets/Image/BG.png";
const Dialogimg = new Image();
Dialogimg.src = "./Assets/Image/dialog.png";
const Charimg_cup = new Image();
const Charimg_kris = new Image();
function createTile(img, sx, sy, sw, sh, scale = 1) {
    const tile = document.createElement("canvas");
    tile.width = Math.round(sw * scale);
    tile.height = Math.round(sh * scale);
    const tctx = tile.getContext("2d");
    tctx.imageSmoothingEnabled = false;
    tctx.drawImage(img, Math.round(sx), Math.round(sy), Math.round(sw), Math.round(sh), 0, 0, tile.width, tile.height);
    return tile;
}
function OnImageLoad(img, dic, nx, ny, startingIndex = 0) {
    let index = startingIndex;
    for (let y = 0; y < ny; y++) {
        for (let x = 0; x < nx; x++) {
            dic[index++] = createTile(img, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
}
BGimg.onload = () => {
    OnImageLoad(BGimg, BG_tile_imgs, 24, 25);
    BG_tile_imgs.isLoaded = true;
};
Dialogimg.onload = () => {
    OnImageLoad(Dialogimg, Dialog_tile_imgs, 4, 3);
    Dialog_tile_imgs.isLoaded = true;
};
Charimg_cup.onload = () => {
    OnImageLoad(Charimg_cup, Char_tile_imgs, 8, 2);
    Charimg_kris.onload = () => {
        OnImageLoad(Charimg_kris, Char_tile_imgs, 8, 3, Object.keys(Char_tile_imgs).length - 1);
        Char_tile_imgs.isLoaded = true;
    };
    Charimg_kris.src = "./Assets/Image/kris.png";
};
Charimg_cup.src = "./Assets/Image/cuptain.png";
export function clearScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
export function DrawTile(img, x, y, flipX = false, flipY = false) {
    if (!img)
        return;
    const t = GetTilePos(x, y);
    ctx.save();
    ctx.translate(t.x + t.w / 2, t.y + t.h / 2);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, -t.w / 2, -t.h / 2, t.w, t.h);
    ctx.restore();
}
const texts = new Map();
function createUUID() {
    return crypto.randomUUID();
}
function getTileSize() {
    return Math.floor(canvas.width / SCREEN_SIZE_X);
}
function getFontSize(scale) {
    return Math.max(1, Math.floor(getTileSize() * scale));
}
export function applyRenderState() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
}
async function startFontSystem() {
    await document.fonts.ready;
}
startFontSystem();
export function addText(text, x, y, scale = 1) {
    const id = createUUID();
    texts.set(id, { id, text, x, y, scale });
    return id;
}
export function removeText(uuid) {
    texts.delete(uuid);
}
export function replaceText(uuid, text, x, y, scale) {
    const item = texts.get(uuid);
    if (!item)
        return;
    item.text = text;
    item.x = x;
    item.y = y;
    if (scale !== undefined)
        item.scale = scale;
}
export function drawTexts() {
    if (texts.size === 0)
        return;
    for (const item of texts.values()) {
        const t = GetTilePos(item.x, item.y);
        const fontSize = getFontSize(item.scale);
        ctx.font = `${fontSize}px Font`;
        ctx.fillText(item.text, Math.floor(t.x), Math.floor(t.y));
    }
}

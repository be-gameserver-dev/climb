// render.ts
const canvas = document.getElementById("screen") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
ctx.imageSmoothingEnabled = false;

const SCREEN_SIZE_X = 15;
const SCREEN_SIZE_Y = 12;
const TILE_SIZE = 22;

export interface TilePos {
    x: number;
    y: number;
    w: number;
    h: number;
}

export function GetTilePos(x: number, y: number): TilePos {
    const TILE_W = canvas.width / SCREEN_SIZE_X;
    const TILE_H = canvas.height / SCREEN_SIZE_Y;

    const centerX = Math.floor(TILE_W*7);

    return {
        x: Math.ceil(centerX + x * TILE_W),
        y: Math.ceil(y * TILE_H),
        w: Math.ceil(TILE_W),
        h: Math.ceil(TILE_H)
    };
}

type tile_imgs = { [key: number]: HTMLCanvasElement; isLoaded: boolean };
export const BG_tile_imgs: tile_imgs = { isLoaded: false };
export const Char_tile_imgs: tile_imgs = { isLoaded: false };
export const Dialog_tile_imgs: tile_imgs = { isLoaded: false };

export const BGimg = new Image();
BGimg.src = "./Assets/Image/BG.png";

export const Dialogimg = new Image();
Dialogimg.src = "./Assets/Image/dialog.png";

const Charimg_cup = new Image();

const Charimg_kris = new Image();


/** 캔버스 타일 생성 함수 */
function createTile(img: HTMLImageElement, sx: number, sy: number, sw: number, sh: number, scale: number = 1): HTMLCanvasElement {
    const tile = document.createElement("canvas");
    tile.width = Math.round(sw * scale);
    tile.height = Math.round(sh * scale);

    const tctx = tile.getContext("2d")!;
    tctx.imageSmoothingEnabled = false;
    tctx.drawImage(
        img,
        Math.round(sx),
        Math.round(sy),
        Math.round(sw),
        Math.round(sh),
        0,
        0,
        tile.width,
        tile.height
    );

    return tile;
}

/** 타일 로드 */
function OnImageLoad(
    img: HTMLImageElement,
    dic: { [key: number]: HTMLCanvasElement },
    nx: number,
    ny: number,
    startingIndex: number = 0
): void {
    let index = startingIndex;

    for (let y = 0; y < ny; y++) {
        for (let x = 0; x < nx; x++) {
            dic[index++] = createTile(
                img,
                x * TILE_SIZE,
                y * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
            );
        }
    }
}


/** 배경 타일 로드 */
BGimg.onload = () => {
    OnImageLoad(BGimg,BG_tile_imgs,24,25)
    BG_tile_imgs.isLoaded = true;
};

Dialogimg.onload = () => {
    OnImageLoad(Dialogimg,Dialog_tile_imgs,4,3);
    Dialog_tile_imgs.isLoaded = true;
}

/** 캐릭터 타일 로드 */
Charimg_cup.onload = () => {
    OnImageLoad(Charimg_cup,Char_tile_imgs,8,2)
    Charimg_kris.onload = () => {
        OnImageLoad(Charimg_kris,Char_tile_imgs,8,3,Object.keys(Char_tile_imgs).length-1)
        Char_tile_imgs.isLoaded = true
    }
    Charimg_kris.src = "./Assets/Image/kris.png";
};

Charimg_cup.src = "./Assets/Image/cuptain.png";

/** 스크린 초기화 */
export function clearScreen(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/** 타일 그리기 */
export function DrawTile(
    img: HTMLCanvasElement | null,
    x: number,
    y: number,
    flipX = false,
    flipY = false
): void {
    if (!img) return;

    const t = GetTilePos(x, y);

    ctx.save();
    ctx.translate(
        t.x + t.w / 2,
        t.y + t.h / 2
    );
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
        img,
        -t.w / 2,
        -t.h / 2,
        t.w,
        t.h
    );

    ctx.restore();
}

export function drawModel(tile: tile_imgs, model: string, x: number, y: number): void {
    const submodel = model.replace(/[\r\n]/g, " ").trim().split(/\s+/);

    let xo = 0, yo = 0;
    let xoffset = 0, yoffset = 0;
    let flipX = false, flipY = false;
    let repeat = 1;

    function execToken(value: string): void {
        if (value[0] === "#") {
            const cmd = value.slice(1);

            if (cmd === "n") {
                xoffset = 0;
                yoffset += 1;
            }
            else if (cmd.startsWith("xo")) xo = parseFloat(cmd.slice(2));
            else if (cmd.startsWith("yo")) yo = parseFloat(cmd.slice(2));
            else if (cmd === "fx") flipX = !flipX;
            else if (cmd === "fy") flipY = !flipY;

            return;
        }

        const idx = Number(value);
        if (!Number.isInteger(idx) || tile[idx] == null) return;

        DrawTile(
            tile[idx],
            x + xoffset + xo,
            y + yoffset + yo,
            flipX,
            flipY
        );

        xoffset += 1;
    }

    for (const value of submodel) {
        if (value[0] === "#") {
            const cmd = value.slice(1);
            if (cmd.startsWith("r")) {
                const n = Number(cmd.slice(1));
                if (Number.isInteger(n) && n > 0) repeat = n;
                continue;
            }
        }

        for (let i = 0; i < repeat; i++) {
            execToken(value);
        }

        repeat = 1;
    }
}


//------------------font-------------------

export interface TextItem {
    id: string;
    text: string;
    x: number;      // 타일 좌표
    y: number;      // 타일 좌표
    scale: number;  // 1 = 타일 1칸 높이
}

export const texts: Map<string, TextItem> = new Map();

export function createUUID(): string {
    return crypto.randomUUID();
}

export function getTileSize(): number {
    return Math.floor(canvas.width / SCREEN_SIZE_X);
}

export function getFontSize(scale: number): number {
    return Math.max(1, Math.floor(getTileSize() * scale));
}

export function applyRenderState(): void {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
}

export async function startFontSystem(): Promise<void> {
    await document.fonts.ready;
}

startFontSystem();

export function addText(
    text: string,
    x: number,
    y: number,
    scale: number = 1
): string {
    const id = createUUID();
    texts.set(id, { id, text, x, y, scale });
    return id;
}

export function removeText(uuid: string): void {
    texts.delete(uuid);
}

export function replaceText(
    uuid: string,
    text: string,
    x: number,
    y: number,
    scale?: number
): void {
    const item = texts.get(uuid);
    if (!item) return;

    item.text = text;
    item.x = x;
    item.y = y;
    if (scale !== undefined) item.scale = scale;
}

export function drawTexts(): void {
    if (texts.size === 0) return;

    for (const item of texts.values()) {
        const t = GetTilePos(item.x, item.y);
        const fontSize = getFontSize(item.scale);

        // ★ CSS @font-face 와 정확히 동일해야 함
        ctx.font = `${fontSize}px Font`;

        ctx.fillText(
            item.text,
            Math.floor(t.x),
            Math.floor(t.y)
        );
    }
}
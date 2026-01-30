// map.ts

/** Mulberry32 PRNG 타입 */
type RandomGenerator = (input?: number) => number;

/** Mulberry32 PRNG */
function SeededRandom(seed: number | string | null = null): RandomGenerator {
    // 초기 상태 설정
    let state: number;
    if (seed === null) {
        const a = new Uint32Array(1);
        crypto.getRandomValues(a);
        state = a[0];
    } else if (typeof seed === "number") {
        state = seed >>> 0;
    } else {
        let h = 2166136261;
        const str = String(seed);
        for (let i = 0; i < str.length; i++) {
            h ^= str.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        state = h >>> 0;
    }

    // 상태 기반 연속 난수
    function next(): number {
        state += 0x6D2B79F5;
        let r = Math.imul(state ^ (state >>> 15), 1 | state);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    }

    return (input?: number): number => {
        if (input === undefined) return next(); // 연속 난수
        // 입력값 기반 고정 난수
        let val = state ^ input;
        val = Math.imul(val ^ (val >>> 15), 1 | val);
        val ^= val + Math.imul(val ^ (val >>> 7), 61 | val);
        return ((val ^ (val >>> 14)) >>> 0) / 4294967296;
    };
}

/** y 좌표를 key로 변환 */
function yToKey(y: number): string {
    return y.toString(16).toUpperCase();
}

/** 맵 데이터 한 줄을 아래로 한 칸씩 밀기 */
function shiftobj(obj: Record<string, any>): void {
    for (let y = 0x1F; y >= 0; y--) {
        const key = yToKey(y);
        const prevKey = yToKey(y - 1);

        if (y === 0) {
            obj[key] = {}; // 또는 null
        } else {
            obj[key] = obj[prevKey];
        }
    }
}


/** 타일 flip 정보 */
export interface TileFlip {
    id: number;
    xflip?: boolean;
    yflip?: boolean;
}

/** 타일 데이터 타입 */
export type TileData = number | TileFlip | string | null;

/** 한 줄(y)의 맵 데이터 */
export type MapLine = Record<number, TileData>;

/** 전체 맵 데이터 형식*/
export type MapData = Record<string, MapLine>;

// 초기 로비 데이터 (나중에 모델 형식으로 변환)
export const LobbyMapData: MapData = {
    "0": { "-7": 0, "-6": 0, "-5": 0, "-4": 0, "-3": 0, "-2": 0, "-1": 271, "0": 273, "1": 271, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0 },
    "1": { "-7": 0, "-6": 0, "-5": 0, "-4": 0, "-3": 0, "-2": 0, "-1": 271, "0": 273, "1": 271, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0 },
    "2": { "-7": 0, "-6": 0, "-5": 0, "-4": 0, "-3": 0, "-2": 0, "-1": 271, "0": 273, "1": 271, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0 },
    "3": { "-7": 0, "-6": 0, "-5": 0, "-4": 0, "-3": 0, "-2": 0, "-1": 271, "0": 273, "1": 271, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0 },
    "4": { "-7": 0, "-6": 0, "-5": 412, "-4": 412, "-3": 412, "-2": 412, "-1": 271, "0": 273, "1": 271, "2": 412, "3": 412, "4": 412, "5": 412, "6": 0, "7": 0 },
    "5": { "-7": 0, "-6": 134, "-5": { id: 72, xflip: true }, "-4": 72, "-3": { id: 72, xflip: true }, "-2": 72, "-1": 93, "0": 94, "1": 95, "2": { id: 72, xflip: true }, "3": 72, "4": { id: 72, xflip: true }, "5": 72, "6": 133, "7": 0 },
    "6": { "-7": 134, "-6": 140, "-5": { id: 72, xflip: true, yflip: true }, "-4": { id: 72, yflip: true }, "-3": { id: 72, xflip: true, yflip: true }, "-2": { id: 72, yflip: true }, "-1": 201, "0": 202, "1": 203, "2": { id: 72, xflip: true, yflip: true }, "3": { id: 72, yflip: true }, "4": { id: 72, xflip: true, yflip: true }, "5": { id: 72, yflip: true }, "6": 139, "7": 133 },
    "7": { "-7": 140, "-6": 146, "-5": 84, "-4": 84, "-3": 84, "-2": 84, "-1": 207, "0": 208, "1": 209, "2": 84, "3": 84, "4": 84, "5": 84, "6": 145, "7": 139 },
    "8": { "-7": 146, "-6": 127, "-5": 0, "-4": 0, "-3": 0, "-2": 0, "-1": 117, "0": 118, "1": 119, "2": 0, "3": 0, "4": 0, "5": 0, "6": 121, "7": 145 },
    "9": { "-7": 127, "-6": 0, "-5": 0, "-4": 0, "-3": 0, "-2": 0, "-1": 0, "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 121 },
    "A": { "-7": 0, "-6": 0, "-5": 0, "-4": 0, "-3": 0, "-2": 0, "-1": 0, "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0 },
    "B": { "-7": 0, "-6": 0, "-5": 0, "-4": 0, "-3": 0, "-2": 0, "-1": 0, "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0 }
};

/** 카메라 타입 */
export interface Camera {
    x:number;
    y:number;
}

/** 맵 클래스 */
export class Map {
    private MainRandom: RandomGenerator;
    private XRandoms: Record<string,RandomGenerator>;
    public data: MapData;

    constructor(seed: number | string | null = null) {
        this.MainRandom = SeededRandom(seed);
        this.XRandoms = {};

        for (let key = 0; key < 32; key++){
            this.XRandoms[yToKey(key)] = SeededRandom(this.MainRandom());
        };

        this.data = JSON.parse(JSON.stringify(LobbyMapData)) as MapData;
    }

    private generateLine(cameraX: number, key: string): MapLine {
        const line = this.data[key];
        for (let x = cameraX - 7; x <= cameraX + 7; x++) {
            const random = this.XRandoms[key];
            const tile = random();
            line[x] = 273;
            // TODO: 타일 생성 로직 구현
        }
        console.log(line);
        return line;
    }

    // map.ts
    public newline(cameraX: number): void {
        // 1. 로비 데이터 밀기
        shiftobj(LobbyMapData);

        // 2. 맵 데이터 밀기
        shiftobj(this.data);

        // 3. XRandoms도 같이 밀기
        shiftobj(this.XRandoms);

        // 4. 새 랜덤 시드 생성 (맨 위)
        this.XRandoms["0"] = SeededRandom(this.MainRandom());

        // 5. 새 줄 생성
        this.data["0"] = this.generateLine(cameraX, "0");

        // 6. 로비 데이터가 있으면 덮어쓰기
        for (let y = 0; y < SCREEN_SIZE_Y; y++) {
            const key = yToKey(y);
            if (LobbyMapData[key] === undefined && Object.keys(LobbyMapData[key]).length === 0) continue;
            this.data[key] = { ...this.data[key], ...LobbyMapData[key] };
        }
    }


    update(camera: Camera): void {
        // TODO: 카메라 위치에 따라 맵 데이터 업데이트 로직 구현
    }
}
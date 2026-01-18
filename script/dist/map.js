function SeededRandom(seed = null) {
    let state;
    if (seed === null) {
        const a = new Uint32Array(1);
        crypto.getRandomValues(a);
        state = a[0];
    }
    else if (typeof seed === "number") {
        state = seed >>> 0;
    }
    else {
        let h = 2166136261;
        const str = String(seed);
        for (let i = 0; i < str.length; i++) {
            h ^= str.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        state = h >>> 0;
    }
    function next() {
        state += 0x6D2B79F5;
        let r = Math.imul(state ^ (state >>> 15), 1 | state);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    }
    return (input) => {
        if (input === undefined)
            return next();
        let val = state ^ input;
        val = Math.imul(val ^ (val >>> 15), 1 | val);
        val ^= val + Math.imul(val ^ (val >>> 7), 61 | val);
        return ((val ^ (val >>> 14)) >>> 0) / 4294967296;
    };
}
function yToKey(y) {
    return y.toString(16).toUpperCase();
}
function shiftobj(obj) {
    for (let y = 0x1F; y >= 0; y--) {
        const key = yToKey(y);
        const prevKey = yToKey(y - 1);
        if (y === 0) {
            obj[key] = {};
        }
        else {
            obj[key] = obj[prevKey];
        }
    }
}
export const LobbyMapData = {
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
export class Map {
    constructor(seed = null) {
        this.MainRandom = SeededRandom(seed);
        this.XRandoms = {};
        for (let key = 0; key < 32; key++) {
            this.XRandoms[yToKey(key)] = SeededRandom(this.MainRandom());
        }
        ;
        this.data = JSON.parse(JSON.stringify(LobbyMapData));
    }
    generateLine(cameraX, key) {
        const line = this.data[key];
        for (let x = cameraX - 7; x <= cameraX + 7; x++) {
            const random = this.XRandoms[key];
            const tile = random();
            line[x] = tile;
        }
        console.log(line);
        return line;
    }
    newline(cameraX) {
        shiftobj(LobbyMapData);
        shiftobj(this.data);
        shiftobj(this.XRandoms);
        this.XRandoms["0"] = SeededRandom(this.MainRandom());
        this.data["0"] = this.generateLine(cameraX, "0");
        for (let y = 0; y < SCREEN_SIZE_Y; y++) {
            const key = yToKey(y);
            if (LobbyMapData[key] === undefined && Object.keys(LobbyMapData[key]).length === 0)
                continue;
            this.data[key] = { ...this.data[key], ...LobbyMapData[key] };
        }
    }
    update(camera) {
    }
}

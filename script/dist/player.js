import { Char_tile_imgs, DrawTile } from "./render.js";
const tiles = { void: [], path: [273] };
function DrawCharacter(model, x, y) {
    const submodel = model.split(" ");
    let xo = 0;
    let yo = 0;
    let xoffset = 0;
    let yoffset = 0;
    submodel.forEach((value) => {
        if (value.slice(0, 1) === "#") {
            if (value.slice(1, 2) === "n") {
                xoffset = 0;
                yoffset += 1;
            }
            else if (value.slice(1, 3) === "xo")
                xo = parseFloat(value.slice(3));
            else if (value.slice(1, 3) === "yo")
                yo = parseFloat(value.slice(3));
            else
                return;
        }
        else {
            const idx = parseInt(value);
            DrawTile(Char_tile_imgs[idx], x + xoffset + xo, y + yoffset + yo);
            xoffset += 1;
        }
    });
}
export class Player {
    constructor(character = "cuptain", x = 0, y = 5) {
        this.character = character;
        this.x = x;
        this.y = y;
        this.height = 0;
        this.is_start = false;
        this.Basic = {
            "cuptain": {
                hp: 5,
                Model: {
                    walk: ["#xo-0.5 #yo-0.5 0 1 #n 2 3", "#xo-0.5 #yo-0.5 4 5 #n 6 7"],
                    climb: ["#xo-0.5 #yo-0.5 8 9 #n 10 11", "#xo-0.5 #yo-0.5 12 13 #n 14 15"]
                }
            },
            "kris": {
                hp: 200,
                Model: {
                    walk: ["#xo0 #yo0 16 #n 17"],
                    climb: ["#xo0 #yo0 18 19 #n 20 21", "#xo0 #yo0 22 23 #n 24 25",
                        "#xo0 #yo0 26 27 #n 28 29", "#xo0 #yo0 30 31 #n 32 33"
                    ]
                }
            },
            "susie": {
                hp: 230,
                Model: {
                    walk: [""],
                    climb: [""]
                }
            },
            "ralsei": {
                hp: 180,
                Model: {
                    walk: [""],
                    climb: [""]
                }
            }
        };
        this.hp = this.Basic[this.character].hp;
        this.model = this.Basic[this.character].Model.walk[0];
    }
    start(mapdata, camera) {
        this.is_start = true;
        this.model = this.Basic[this.character].Model.climb[0];
        return this.move(mapdata, camera);
    }
    move(mapdata, camera, dir = "North") {
        if (!this.is_start)
            return;
        const postile = mapdata[this.y.toString(16)][this.x];
        switch (dir) {
            case "North":
                const moveTile = mapdata[(this.y - 1).toString(16)][this.x];
                if (typeof moveTile == "number") {
                    if (tiles.path.includes(moveTile)) {
                        return { x: camera.x++, y: camera.y };
                    }
                }
        }
    }
    jump(mapdata, dir = "North", power = 1) {
        if (!this.is_start)
            return;
    }
    CharacterDraw() {
        DrawCharacter(this.model, this.x, this.y);
    }
}

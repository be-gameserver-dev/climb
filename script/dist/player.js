import { Char_tile_imgs, drawModel } from "./render.js";
export const tiles = { void: [], path: [273] };
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
                    base: ["#xo-0.5 #yo-0.5 0 1 #n 2 3", "#xo-0.5 #yo-0.5 4 5 #n 6 7"],
                    climb: ["#xo-0.5 #yo-0.5 8 9 #n 10 11", "#xo-0.5 #yo-0.5 12 13 #n 14 15"]
                }
            },
            "kris": {
                hp: 200,
                Model: {
                    base: ["#xo0 #yo0 16 #n 17"],
                    climb: ["#xo0 #yo0 18 19 #n 20 21", "#xo0 #yo0 22 23 #n 24 25",
                        "#xo0 #yo0 26 27 #n 28 29", "#xo0 #yo0 30 31 #n 32 33"
                    ]
                }
            },
            "susie": {
                hp: 230,
                Model: {
                    base: [""],
                    climb: [""]
                }
            },
            "ralsei": {
                hp: 180,
                Model: {
                    base: [""],
                    climb: [""]
                }
            }
        };
        this.hp = this.Basic[this.character].hp;
        this.model = this.Basic[this.character].Model.base[0];
    }
    start(mapdata, camera) {
        this.is_start = true;
        this.model = this.Basic[this.character].Model.climb[0];
        return this.move(mapdata, camera);
    }
    move(mapdata, camera, dir = "North") {
        return undefined;
    }
    jump(mapdata, dir = "North", power = 1) {
        return undefined;
    }
    CharacterDraw() {
        drawModel(Char_tile_imgs, this.model, this.x, this.y);
    }
}

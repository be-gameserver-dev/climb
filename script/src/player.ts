// player.ts
import { MapData, Camera } from "./map.js";
import { DrawTile, Char_tile_imgs, drawModel } from "./render.js";

// 이동 방향 타입
export type Direction = "North" | "South" | "East" | "West";

// 캐릭터 타입
export type Character = "cuptain" | "kris" | "susie" | "ralsei";

export const tiles = {void:[],path:[273]}

/** Player 클래스 */
export class Player {
    character: Character;
    x: number;
    y: number;
    hp: number;
    height: number;
    model: string;
    is_start: boolean;
    Basic:Record<Character,{hp:number,Model:{base:string[],climb:string[]}}>

    constructor(character: Character = "cuptain", x: number = 0, y: number = 5) {
        this.character = character;
        this.x = x;
        this.y = y;
        this.height = 0;
        this.is_start = false;

        this.Basic = {
            "cuptain" : {
                hp:5,
                Model:{
                    base:["#xo-0.5 #yo-0.5 0 1 #n 2 3","#xo-0.5 #yo-0.5 4 5 #n 6 7"],
                    climb:["#xo-0.5 #yo-0.5 8 9 #n 10 11","#xo-0.5 #yo-0.5 12 13 #n 14 15"]
                }
            },
            "kris" : {
                hp:200,
                Model:{
                    base:["#xo0 #yo0 16 #n 17"],
                    climb:["#xo0 #yo0 18 19 #n 20 21", "#xo0 #yo0 22 23 #n 24 25",
                        "#xo0 #yo0 26 27 #n 28 29", "#xo0 #yo0 30 31 #n 32 33"
                    ]
                }
            },
            "susie" : {
                hp:230,
                Model:{
                    base:[""],
                    climb:[""]
                }
            },
            "ralsei" : {
                hp:180,
                Model:{
                    base:[""],
                    climb:[""]
                }
            }
        }

        this.hp = this.Basic[this.character].hp;
        this.model = this.Basic[this.character].Model.base[0];
    }
    start(mapdata:MapData,camera:Camera):Camera|undefined{
        this.is_start = true;
        this.model = this.Basic[this.character].Model.climb[0];
        return this.move(mapdata,camera)
    }

    move(mapdata:MapData,camera:Camera,dir: Direction = "North"): Camera | undefined {
        // TODO: 이동 로직 구현
        return undefined;
    }

    jump(mapdata:MapData, dir: Direction = "North",power: number = 1): Camera | undefined {
        // TODO: 점프 로직 구현
        return undefined;
    }

    CharacterDraw(){
        drawModel(Char_tile_imgs,this.model,this.x,this.y)
    }
}
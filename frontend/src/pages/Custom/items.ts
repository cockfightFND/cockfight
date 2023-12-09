import c_classic from "../../../img/c_classic.png"
import c_nerd from "../../../img/c_nerd.png"
import c_punky from "../../../img/c_punky.png"
import c_santa from "../../../img/c_santa.png"
import egg from "../../../img/egg.png"

import rullet1 from "../../../img/cockfights/rullet1.png"
import rullet2 from "../../../img/cockfights/rullet2.png"
import price1 from "../../../img/cockfights/price1.png"
import price2 from "../../../img/cockfights/price2.png"


export const ChickenImages = {
  c_classic,
  c_nerd,
  c_punky,
  c_santa,
}

export const MainImages = {
  
}


export const EggImages = {
  egg,
}

export const GameImages = {
  rullet1,
  rullet2,
  price1,
  price2
}

export interface CockFight {
    fightId: number;
    image: string;
    name: string;
    owner: string;
    ticket: number;
    prize: number;
    isOpened: boolean;
    updateAt: Date;
}

export interface Chicken {
  id: number;
  price: number;
  image: string;
  name: string;
}

export interface Egg {
    image: string;
    price: number;
}

export const TestEgg: Egg = {
    image: egg,
    price: 100,
}


export const TestChickens: Chicken[] = [
  {
    id: 1,
    price: 100,
    image: ChickenImages.c_classic,
    name: "Classic Cock",
  },
  {
    id: 2,
    price: 200,
    image: ChickenImages.c_nerd,
    name: "Nerd Cock",
  },
  {
    id: 3,
    price: 500,
    image: ChickenImages.c_punky,
    name: "Punky Cock",
  },
  {
    id: 4,
    price: 1000,
    image: ChickenImages.c_santa,
    name: "Santa Cock",
  },
]

export const TestCockFights: CockFight[] = [
    {
      fightId: 1,
      image: GameImages.rullet1,
      name: "Funny Cassino",
      owner: "0x123456789",
      ticket: 100,
      prize: 100,
      isOpened: true,
      updateAt: new Date(),
    },
    {
      fightId: 2,
      image: GameImages.rullet2,
      name: "Russian Rullet",
      owner: "0x123456789",
      ticket: 200,
      prize: 200,
      isOpened: true,
      updateAt: new Date(),
    },
    {
      fightId: 3,
      image: GameImages.price1,
      name: "Price Prediction",
      owner: "0x123456789",
      ticket: 500,
      prize: 500,
      isOpened: true,
      updateAt: new Date(),
    },
    {
      fightId: 4,
      image: GameImages.price2,
      name: "Stock Prediction",
      owner: "0x123456789",
      ticket: 1000,
      prize: 1000,
      isOpened: true,
      updateAt: new Date(),
    },
]
   
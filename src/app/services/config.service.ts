import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  myColor: string = '#ff0000'
  enemyColor: string = '#0000ff'

  fullStamina = 40

  infantry: any = {
    hp: 100,
    armor: 0.6,
    damage: 30,
    stamina: {
      step: 3,
      rotate: 5,
      attack: 10
    },
    formation: 6,
    length: 12
  }

  mounted: any = {
    hp: 100,
    armor: 0.3,
    damage: 20,
    stamina: {
      step: 1,
      rotate: 1,
      attack: 10
    },
    formation: 4,
    length: 8
  }

  archer: any = {
    hp: 100,
    armor: 0.1,
    damage: 10,
    stamina: {
      step: 2,
      rotate: 2,
      attack: 5
    },
    formation: 5,
    length: 5
  }

  get(type: string): any {
    switch (type) {
      case 'infantry':
        return this.infantry
        break;
      case 'archer':
        return this.archer
        break;
      case 'mounted':
        return this.mounted
        break;
    }
    return null
  }

  get getMounted(): any {
    return this.mounted
  }

  get getArcher(): any {
    return this.archer
  }

  constructor() { }
}

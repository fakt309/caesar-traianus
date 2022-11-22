import { Injectable } from '@angular/core'
import { AsyncService } from '@services/async.service'
import { ConfigService } from '@services/config.service'

@Injectable({
  providedIn: 'root'
})
export class BotService {

  private display: any = null
  private displayRef: any = null

  constructor(
    private asyncService: AsyncService,
    public configService: ConfigService
  ) { }

  setDisplay(display: any, displayRef: any): void {
    this.display = display
    this.displayRef = displayRef
  }

  simulateMouseEvent(type: string, x: number, y: number): void {
    const displayRect = this.displayRef.getBoundingClientRect()
    let e = new MouseEvent(type, {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      'clientX': displayRect.x+x,
      'clientY': displayRect.y+y,
      'detail': 777
    })
    let el = document.elementFromPoint(displayRect.x+x, displayRect.y+y)
    el!.dispatchEvent(e)
  }

  simulateKeyboardEvent(code: string) {
    window.dispatchEvent(new KeyboardEvent('keydown', { code }))
  }

  checkBan(maniples: Array<any>, maniple: any): boolean {

    const rect = this.getManipleRect(maniple)

    let answer = false

    if (rect.x < 0 || rect.y < 0 || rect.x+rect.w > this.display.grid.w || rect.y+rect.h > this.display.grid.h) {
      answer = true
    }

    maniples.forEach((m: any) => {
      const mRect = this.getManipleRect(m)
      if (m.id !== maniple.id) {
        if (mRect.x+mRect.w > rect.x && mRect.x < rect.x+rect.w) {
          if (mRect.y+mRect.h > rect.y && mRect.y < rect.y+rect.h) {
            answer = true
          }
        }
      }
    })

    return answer
  }

  getManipleByCoord(maniples: Array<any>, x: number, y: number): any {
    let answer = null
    maniples.forEach((m: any) => {
      const rect = this.getManipleRect(m)
      if (x >= rect.x && x < rect.x+rect.w) {
        if (y >= rect.y && y < rect.y+rect.h) {
          answer = m
          return
        }
      }
    })
    return answer
  }

  getDirection(rect: any, x: number, y: number): 'left' | 'top' | 'bottom' | 'right' | 'center' {
    let min = this.getDistance([rect.x+rect.w/2, rect.y], [x, y])
    let test = 0
    let answer: 'left' | 'top' | 'bottom' | 'right' | 'center' = 'top'

    test = this.getDistance([rect.x+rect.w, rect.y+rect.h/2], [x, y])
    if (test < min) {
      min = test
      answer = 'right'
    }

    test = this.getDistance([rect.x+rect.w/2, rect.y+rect.h], [x, y])
    if (test < min) {
      min = test
      answer = 'bottom'
    }

    test = this.getDistance([rect.x, rect.y+rect.h/2], [x, y])
    if (test < min) {
      min = test
      answer = 'left'
    }

    test = this.getDistance([rect.x+rect.w/2, rect.y+rect.h/2], [x, y])
    if (test < min) {
      min = test
      answer = 'center'
    }

    return answer
  }

  getCenturiaFromManipleByCoord(maniple: any, x: number, y: number): { index: number | null, hp: number | null } {
    let [relX, relY] = [x-maniple.x, y-maniple.y]
    let rect = this.getManipleRect(maniple)
    let idx = -1
    let alive = 0
    maniple.hps.forEach((hp: number) => alive = hp > 0 ? alive+1 : alive)
    if (maniple.direction === 'top') {
      idx = rect.w*relY+relX
      if (relY === rect.h-1 && rect.h > 1) {
        let lastAlive = alive%rect.w === 0 ? rect.w : alive%rect.w
        idx -= Math.floor((rect.w-lastAlive)/2)
        if (idx < rect.w*relY) return { index: null, hp: null }
      }
      for (let i = 0; i <= idx; i++) {
        if (maniple.hps[i] === 0) idx++
      }
      if (maniple.hps[idx] === undefined) return { index: null, hp: null }
      return { index: idx, hp: maniple.hps[idx] }
    } else if (maniple.direction === 'right') {
      idx = (rect.w-relX-1)*rect.h+relY
      if (relX === 0 && rect.w > 1) {
        let lastAlive = alive%rect.h === 0 ? rect.h : alive%rect.h
        idx -= Math.floor((rect.h-lastAlive)/2)
        if (idx < (rect.w-relX-1)*rect.h) return { index: null, hp: null }
      }
      for (let i = 0; i <= idx; i++) {
        if (maniple.hps[i] === 0) idx++
      }
      if (maniple.hps[idx] === undefined) return { index: null, hp: null }
      return { index: idx, hp: maniple.hps[idx] }
    } else if (maniple.direction === 'bottom') {
      idx = (rect.h-relY-1)*rect.w+(rect.w-relX-1)
      if (relY === 0 && rect.h > 1) {
        let lastAlive = alive%rect.w === 0 ? rect.w : alive%rect.w
        idx -= Math.floor((rect.w-lastAlive)/2)
        if (idx < (rect.h-relY-1)*rect.w) return { index: null, hp: null }
      }
      for (let i = 0; i <= idx; i++) {
        if (maniple.hps[i] === 0) idx++
      }
      if (maniple.hps[idx] === undefined) return { index: null, hp: null }
      return { index: idx, hp: maniple.hps[idx] }
    } else if (maniple.direction === 'left') {
      idx = relX*rect.h+(rect.h-relY-1)
      if (relX === rect.w-1 && rect.w > 1) {
        let lastAlive = alive%rect.h === 0 ? rect.h : alive%rect.h
        idx -= Math.floor((rect.h-lastAlive)/2)
        if (idx < relX*rect.h) return { index: null, hp: null }
      }
      for (let i = 0; i <= idx; i++) {
        if (maniple.hps[i] === 0) idx++
      }
      if (maniple.hps[idx] === undefined) return { index: null, hp: null }
      return { index: idx, hp: maniple.hps[idx] }
    }
    return { index: null, hp: null }
  }

  getCellWidth(): number {
    const displayRect = this.displayRef.getBoundingClientRect()
    return displayRect.width/this.display.grid.w
  }

  getCellHeight(): number {
    const displayRect = this.displayRef.getBoundingClientRect()
    return displayRect.height/this.display.grid.h
  }

  getManipleRect(maniple: any): { x: number, y: number, w: number, h: number } {
    let alive = 0
    maniple.hps.forEach((hp: any) => alive = hp > 0 ? alive+1 : alive)
    let w = alive < maniple.formation ? alive : maniple.formation
    let h = Math.ceil(alive/maniple.formation)
    let [x, y] = [maniple.x, maniple.y]
    return {
      x: maniple.x,
      y: maniple.y,
      w: (maniple.direction === 'top' || maniple.direction === 'bottom') ? w : h,
      h: (maniple.direction === 'top' || maniple.direction === 'bottom') ? h : w
    }
  }

  getManipleRectRotate(maniple: any, direction: string): any {
    let rect = this.getManipleRect(maniple)
    let answer = { x: 0, y: 0, w: 0, h: 0 }

    if (maniple.direction === 'top' || maniple.direction === 'bottom') {
      if (direction === 'right' || direction === 'left') {
        answer.x = maniple.x+Math.floor((rect.w-rect.h)/2)
        answer.y = maniple.y-Math.floor((rect.w-rect.h)/2)
        answer.w = rect.h
        answer.h = rect.w
      } else if (direction === 'top' || direction === 'bottom') {
        answer.x = maniple.x
        answer.y = maniple.y
        answer.w = rect.w
        answer.h = rect.h
      }
    } else if (maniple.direction === 'left' || maniple.direction === 'right') {
      if (direction === 'top' || direction === 'bottom') {
        answer.x = maniple.x+Math.floor((rect.w-rect.h)/2)
        answer.y = maniple.y-Math.floor((rect.w-rect.h)/2)
        answer.w = rect.h
        answer.h = rect.w
      } else if (direction === 'right' || direction === 'left') {
        answer.x = maniple.x
        answer.y = maniple.y
        answer.w = rect.w
        answer.h = rect.h
      }
    }
    return answer
  }

  async step(maniple: any, direction: string, length: number): Promise<void> {
    this.simulateKeyboardEvent('Digit1')
    await this.asyncService.delay(10)
    let rect = this.getManipleRect(maniple)
    let [x, y] = [(rect.x+rect.w/2)*this.getCellWidth(), (rect.y+rect.h/2)*this.getCellHeight()]
    this.simulateMouseEvent('pointerdown', x, y)
    if (direction === 'top') {
      y -= rect.h/2*this.getCellHeight()
      y -= (length-1)*this.getCellHeight()+this.getCellHeight()/2
    } else if (direction === 'right') {
      x += rect.w/2*this.getCellWidth()
      x += (length-1)*this.getCellWidth()+this.getCellWidth()/2
    } else if (direction === 'bottom') {
      y += rect.h/2*this.getCellHeight()
      y += (length-1)*this.getCellHeight()+this.getCellHeight()/2
    } else if (direction === 'left') {
      x -= rect.w/2*this.getCellWidth()
      x -= (length-1)*this.getCellWidth()+this.getCellWidth()/2
    }
    await this.asyncService.delay(10)
    this.simulateMouseEvent('mousemove', x, y)
    this.simulateMouseEvent('mouseup', x, y)

    // console.log('----------------')

    await this.asyncService.delay(500)
    return new Promise(res => res())
  }

  async rotate(maniple: any, direction: string): Promise<void> {
    // console.log('make rotate', maniple, direction)
    this.simulateKeyboardEvent('Digit2')
    await this.asyncService.delay(10)
    let rect = this.getManipleRect(maniple)
    let [x, y] = [(rect.x+rect.w/2)*this.getCellWidth(), (rect.y+rect.h/2)*this.getCellHeight()]
    this.simulateMouseEvent('pointerdown', x, y)
    if (direction === 'top') {
      y -= 100
    } else if (direction === 'right') {
      x += 100
    } else if (direction === 'bottom') {
      y += 100
    } else if (direction === 'left') {
      x -= 100
    }
    this.simulateMouseEvent('mousemove', x, y)
    this.simulateMouseEvent('mouseup', x, y)

    await this.asyncService.delay(500)
    return new Promise(res => res())
  }

  async attack(maniple: any, point?: Array<number>): Promise<void> {
    // console.log('make attack', maniple)
    this.simulateKeyboardEvent('Digit3')
    await this.asyncService.delay(10)
    let rect = this.getManipleRect(maniple)
    let [x, y] = [(rect.x+rect.w/2)*this.getCellWidth(), (rect.y+rect.h/2)*this.getCellHeight()]
    this.simulateMouseEvent('pointerdown', x, y)

    if (maniple.type === 'infantry' || maniple.type === 'mounted') {
      if (maniple.direction === 'top') {
        y -= 100
      } else if (maniple.direction === 'right') {
        x += 100
      } else if (maniple.direction === 'bottom') {
        y += 100
      } else if (maniple.direction === 'left') {
        x -= 100
      }
    } else if (maniple.type === 'archer') {
      const displayRect = this.displayRef.getBoundingClientRect()
      x = point![0]
      y = point![1]
    }

    this.simulateMouseEvent('mousemove', x, y)
    this.simulateMouseEvent('mouseup', x, y)

    await this.asyncService.delay(500)
    return new Promise(res => res())
  }

  getDistance(p1: Array<number>, p2: Array<number>) {
    return ((p1[0]-p2[0])**2+(p1[1]-p2[1])**2)**(1/2)
  }

  potentialDamage(maniples: Array<any>, maniple: any, x: number, y: number, direction: string): number | null {
    if (maniple.type !== 'infantry' && maniple.type !== 'mounted') return null

    let mnpl = {...maniple}
    mnpl.x = x
    mnpl.y = y
    mnpl.direction = direction

    let rect = this.getManipleRect(mnpl)

    let answer = 0

    // if (!x) x = rect.x
    // if (!y) y = rect.y
    // if (!rotate) rotate = maniple.direction

    let attackArea = { x: 0, y: 0, w: 0, h: 0 }

    if (direction === 'top') {
      attackArea.x = x
      attackArea.w = rect.w
      if (maniple.type === 'infantry') {
        attackArea.h = 1
      } else if (maniple.type === 'mounted') {
        attackArea.h = 3
      }
      attackArea.y = y-attackArea.h
    } else if (direction === 'right') {
      attackArea.y = y
      attackArea.h = rect.h
      if (maniple.type === 'infantry') {
        attackArea.w = 1
      } else if (maniple.type === 'mounted') {
        attackArea.w = 3
      }
      attackArea.x = x+rect.w
    } else if (direction === 'bottom') {
      attackArea.x = x
      attackArea.w = rect.w
      if (maniple.type === 'infantry') {
        attackArea.h = 1
      } else if (maniple.type === 'mounted') {
        attackArea.h = 3
      }
      attackArea.y = y+rect.h
    } else if (direction === 'left') {
      attackArea.y = y
      attackArea.h = rect.h
      if (maniple.type === 'infantry') {
        attackArea.w = 1
      } else if (maniple.type === 'mounted') {
        attackArea.w = 3
      }
      attackArea.x = x-attackArea.w
    }

    for (let i = 0; i < attackArea.w; i++) {
      for (let j = 0; j < attackArea.h; j++) {
        let [currX, currY] = [attackArea.x+i, attackArea.y+j]
        let currM = this.getManipleByCoord(maniples, currX, currY)
        if (currM === null) continue
        let ceturia = this.getCenturiaFromManipleByCoord(currM, currX, currY)
        if (ceturia.index === null) continue
        let damage = this.configService.get(maniple.type).damage*this.configService.get(currM.type).armor
        answer += ceturia.hp! > damage ? damage : ceturia.hp!
      }
    }

    return answer
  }

  bestPosition(maniples: Array<any>, maniple: any): Array<any> | null {
    if (maniple.type !== 'infantry' && maniple.type !== 'mounted') return null

    let botManiples = maniples.filter((m: any) => !m.me)
    let playerManiples = maniples.filter((m: any) => m.me)

    let positions: Array<any> = []
    let max = 0

    for (let i = 0; i < 4; i++) {
      let mnpl = {...maniple}
      mnpl.hps = [...mnpl.hps]
      let direction = 'top'
      if (i === 1) {
        direction = 'right'
      } else if (i === 2) {
        direction = 'bottom'
      } else if (i === 3) {
        direction = 'left'
      }
      mnpl.direction = direction
      const rect = this.getManipleRect(mnpl)

      for (let j = 0; j < this.display.grid.w-rect.w; j++) {
        for (let k = 0; k < this.display.grid.h-rect.h; k++) {
          mnpl.x = j
          mnpl.y = k
          if (this.checkBan(maniples, mnpl)) continue
          const damage = this.potentialDamage(playerManiples, maniple, j, k, direction)
          if (damage === null) continue
          if (damage > max) {
            max = damage
            positions = [{ x: j, y: k, direction, damage }]
          } else if (damage === max) {
            positions.push({ x: j, y: k, direction, damage })
          }
        }
      }
    }

    return positions
  }

  searchRotate(maniples: Array<any>, maniple: any, direction: any): any {
    let mnpl = {...maniple}
    mnpl.hps = [...mnpl.hps]

    if (mnpl.direction === direction) return []

    let rect = this.getManipleRectRotate(mnpl, direction)
    mnpl.x = rect.x
    mnpl.y = rect.y
    mnpl.direction = direction
    if (!this.checkBan(maniples, mnpl)) return [{type: 'rotate', direction: direction}]
    mnpl.direction = maniple.direction

    for (let r = 1; r < 10; r++) {
      for (let i = 0; i < 6; i++) {
        let moveDir = ''
        if (i === 0) {
          mnpl.x = maniple.x-r
          mnpl.y = maniple.y
          moveDir = 'left'
        } else if (i === 1) {
          mnpl.x = maniple.x
          mnpl.y = maniple.y-r
          moveDir = 'top'
        } else if (i === 2) {
          mnpl.x = maniple.x+r
          mnpl.y = maniple.y
          moveDir = 'right'
        } else if (i === 3) {
          mnpl.x = maniple.x
          mnpl.y = maniple.y+r
          moveDir = 'bottom'
        }
        mnpl.direction = maniple.direction
        if (this.checkBan(maniples, mnpl)) continue
        rect = this.getManipleRectRotate(mnpl, direction)
        mnpl.x = rect.x
        mnpl.y = rect.y
        mnpl.direction = direction
        if (!this.checkBan(maniples, mnpl)) return [{ type: moveDir, length: r }, { type: 'rotate', direction: direction }]
      }
    }

    return null
  }

  searchPath(maniples: Array<any>, walker: any, endPoint: any): Array<any> {

    let answer = []

    let mnpl = {...walker}
    mnpl.hps = [...mnpl.hps]

    const rect = this.getManipleRect(mnpl)

    for (let i = 0; i < Math.abs(endPoint.y-walker.y)+1; i++) {
      let [h1, w, h2] = [0, 0, 0]

      h1 = (endPoint.y-walker.y)-i
      w = endPoint.x-walker.x
      h2 = i

      mnpl.x = walker.x
      mnpl.y = walker.y+h1
      if (this.checkBan(maniples, mnpl)) continue

      mnpl.x = walker.x+w
      mnpl.y = walker.y+h1
      if (this.checkBan(maniples, mnpl)) continue

      mnpl.x = walker.x+w
      mnpl.y = walker.y+h1+h2
      if (this.checkBan(maniples, mnpl)) continue

      answer = [
        { direction: h1 > 0 ? 'bottom' : 'top', length: Math.abs(h1)},
        { direction: w > 0 ? 'right' : 'left', length: Math.abs(w)},
        { direction: h2 > 0 ? 'bottom' : 'top', length: Math.abs(h2)},
      ]

      answer = answer.filter((move: any) => move.length > 0)

      return answer
    }

    for (let i = 0; i < Math.min(endPoint.y, walker.y)+1; i++) {
      let [h1, w, h2] = [0, 0, 0]

      h1 = walker.y < endPoint.y ? -i : (walker.y-endPoint.y)-i
      w = endPoint.x-walker.x
      h2 = walker.y < endPoint.y ? (endPoint.y-walker.y)+i : i

      mnpl.x = walker.x
      mnpl.y = walker.y+h1
      if (this.checkBan(maniples, mnpl)) continue

      mnpl.x = walker.x+w
      mnpl.y = walker.y+h1
      if (this.checkBan(maniples, mnpl)) continue

      mnpl.x = walker.x+w
      mnpl.y = walker.y+h1+h2
      if (this.checkBan(maniples, mnpl)) continue

      answer = [
        { direction: h1 > 0 ? 'bottom' : 'top', length: Math.abs(h1)},
        { direction: w > 0 ? 'right' : 'left', length: Math.abs(w)},
        { direction: h2 > 0 ? 'bottom' : 'top', length: Math.abs(h2)},
      ]

      answer = answer.filter((move: any) => move.length > 0)

      return answer
    }

    for (let i = 0; i < this.display.grid.h-Math.max(endPoint.y, walker.y); i++) {
      let [h1, w, h2] = [0, 0, 0]

      h1 = walker.y < endPoint.y ? (endPoint.y-walker.y)+i : i
      w = endPoint.x-walker.x
      h2 = walker.y < endPoint.y ? -i : (walker.y-endPoint.y)-i

      mnpl.x = walker.x
      mnpl.y = walker.y+h1
      if (this.checkBan(maniples, mnpl)) continue

      mnpl.x = walker.x+w
      mnpl.y = walker.y+h1
      if (this.checkBan(maniples, mnpl)) continue

      mnpl.x = walker.x+w
      mnpl.y = walker.y+h1+h2
      if (this.checkBan(maniples, mnpl)) continue

      answer = [
        { direction: h1 > 0 ? 'bottom' : 'top', length: Math.abs(h1)},
        { direction: w > 0 ? 'right' : 'left', length: Math.abs(w)},
        { direction: h2 > 0 ? 'bottom' : 'top', length: Math.abs(h2)},
      ]

      answer = answer.filter((move: any) => move.length > 0)

      return answer
    }

    return []
  }

  async makeMove(maniples: Array<any>): Promise<void> {
    await this.asyncService.delay(1000)

    let mana = this.configService.fullStamina

    let botManiples = maniples.filter((m: any) => !m.me)
    let playerManiples = maniples.filter((m: any) => m.me)

    let mounted = botManiples.find((m: any) => {
      let alv = false
      m.hps.forEach((h: number) => {
        if (h > 0) alv = true
      })
      return m.type === 'mounted' && alv
    })
    if (mounted) {
      let positions = this.bestPosition(maniples, mounted)
      if (positions !== null) {
        let positionsWithoutRotate = positions.filter((p: any) => p.direction === mounted.direction)
        if (positionsWithoutRotate.length > 0) positions = positionsWithoutRotate
        let position: any = null
        let min = 999
        positions.forEach((p: any) => {
          let distance = this.getDistance([mounted.x, mounted.y], [p.x, p.y])
          if (distance < min) {
            min = distance
            position = p
          }
        })

        let pathRotate = this.searchRotate(maniples, mounted, position!.direction)
        if (pathRotate !== null) {
          if (pathRotate[0]) {
            for (let i = 0; i < pathRotate.length; i++) {
              if (pathRotate[i].type === 'top' || pathRotate[i].type === 'right' || pathRotate[i].type === 'bottom' || pathRotate[i].type === 'left') {
                if (mana-this.configService.get(mounted.type).stamina.step <= 0) return new Promise(res => res())
                await this.step(mounted, pathRotate[i].type, pathRotate[i].length)
                mana -= this.configService.get(mounted.type).stamina.step
              } else if (pathRotate[i].type === 'rotate') {
                if (mana-this.configService.get(mounted.type).stamina.rotate <= 0) return new Promise(res => res())
                await this.rotate(mounted, pathRotate[i].direction)
                mounted.direction = pathRotate[i].direction
                mana -= this.configService.get(mounted.type).stamina.rotate
              }
            }
          }

          let pathMove = this.searchPath(maniples, mounted, { x: position.x, y: position.y })
          // console.log('all best positions', positions)
          // console.log('best position', position)
          // console.log('path rotate', pathRotate)
          // console.log('path move', pathMove)
          if (pathMove !== null) {
            for (let i = 0; i < pathMove.length; i++) {
              // console.log('current path', pathMove[i])
              if (mana-this.configService.get(mounted.type).stamina.step <= 0) return new Promise(res => res())
              await this.step(mounted, pathMove[i].direction, pathMove[i].length)
              await this.asyncService.delay(200)
              mana -= this.configService.get(mounted.type).stamina.step
              // mounted = this.display.maniples.find((m: any) => m.id === mounted.id)
            }

            while(1) {
              if (mana-this.configService.get(mounted.type).stamina.attack <= 0) return new Promise(res => res())
              await this.attack(mounted)
              mana -= this.configService.get(mounted.type).stamina.attack
            }
          }
        }
      }
    }

    let infantry = botManiples.find((m: any) => {
      let alv = false
      m.hps.forEach((h: number) => {
        if (h > 0) alv = true
      })
      return m.type === 'infantry' && alv
    })
    if (infantry) {
      let positions = this.bestPosition(maniples, infantry)
      if (positions !== null) {
        let positionsWithoutRotate = positions.filter((p: any) => p.direction === infantry.direction)
        if (positionsWithoutRotate.length > 0) positions = positionsWithoutRotate
        let position: any = null
        let min = 999
        positions.forEach((p: any) => {
          let distance = this.getDistance([infantry.x, infantry.y], [p.x, p.y])
          if (distance < min) {
            min = distance
            position = p
          }
        })

        let pathRotate = this.searchRotate(maniples, infantry, position!.direction)
        if (pathRotate !== null) {
          if (pathRotate[0]) {
            for (let i = 0; i < pathRotate.length; i++) {
              if (pathRotate[i].type === 'top' || pathRotate[i].type === 'right' || pathRotate[i].type === 'bottom' || pathRotate[i].type === 'left') {
                if (mana-this.configService.get(infantry.type).stamina.step <= 0) return new Promise(res => res())
                await this.step(infantry, pathRotate[i].type, pathRotate[i].length)
                mana -= this.configService.get(infantry.type).stamina.step
              } else if (pathRotate[i].type === 'rotate') {
                if (mana-this.configService.get(infantry.type).stamina.rotate <= 0) return new Promise(res => res())
                await this.rotate(infantry, pathRotate[i].direction)
                infantry.direction = pathRotate[i].direction
                mana -= this.configService.get(infantry.type).stamina.rotate
              }
            }
          }

          let pathMove = this.searchPath(maniples, infantry, { x: position.x, y: position.y })

          if (pathMove !== null) {
            for (let i = 0; i < pathMove.length; i++) {
              if (mana-this.configService.get(infantry.type).stamina.step <= 0) return new Promise(res => res())
              await this.step(infantry, pathMove[i].direction, pathMove[i].length)
              await this.asyncService.delay(200)
              mana -= this.configService.get(infantry.type).stamina.step
            }

            while(1) {
              if (mana-this.configService.get(infantry.type).stamina.attack <= 0) return new Promise(res => res())
              await this.attack(infantry)
              mana -= this.configService.get(infantry.type).stamina.attack
            }
          }
        }
      }
    }

    let archer = botManiples.find((m: any) => {
      let alv = false
      m.hps.forEach((h: number) => {
        if (h > 0) alv = true
      })
      return m.type === 'archer' && alv
    })
    if (archer) {
      let rect = this.getManipleRect(archer)
      rect.w *= this.getCellWidth()
      rect.h *= this.getCellHeight()
      rect.x *= this.getCellWidth()
      rect.y *= this.getCellHeight()
      let victim = playerManiples.find((m: any) => {
        let alv = false
        m.hps.forEach((h: number) => {
          if (h > 0) alv = true
        })
        return alv
      })
      let rectVictim = this.getManipleRect(victim)
      let point = [(rectVictim.x+rectVictim.w/2)*this.getCellWidth(), (rectVictim.y+rectVictim.h/2)*this.getCellHeight()]
      let direction = this.getDirection(rect, point[0], point[1])

      if (direction !== archer.direction) {
        let pathRotate = this.searchRotate(maniples, archer, direction)
        if (pathRotate !== null) {
          if (pathRotate[0]) {
            for (let i = 0; i < pathRotate.length; i++) {
              if (pathRotate[i].type === 'top' || pathRotate[i].type === 'right' || pathRotate[i].type === 'bottom' || pathRotate[i].type === 'left') {
                if (mana-this.configService.get(archer.type).stamina.step <= 0) return new Promise(res => res())
                await this.step(archer, pathRotate[i].type, pathRotate[i].length)
                mana -= this.configService.get(archer.type).stamina.step
              } else if (pathRotate[i].type === 'rotate') {
                if (mana-this.configService.get(archer.type).stamina.rotate <= 0) return new Promise(res => res())
                await this.rotate(archer, pathRotate[i].direction)
                archer.direction = pathRotate[i].direction
                mana -= this.configService.get(archer.type).stamina.rotate
              }
            }
          }
        }
      }

      while(1) {
        if (mana-this.configService.get(archer.type).stamina.attack <= 0) {
          await this.asyncService.delay(2000)
          return new Promise(res => res())
        }
        await this.attack(archer, point)
        mana -= this.configService.get(archer.type).stamina.attack
      }
    }

    return new Promise(res => res())
  }

}

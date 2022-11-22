import { Component, OnInit, Input, ElementRef, HostListener, HostBinding, Output, EventEmitter } from '@angular/core'
import { ConfigService } from '@services/config.service'

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {

  @HostBinding('style.width.px') @Input() width: number = 500
  @HostBinding('style.height.px') @Input() height: number = 500
  @Input() bot: boolean = false
  @Input() grid: { w: number; h: number } = { w: 20, h: 20 }
  @Input() maniples: Array<any> = []
  @Input() interaction: 'none' | 'move' | 'rotate' | 'attack' = 'none'
  @Input() canAttack: any = { infantry: false, archer: false, mounted: false }
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>()
  @Output() onInteraction: EventEmitter<any> = new EventEmitter<any>()
  @Output() onAttack: EventEmitter<any> = new EventEmitter<any>()

  arrow: any = {
    active: false,
    start: [0, 0],
    end: [0, 0],
    maniple: null,
    rectManiple: null,
    count: 0
  }

  ghost: any = {
    active: false,
    show: false,
    ban: true,
    x: 0,
    y: 0,
    formation: 0,
    color: '#ff0000',
    type: 'mounted',
    hps: [],
    direction: 'top'
  }

  attack: any = {
    active: false,
    maniple: null,
    rectManiple: null,
    type: 'range',
    mode: 'horizontal',
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    width: 0,
    height: 0,
    grid: { w: 0, h: 0 }
  }

  explosions: Array<any> = []

  bowArrows: Array<any> = []
  intervalBowArrows: any = setInterval(() => {}, 99999)

  damage: any = {
    infantry: this.configService.infantry.damage,
    mounted: this.configService.mounted.damage,
    archer: this.configService.archer.damage
  }

  armor: any = {
    infantry: this.configService.infantry.armor,
    mounted: this.configService.mounted.armor,
    archer: this.configService.archer.armor
  }

  constructor(
    private host: ElementRef,
    public configService: ConfigService
  ) { }

  @HostListener('window:mousemove', ['$event']) onMouseMove(e: any): void { this.movePointer(e) }
  @HostListener('window:touchmove', ['$event']) onTouchMove(e: any): void { this.movePointer(e) }

  @HostListener('window:mouseup', ['$event']) onMouseUp(e: any): void { this.endPointer(e) }
  @HostListener('window:touchend', ['$event']) onTouchUp(e: any): void { this.endPointer(e) }

  getCellWidth(): number {
    return this.width/this.grid.w
  }

  getCellHeight(): number {
    return this.height/this.grid.h
  }

  getManipleWidth(maniple: any):number {
    return maniple.formation*this.getCellWidth()
  }

  getManipleHeight(maniple: any):number {
    return Math.ceil(maniple.hps.length/maniple.formation)*this.getCellHeight()
  }

  getDistance(p1: Array<number>, p2: Array<number>): number {
    return ((p2[0]-p1[0])**2+(p2[1]-p1[1])**2)**(1/2)
  }

  radToDeg(rad: number):number {
    return rad*(180/Math.PI)
  }

  getAngle(p1: Array<number>, p2: Array<number>): number {
    if (p2[1] >= p1[1] && p2[0] >= p1[0]) {
      return Math.atan((p2[1]-p1[1])/(p2[0]-p1[0]))
    } else if ((p2[1] < p1[1] && p2[0] < p1[0]) || (p2[1] >= p1[1] && p2[0] <= p1[0])) {
      return Math.atan((p2[1]-p1[1])/(p2[0]-p1[0]))+Math.PI
    } else if (p2[1] <= p1[1] && p2[0] >= p1[0]) {
      return Math.atan((p2[1]-p1[1])/(p2[0]-p1[0]))+2*Math.PI
    }
    return 0
  }

  getManipleRotation(maniple: any): number {
    if (maniple.direction === 'top') {
      return 0
    } else if (maniple.direction === 'bottom') {
      return 180
    } else if (maniple.direction === 'left') {
      return 270
    } else if (maniple.direction === 'right') {
      return 90
    }
    return 0
  }

  getManipleCoordX(maniple: any): number {
    let alive = 0
    maniple.hps.forEach((hp: any) => alive = hp > 0 ? alive+1 : alive)
    let [width, height] = [
      alive > maniple.formation ? maniple.formation*this.getCellWidth() : alive*this.getCellWidth(),
      Math.ceil(alive/maniple.formation)*this.getCellHeight()
    ]
    if (maniple.direction === 'top') {
      return maniple.x*this.getCellWidth()
    } else if (maniple.direction === 'bottom') {
      return maniple.x*this.getCellWidth()+width
    } else if (maniple.direction === 'left') {
      return maniple.x*this.getCellWidth()
    } else if (maniple.direction === 'right') {
      return maniple.x*this.getCellWidth()+height
    }
    return maniple.x*this.getCellWidth()
  }

  getManipleCoordY(maniple: any): number {
    let alive = 0
    maniple.hps.forEach((hp: any) => alive = hp > 0 ? alive+1 : alive)
    let [width, height] = [
      alive > maniple.formation ? maniple.formation*this.getCellWidth() : alive*this.getCellWidth(),
      Math.ceil(alive/maniple.formation)*this.getCellHeight()
    ]
    if (maniple.direction === 'top') {
      return maniple.y*this.getCellHeight()
    } else if (maniple.direction === 'bottom') {
      return maniple.y*this.getCellHeight()+height
    } else if (maniple.direction === 'left') {
      return maniple.y*this.getCellHeight()+width
    } else if (maniple.direction === 'right') {
      return maniple.y*this.getCellHeight()
    }
    return maniple.y*this.getCellHeight()
  }

  trackManiple(index: number, item: any) {
    return 'maniple'+index
  }

  trackBoom(index: number, item: any) {
    return 'boom'+index
  }

  trackBowArrow(index: number, item: any) {
    return 'arrow'+index
  }

  getId(arr: Array<any>): number {
    let id = 0
    arr.forEach((item: any) => {
      if (id < item.id) id = item.id
    })
    return id+1
  }

  makeBoom(x: number, y: number) {
    let id = this.getId(this.explosions)
    this.explosions.push({ id: this.getId(this.explosions), x, y })
    setTimeout(() => {
      this.explosions = this.explosions.filter((boom: any) => boom.id !== id)
    }, 500)
  }

  getXY(e: any): Array<number> {
    if (e.touches && e.touches[0]) {
      return [e.touches[0].clientX, e.touches[0].clientY]
    } else if (e?.changedTouches && e.changedTouches[0]) {
      return [e.changedTouches[0].clientX, e.changedTouches[0].clientY]
    }

    return [e.clientX, e.clientY]
  }

  getDirection(rect: any, x: number, y: number): 'left' | 'top' | 'bottom' | 'right' | 'center' {
    let min = this.getDistance([rect.x+rect.width/2, rect.y], [x, y])
    let test = 0
    let answer: 'left' | 'top' | 'bottom' | 'right' | 'center' = 'top'

    test = this.getDistance([rect.x+rect.width, rect.y+rect.height/2], [x, y])
    if (test < min) {
      min = test
      answer = 'right'
    }

    test = this.getDistance([rect.x+rect.width/2, rect.y+rect.height], [x, y])
    if (test < min) {
      min = test
      answer = 'bottom'
    }

    test = this.getDistance([rect.x, rect.y+rect.height/2], [x, y])
    if (test < min) {
      min = test
      answer = 'left'
    }

    test = this.getDistance([rect.x+rect.width/2, rect.y+rect.height/2], [x, y])
    if (test < min) {
      min = test
      answer = 'center'
    }

    return answer
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

  checkBanGhost(): void {
    this.ghost.ban = false

    const ghostCellRect = this.getManipleRect(this.ghost)

    if (ghostCellRect.x < 0 || ghostCellRect.y < 0 || ghostCellRect.x+ghostCellRect.w > this.grid.w || ghostCellRect.y+ghostCellRect.h > this.grid.h) {
      this.ghost.ban = true
      return
    }

    this.maniples.forEach(m => {
      const mCellRect = this.getManipleRect(m)
      if (m.id !== this.ghost.id) {
        if (mCellRect.x+mCellRect.w > ghostCellRect.x && mCellRect.x < ghostCellRect.x+ghostCellRect.w) {
          if (mCellRect.y+mCellRect.h > ghostCellRect.y && mCellRect.y < ghostCellRect.y+ghostCellRect.h) {
            this.ghost.ban = true
            return
          }
        }
      }
    })
  }

  getHpCenturiaFromManipleByCoord(maniple: any, x: number, y: number): { index: number | null, hp: number | null } {
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

  getIdManipleByCoord(x: number, y: number): number {
    for (let z = 0; z < this.maniples.length; z++) {
      let rect = this.getManipleRect(this.maniples[z])
      for (let i = 0; i < rect.w; i++) {
        for (let j = 0; j < rect.h; j++) {
          if (rect.x+i === x && rect.y+j === y) {

            return this.maniples[z].id
          }
        }
      }
    }
    return -1
  }

  changeHp(changes: any): void {
    changes.forEach((change: any) => {
      let maniples = [...this.maniples]
      let m = this.maniples.find(m => m.id === change.manipleId)
      m = {...m}
      m.hps = [...m.hps]
      maniples = maniples.filter(m => m.id !== change.manipleId)

      m.hps[change.indexCenturia] += Math.ceil(change.hp*(1-this.armor[m.type]))

      if (m.hps[change.indexCenturia] < 0) m.hps[change.indexCenturia] = 0

      maniples = [...maniples, m]

      this.onChange.emit(maniples)
    })

  }

  shootArrow(x: number, y: number, rotate: number, idManiple: number): void {
    this.bowArrows.push({x, y, rotate, idManiple})
    clearInterval(this.intervalBowArrows)
    this.intervalBowArrows = setInterval(() => {
      if (this.bowArrows.length === 0) clearInterval(this.intervalBowArrows)
      let speed = this.getCellWidth() < this.getCellHeight() ? 0.1*this.getCellWidth() : 0.1*this.getCellHeight()
      for (let i = 0; i < this.bowArrows.length; i++) {
        let [xCell, yCell] = [
          Math.floor(this.bowArrows[i].x/this.getCellWidth()),
          Math.floor(this.bowArrows[i].y/this.getCellHeight())
        ]
        let collisionId = this.getIdManipleByCoord(xCell, yCell)
        if (collisionId !== -1 && collisionId !== this.bowArrows[i].idManiple) {
          let maniple = this.maniples.find((m: any) => m.id === collisionId)
          let cent = this.getHpCenturiaFromManipleByCoord(maniple, xCell, yCell)
          if (cent.index !== null) {
            this.makeBoom(xCell, yCell)
            this.changeHp([{ manipleId: maniple.id, indexCenturia: cent.index, hp: -this.damage['archer'] }])
            this.bowArrows.splice(i, 1)
            i -= 1
          }
        }
      }
      this.bowArrows.map((arr: any) => {
        arr.x -= speed*Math.cos(arr.rotate+Math.PI/2)
        arr.y -= speed*Math.sin(arr.rotate+Math.PI/2)
        return arr
      })

      this.bowArrows = this.bowArrows.filter((arr: any) => {
        if (arr.x < 0 || arr.y < 0 || arr.x > this.width || arr.y > this.height) {
          return false
        }
        return true
      })
    }, 10)
  }

  startPointer(e: any): void {
    let [x, y] = this.getXY(e)

    let target = e.target
    while (target.tagName !== 'APP-MANIPLE') {
      if (target.tagName === 'BODY') return
      target = target.parentNode
    }
    const rectHost = this.host.nativeElement.getBoundingClientRect()
    const rectTarget = target.getBoundingClientRect()
    const id = parseInt(target.getAttribute('idmaniple'))

    let maniple = this.maniples.find(m => m.id === id)

    if (!maniple.me && e.detail !== 777) return
    if (this.bot && e.detail !== 777) return

    if (this.interaction === 'move') {
      this.arrow.active = true
      this.arrow.maniple = maniple
      this.arrow.rectManiple = rectTarget
      this.arrow.start = [0, 0]
      this.arrow.end = [0, 0]
      this.ghost = {...this.arrow.maniple}
      this.ghost.active = true
      this.ghost.ban = true
      this.ghost.show = false
      this.ghost.hps = [...this.ghost.hps]
    } else if (this.interaction === 'rotate') {
      this.arrow.active = true
      this.arrow.maniple = maniple
      this.arrow.rectManiple = rectTarget
      this.arrow.start = [0, 0]
      this.arrow.end = [0, 0]
      this.ghost = {...this.arrow.maniple}
      this.ghost.active = true
      this.ghost.ban = true
      this.ghost.show = false
      this.ghost.hps = [...this.ghost.hps]
    } else if (this.interaction === 'attack') {
      this.attack.active = true
      this.attack.maniple = maniple
      this.attack.rectManiple = rectTarget
    }

  }

  movePointer(e: any): void {
    let [x, y] = this.getXY(e)

    if (this.arrow.active) {
      const rectHost = this.host.nativeElement.getBoundingClientRect()
      if (this.interaction === 'move') {
        this.arrow.active = true
        this.ghost.show = true
        const dir = this.getDirection(this.arrow.rectManiple, x, y)
        if (dir === 'top') {
          this.arrow.start = [this.arrow.rectManiple.x-rectHost.x+this.arrow.rectManiple.width/2, this.arrow.rectManiple.y-rectHost.y]
          this.arrow.count = Math.ceil(this.getDistance(this.arrow.start, [x-rectHost.x, y-rectHost.y])/this.getCellHeight())
          if (this.arrow.start[1]-this.arrow.count*this.getCellHeight() <= 0) {
            this.arrow.count = Math.round(this.arrow.start[1]/this.getCellHeight())
          } else if (y-rectHost.y > this.arrow.start[1]) {
            this.arrow.count = 1
          }
          this.arrow.end = [this.arrow.start[0], this.arrow.start[1]-this.arrow.count*this.getCellHeight()]
          this.ghost.x = this.arrow.maniple.x
          this.ghost.y = this.arrow.maniple.y-this.arrow.count
        } else if (dir === 'right') {
          this.arrow.start = [this.arrow.rectManiple.x-rectHost.x+this.arrow.rectManiple.width, this.arrow.rectManiple.y-rectHost.y+this.arrow.rectManiple.height/2]
          this.arrow.count = Math.ceil(this.getDistance(this.arrow.start, [x-rectHost.x, y-rectHost.y])/this.getCellWidth())
          if (this.arrow.start[0]+this.arrow.count*this.getCellWidth() >= rectHost.width) {
            this.arrow.count = Math.round((rectHost.width-this.arrow.start[0])/this.getCellWidth())
          } else if (x-rectHost.x < this.arrow.start[0]) {
            this.arrow.count = 1
          }
          this.arrow.end = [this.arrow.start[0]+this.arrow.count*this.getCellWidth(), this.arrow.start[1]]
          this.ghost.x = this.arrow.maniple.x+this.arrow.count
          this.ghost.y= this.arrow.maniple.y
        } else if (dir === 'bottom') {
          this.arrow.start = [this.arrow.rectManiple.x-rectHost.x+this.arrow.rectManiple.width/2, this.arrow.rectManiple.y-rectHost.y+this.arrow.rectManiple.height]
          this.arrow.count = Math.ceil(this.getDistance(this.arrow.start, [x-rectHost.x, y-rectHost.y])/this.getCellHeight())
          if (this.arrow.start[1]+this.arrow.count*this.getCellHeight() >= rectHost.height) {
            this.arrow.count = Math.round((rectHost.height-this.arrow.start[1])/this.getCellHeight())
          } else if (y-rectHost.y < this.arrow.start[1]) {
            this.arrow.count = 1
          }
          this.arrow.end = [this.arrow.start[0], this.arrow.start[1]+this.arrow.count*this.getCellHeight()]
          this.ghost.x = this.arrow.maniple.x
          this.ghost.y = this.arrow.maniple.y+this.arrow.count
        } else if (dir === 'left') {
          this.arrow.start = [this.arrow.rectManiple.x-rectHost.x, this.arrow.rectManiple.y-rectHost.y+this.arrow.rectManiple.height/2]
          this.arrow.count = Math.ceil(this.getDistance(this.arrow.start, [x-rectHost.x, y-rectHost.y])/this.getCellWidth())
          if (this.arrow.start[0]-this.arrow.count*this.getCellWidth() <= 0) {
            this.arrow.count = Math.round(this.arrow.start[0]/this.getCellWidth())
          } else if (x-rectHost.x > this.arrow.start[0]) {
            this.arrow.count = 1
          }
          this.arrow.end = [this.arrow.start[0]-this.arrow.count*this.getCellWidth(), this.arrow.start[1]]
          this.ghost.x = this.arrow.maniple.x-this.arrow.count
          this.ghost.y= this.arrow.maniple.y
        } else if (dir === 'center') {
          this.arrow.count = 0
          this.arrow.start = [-1000, -1000]
          this.arrow.end = [-1000, -1000]
          this.ghost.x = this.arrow.maniple.x
          this.ghost.y = this.arrow.maniple.y
        }
        this.onInteraction.emit({ type: this.interaction, direction: dir, walkerType: this.arrow.maniple.type, length: this.arrow.count })
        this.checkBanGhost()
      } else if (this.interaction === 'rotate') {
        const dir = this.getDirection(this.arrow.rectManiple, x, y)
        this.ghost.show = true
        if (dir === 'center') {
          this.ghost.direction = this.arrow.maniple.direction
          this.ghost.x = this.arrow.maniple.x
          this.ghost.y = this.arrow.maniple.y
        } else {
          this.ghost.direction = dir
        }
        const mCellRect = this.getManipleRect(this.arrow.maniple)
        if (this.arrow.maniple.direction === 'top' || this.arrow.maniple.direction === 'bottom') {
          if (dir === 'right' || dir === 'left') {
            this.ghost.x = this.arrow.maniple.x+Math.floor((mCellRect.w-mCellRect.h)/2)
            this.ghost.y = this.arrow.maniple.y-Math.floor((mCellRect.w-mCellRect.h)/2)
          } else if (dir === 'top' || dir === 'bottom') {
            this.ghost.x = this.arrow.maniple.x
            this.ghost.y = this.arrow.maniple.y
          }
        } else if (this.arrow.maniple.direction === 'left' || this.arrow.maniple.direction === 'right') {
          if (dir === 'top' || dir === 'bottom') {
            this.ghost.x = this.arrow.maniple.x+Math.floor((mCellRect.w-mCellRect.h)/2)
            this.ghost.y = this.arrow.maniple.y-Math.floor((mCellRect.w-mCellRect.h)/2)
          } else if (dir === 'right' || dir === 'left') {
            this.ghost.x = this.arrow.maniple.x
            this.ghost.y = this.arrow.maniple.y
          }
        }

        this.onInteraction.emit({ type: this.interaction, walkerType: this.arrow.maniple.type, direction: dir })

        this.checkBanGhost()
      }
    }

    if (this.attack.active) {
      const rectHost = this.host.nativeElement.getBoundingClientRect()
      if (this.interaction === 'attack') {
        const dir = this.getDirection(this.attack.rectManiple, x, y)
        const rect = this.getManipleRect(this.attack.maniple)
        if (this.attack.maniple.type === 'infantry') {
          this.attack.type = 'melee'
          if (this.attack.maniple.direction === 'top' || this.attack.maniple.direction === 'bottom') {
            this.attack.grid = { w: rect.w, h: 1 }
            this.attack.width = this.attack.rectManiple.width
            this.attack.height = this.getCellHeight()
          } else if (this.attack.maniple.direction === 'left' || this.attack.maniple.direction === 'right') {
            this.attack.grid = { w: 1, h: rect.h }
            this.attack.width = this.getCellWidth()
            this.attack.height = this.attack.rectManiple.height
          }
          if (this.attack.maniple.direction === 'top') {
            this.attack.x1 = this.attack.rectManiple.x-rectHost.x
            this.attack.y1 = this.attack.rectManiple.y-rectHost.y-this.attack.height
          } else if (this.attack.maniple.direction === 'right') {
            this.attack.x1 = this.attack.rectManiple.x-rectHost.x+this.attack.rectManiple.width
            this.attack.y1 = this.attack.rectManiple.y-rectHost.y
          } else if (this.attack.maniple.direction === 'bottom') {
            this.attack.x1 = this.attack.rectManiple.x-rectHost.x
            this.attack.y1 = this.attack.rectManiple.y-rectHost.y+this.attack.rectManiple.height
          } else if (this.attack.maniple.direction === 'left') {
            this.attack.x1 = this.attack.rectManiple.x-rectHost.x-this.attack.width
            this.attack.y1 = this.attack.rectManiple.y-rectHost.y
          }

          if (dir !== this.attack.maniple.direction) {
            this.attack.grid = { w: 0, h: 0 }
          }

        } else if (this.attack.maniple.type === 'mounted') {
          this.attack.type = 'melee'
          if (this.attack.maniple.direction === 'top' || this.attack.maniple.direction === 'bottom') {
            this.attack.grid = { w: rect.w, h: 3 }
            this.attack.width = this.attack.rectManiple.width
            this.attack.height = 3*this.getCellHeight()
          } else if (this.attack.maniple.direction === 'left' || this.attack.maniple.direction === 'right') {
            this.attack.grid = { w: 3, h: rect.h }
            this.attack.width = 3*this.getCellWidth()
            this.attack.height = this.attack.rectManiple.height
          }

          if (this.attack.maniple.direction === 'top') {
            this.attack.x1 = this.attack.rectManiple.x-rectHost.x
            this.attack.y1 = this.attack.rectManiple.y-rectHost.y-this.attack.height
          } else if (this.attack.maniple.direction === 'right') {
            this.attack.x1 = this.attack.rectManiple.x-rectHost.x+this.attack.rectManiple.width
            this.attack.y1 = this.attack.rectManiple.y-rectHost.y
          } else if (this.attack.maniple.direction === 'bottom') {
            this.attack.x1 = this.attack.rectManiple.x-rectHost.x
            this.attack.y1 = this.attack.rectManiple.y-rectHost.y+this.attack.rectManiple.height
          } else if (this.attack.maniple.direction === 'left') {
            this.attack.x1 = this.attack.rectManiple.x-rectHost.x-this.attack.width
            this.attack.y1 = this.attack.rectManiple.y-rectHost.y
          }

          if (dir !== this.attack.maniple.direction) {
            this.attack.grid = { w: 0, h: 0 }
          }
        } else if (this.attack.maniple.type === 'archer') {
          this.attack.type = 'range'
          this.attack.x2 = x-rectHost.x
          this.attack.y2 = y-rectHost.y
          let rectManiple = this.getManipleRect(this.attack.maniple)
          this.attack.height = (this.width**2+this.height**2)**(1/2)
          if (this.attack.maniple.direction === 'top' || this.attack.maniple.direction === 'bottom') {
            this.attack.mode = 'horizontal'
            this.attack.width = this.attack.rectManiple.width
            this.attack.grid = { w: rectManiple.w, h: 0 }
            this.attack.x2 -= this.attack.rectManiple.width/2
          } else if (this.attack.maniple.direction === 'left' || this.attack.maniple.direction === 'right') {
            this.attack.mode = 'vertical'
            this.attack.width = this.attack.rectManiple.height
            this.attack.grid = { w: rectManiple.h, h: 0 }
            this.attack.y2 -= this.attack.rectManiple.height/2
          }
          if (this.attack.maniple.direction === 'top') {
            this.attack.x1 = this.attack.rectManiple.x-rectHost.x
            this.attack.y1 = this.attack.rectManiple.y-rectHost.y
            if (this.attack.y2 >= this.attack.y1) {
              this.attack.height = 0
            }
          } else if (this.attack.maniple.direction === 'right') {
            this.attack.x1 = this.attack.rectManiple.x-rectHost.x+this.attack.rectManiple.width
            this.attack.y1 = this.attack.rectManiple.y-rectHost.y
            if (this.attack.x2 <= this.attack.x1) {
              this.attack.height = 0
            }
          } else if (this.attack.maniple.direction === 'bottom') {
            this.attack.x1 = this.attack.rectManiple.x-rectHost.x
            this.attack.y1 = this.attack.rectManiple.y-rectHost.y+this.attack.rectManiple.height
            if (this.attack.y2 <= this.attack.y1) {
              this.attack.height = 0
            }
          } else if (this.attack.maniple.direction === 'left') {
            this.attack.x1 = this.attack.rectManiple.x-rectHost.x
            this.attack.y1 = this.attack.rectManiple.y-rectHost.y
            if (this.attack.x2 >= this.attack.x1) {
              this.attack.height = 0
            }
          }
        }
        this.onInteraction.emit({ type: this.interaction, killerType: this.attack.maniple.type })
      }
    }
  }

  endPointer(e: any): void {
    const [x, y] = this.getXY(e)

    if ((this.interaction === 'move' || this.interaction === 'rotate') && !this.ghost.ban && this.arrow.maniple) {
      let maniples = [...this.maniples]
      let m = this.maniples.find(m => m.id === this.arrow.maniple.id)
      m = {...m}
      maniples = maniples.filter(m => m.id !== this.arrow.maniple.id)

      m.x = this.ghost.x
      m.y = this.ghost.y
      m.direction = this.ghost.direction

      maniples = [...maniples, m]

      this.onChange.emit(maniples)
    } else if (this.interaction === 'attack' && this.attack.maniple) {
      if ((this.attack.maniple.type === 'infantry' || this.attack.maniple.type === 'mounted') && this.canAttack[this.attack.maniple.type] && this.attack.maniple.direction) {
        if (this.attack.maniple.direction === this.getDirection(this.attack.rectManiple, x, y)) {
          let maniple = {...this.attack.maniple}
          maniple.hps = [...maniple.hps]
          this.onAttack.emit(maniple)
        }
        let toChange = []
        let [currX, currY] = [Math.round(this.attack.x1/this.getCellWidth()), Math.round(this.attack.y1/this.getCellHeight())]
        for (let i = 0; i < this.attack.grid.h; i++) {
          for (let j = 0; j < this.attack.grid.w; j++) {
            this.makeBoom(currX+j, currY+i)
            let collisionId = this.getIdManipleByCoord(currX+j, currY+i)
            if (collisionId !== -1) {
              let maniple = this.maniples.find((m: any) => m.id === collisionId)
              let cent = this.getHpCenturiaFromManipleByCoord(maniple, currX+j, currY+i)
              if (cent.index !== null) {
                toChange.push({ manipleId: maniple.id, indexCenturia: cent.index, hp: -this.damage[this.attack.maniple.type] })
              }
            }
          }
        }
        this.changeHp(toChange)
      } else if (this.attack.maniple.type === 'archer' && this.attack.height > 0 && this.canAttack[this.attack.maniple.type] && this.attack.maniple.direction) {
        let maniple = {...this.attack.maniple}
        maniple.hps = [...maniple.hps]
        this.onAttack.emit(maniple)

        if (this.attack.maniple.direction === 'top') {
          for (let i = 0; i < this.attack.grid.w; i++) {
            this.shootArrow(
              (this.attack.maniple.x+i)*this.getCellWidth()+this.getCellWidth()/2,
              this.attack.maniple.y*this.getCellHeight(),
              this.getAngle([this.attack.x2, this.attack.y2], [this.attack.x1, this.attack.y1])-Math.PI/2,
              this.attack.maniple.id
            )
          }
        } else if (this.attack.maniple.direction === 'right') {
          for (let i = 0; i < this.attack.grid.w; i++) {
            this.shootArrow(
              this.attack.maniple.x*this.getCellWidth()+this.attack.rectManiple.width,
              (this.attack.maniple.y+i)*this.getCellHeight()+this.getCellHeight()/2,
              this.getAngle([this.attack.x2, this.attack.y2], [this.attack.x1, this.attack.y1])-Math.PI/2,
              this.attack.maniple.id
            )
          }
        } else if (this.attack.maniple.direction === 'bottom') {
          for (let i = 0; i < this.attack.grid.w; i++) {
            this.shootArrow(
              (this.attack.maniple.x+i)*this.getCellWidth()+this.getCellWidth()/2,
              this.attack.maniple.y*this.getCellHeight()+this.attack.rectManiple.height,
              this.getAngle([this.attack.x2, this.attack.y2], [this.attack.x1, this.attack.y1])-Math.PI/2,
              this.attack.maniple.id
            )
          }
        } else if (this.attack.maniple.direction === 'left') {
          for (let i = 0; i < this.attack.grid.w; i++) {
            this.shootArrow(
              this.attack.maniple.x*this.getCellWidth(),
              (this.attack.maniple.y+i)*this.getCellHeight()+this.getCellHeight()/2,
              this.getAngle([this.attack.x2, this.attack.y2], [this.attack.x1, this.attack.y1])-Math.PI/2,
              this.attack.maniple.id
            )
          }
        }
      }
    }

    this.ghost.active = false

    this.attack.active = false
    this.attack.grid = { w: 0, h: 0 }
    this.attack.width = 0
    this.attack.height = 0
    this.attack.x1 = 0
    this.attack.y1 = 0
    this.attack.x2 = 0
    this.attack.y2 = 0
    this.attack.maniple = null
    this.attack.rectManiple = null

    this.arrow.active = false
    this.arrow.start = [0, 0]
    this.arrow.end = [0, 0]
    this.arrow.maniple = null
    this.arrow.rectManiple = null
    this.arrow.maniple = null
    this.arrow.rectManiple = null
  }

  ngOnInit(): void { }

}

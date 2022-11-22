import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core'
import { IconService } from '@services/icon.service'
import { AsyncService } from '@services/async.service'
import { BotService } from '@services/bot.service'
import { ConfigService } from '@services/config.service'

@Component({
  selector: 'app-page-game',
  templateUrl: './page-game.component.html',
  styleUrls: ['./page-game.component.scss']
})
export class PageGameComponent implements OnInit {

  @ViewChild('displayRef', { read: ElementRef }) displayRef!: ElementRef

  isTouch: boolean = true

  math = Math

  stage: 'deployment' | 'battle' = 'deployment'

  stamina: any = {
    infantry: this.configService.infantry.stamina,
    archer: this.configService.archer.stamina,
    mounted: this.configService.mounted.stamina
  }

  menu: any = {
    show: false
  }

  winner: any = {
    show: false,
    name: '',
  }

  maxStamina: number = this.configService.fullStamina

  playing: any = {
    myTurn: true,
    me: {
      stamina: this.maxStamina,
      potentialStamina: 0
    },
    enemy: {
      stamina: this.maxStamina,
      potentialStamina: 0
    }
  }

  myColor: string = this.configService.myColor
  enemyColor: string = this.configService.enemyColor

  banArea: any = {
    width: 0,
    height: 0,
    x: 0,
    y: 0
  }

  mouse: any = {
    active: false,
    delta: { x: 0, y: 0 },
    dbl: false,
    timeout: setTimeout(() => {}, 0)
  }

  maxManiple: any = {
    infantry: 2,
    archer: 1,
    mounted: 1
  }

  deployment: Array<any> = []

  display: any = {
    width: 200,
    height: 600,
    interaction: 'move',
    canAttack: {
      infantry: true,
      archer: true,
      mounted: true
    },
    grid: {
      w: 14,
      h: 21
    },
    maniples: [
      // {
      //   id: 1,
      //   x: 0,
      //   y: 15,
      //   formation: 4,
      //   color: '#ff0000',
      //   type: 'mounted',
      //   hps: [100, 100, 100, 100, 100, 100, 100, 100],
      //   direction: 'top',
      //   me: true
      // },
      // {
      //   id: 2,
      //   x: 4,
      //   y: 15,
      //   formation: 5,
      //   color: '#ff0000',
      //   type: 'archer',
      //   hps: [100, 100, 100, 100, 100],
      //   direction: 'top',
      //   me: true
      // }, {
      //   id: 3,
      //   x: 8,
      //   y: 17,
      //   formation: 6,
      //   color: '#ff0000',
      //   type: 'infantry',
      //   hps: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
      //   direction: 'top',
      //   me: true
      // }, {
      //   id: 4,
      //   x: 0,
      //   y: 17,
      //   formation: 6,
      //   color: '#ff0000',
      //   type: 'infantry',
      //   hps: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
      //   direction: 'top',
      //   me: true
      // },
      // {
      //   id: 5,
      //   x: 5,
      //   y: 4,
      //   formation: 4,
      //   color: '#0000ff',
      //   type: 'mounted',
      //   hps: [100, 100, 100, 100, 100, 100, 100, 100],
      //   direction: 'bottom',
      //   me: false
      // },
      //  {
      //   id: 6,
      //   x: 4,
      //   y: 3,
      //   formation: 5,
      //   color: '#0000ff',
      //   type: 'archer',
      //   hps: [100, 100, 100, 100, 100],
      //   direction: 'top',
      //   me: false
      // }, {
      //   id: 7,
      //   x: 8,
      //   y: 0,
      //   formation: 6,
      //   color: '#0000ff',
      //   type: 'infantry',
      //   hps: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
      //   direction: 'bottom',
      //   me: false
      // }, {
      //   id: 8,
      //   x: 2,
      //   y: 0,
      //   formation: 6,
      //   color: '#0000ff',
      //   type: 'infantry',
      //   hps: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
      //   direction: 'bottom',
      //   me: false
      // }
    ]
  }

  constructor(
    public iconService: IconService,
    private asyncService: AsyncService,
    private botService: BotService,
    public configService: ConfigService
  ) { }

  @HostListener('window:touchstart', ['$event']) onTouchStart(e: any): void { this.touchStartPointer(e) }

  @HostListener('window:mousemove', ['$event']) onMouseMove(e: any): void { this.movePointer(e) }
  @HostListener('window:touchmove', ['$event']) onTouchMove(e: any): void { this.movePointer(e) }

  @HostListener('window:mouseup', ['$event']) onMouseUp(e: any): void { this.endPointer(e) }
  @HostListener('window:touchend', ['$event']) onTouchUp(e: any): void { this.endPointer(e) }

  @HostListener('window:keydown', ['$event']) onKeydown(e: any): void {
    if (e.code === 'Digit1') {
      this.display.interaction = 'move'
    } else if (e.code === 'Digit2') {
      this.display.interaction = 'rotate'
    } else if (e.code === 'Digit3') {
      this.display.interaction = 'attack'
    } else if (e.code === 'Space' && e.shiftKey) {
      if (this.playing.myTurn) this.changeTurn()
    }


  }

  getCellWidth(): number {
    return this.display.width/this.display.grid.w
  }

  getCellHeight(): number {
    return this.display.height/this.display.grid.h
  }

  @HostListener('window:load') onLoad(): void {
    this.setSize()
  }

  @HostListener('window:resize') onResize(): void {
    this.setSize()
  }

  setSize(): void {
    let ratio = 2/3
    let percentage = 0.7
    let max = 800

    if (window.innerWidth/window.innerHeight >= ratio) {
      this.display.height = percentage*window.innerHeight
      this.display.width = this.display.height*ratio
    } else if (window.innerWidth/window.innerHeight < ratio) {
      this.display.width = percentage*window.innerWidth
      this.display.height = this.display.width/ratio
    }

    if (this.display.width > max) {
      this.display.width = max
      this.display.height = this.display.width/ratio
    }

    if (this.display.height > max) {
      this.display.height = max
      this.display.width = this.display.height*ratio
    }

    if (this.stage === 'deployment') {
      setTimeout(() => {
        const displayRect = this.displayRef.nativeElement.getBoundingClientRect()

        this.deployment.forEach((m: any) => {
          m.x = displayRect.x+m.xCell*this.getCellWidth()
          m.y = displayRect.y+m.yCell*this.getCellHeight()
        })

        this.banArea.x = displayRect.x
        this.banArea.y = displayRect.y
        this.banArea.width = displayRect.width
        this.banArea.height = Math.floor((2/3)*this.display.grid.h)*this.getCellHeight()-2
      }, 10)
    }

    setTimeout(() => {
      this.botService.setDisplay(this.display, this.displayRef.nativeElement)
    }, 10)
  }

  checkCanAttack(): void {
    let stamina = this.playing.myTurn ? this.playing.me.stamina : this.playing.enemy.stamina

    this.display.canAttack = { infantry: true, archer: true, mounted: true }
    if (stamina < this.configService.infantry.stamina.attack) this.display.canAttack.infantry = false
    if (stamina < this.configService.archer.stamina.attack) this.display.canAttack.archer = false
    if (stamina < this.configService.mounted.stamina.attack) this.display.canAttack.mounted = false

  }

  async onAttackDisplay(maniple: any): Promise<void> {

    let stamina = this.playing.myTurn ? this.playing.me.stamina : this.playing.enemy.stamina

    stamina -= this.stamina[maniple.type]['attack']

    if (this.playing.myTurn) {
      this.playing.me.stamina = stamina
    } else if (!this.playing.myTurn) {
      this.playing.enemy.stamina = stamina
    }

    if (this.playing.me.stamina === 0 || this.playing.enemy.stamina === 0) {
      if (this.playing.myTurn) {
        this.changeTurn()
      }
    }

    this.checkCanAttack()

    return new Promise(res => res())

  }

  onInteractionDisplay(interact: any): void {

    let potentialStamina = 0

    if (interact.type === 'move') {
      potentialStamina = this.configService.get(interact.walkerType).stamina.step*interact.length
    } else if (interact.type === 'rotate') {
      potentialStamina = this.configService.get(interact.walkerType).stamina.rotate
    } else if (interact.type === 'attack') {
      potentialStamina = this.configService.get(interact.killerType).stamina.attack
    }

    if (this.playing.myTurn) {
      this.playing.me.potentialStamina = potentialStamina
    } else {
      this.playing.enemy.potentialStamina = potentialStamina
    }

  }

  checkWinner(): void {
    let alive = { me: false, enemy: false }
    this.display.maniples.forEach((m: any) => {
      let a = false
      m.hps.forEach((h: any) => {
        if (h > 0) a = true
      })
      if (m.me && a) alive.me = true
      if (!m.me && a) alive.enemy = true
    })

    if (alive.me && !alive.enemy) {
      this.winner.show = true
      this.winner.name = 'Rome'
    } else if (!alive.me && alive.enemy) {
      this.winner.show = true
      this.winner.name = 'Carthage'
    }
  }

  async onChangeDisplay(maniples: any): Promise<void> {
    let maniple = maniples.find((m: any) => m !== this.display.maniples.find((mm: any) => mm.id === m.id))
    let mnpl = this.display.maniples.find((m: any) => m.id === maniple.id)

    let can = true
    let stamina = this.playing.myTurn ? this.playing.me.stamina : this.playing.enemy.stamina

    stamina -= this.stamina[maniple.type]['step']*Math.abs(mnpl.x-maniple.x)
    stamina -= this.stamina[maniple.type]['step']*Math.abs(mnpl.y-maniple.y)
    stamina -= mnpl.direction !== maniple.direction ? this.stamina[maniple.type]['rotate'] : 0

    if (stamina < 0) {
      can = false
    } else {
      if (this.playing.myTurn) {
        this.playing.me.stamina = stamina
      } else if (!this.playing.myTurn) {
        this.playing.enemy.stamina = stamina
      }
      this.checkCanAttack()
    }

    if (can) {
      mnpl.x = maniple.x
      mnpl.y = maniple.y
      mnpl.direction = maniple.direction
      mnpl.hps = [...maniple.hps]
    } else {
      this.display.maniples = [...this.display.maniples]
    }

    if (this.playing.me.stamina === 0 || this.playing.enemy.stamina === 0) {
      if (this.playing.myTurn) {
        this.changeTurn()
      }
    }

    this.checkWinner()

  }

  timeoutSendBotMove: any = setTimeout(() => {}, 0)
  async sendBotMove(): Promise<void> {
    clearTimeout(this.timeoutSendBotMove)
    this.timeoutSendBotMove = setTimeout(() => {
      this.botService.makeMove(this.display.maniples).then(() => {
        this.changeTurn()
      })
    }, 1000)
  }

  async changeTurn(): Promise<void> {
    if (this.playing.myTurn) {
      this.display.interaction = 'none'
      this.playing.myTurn = false
      this.playing.me.stamina = this.maxStamina
      this.display.canAttack = { infantry: true, archer: true, mounted: true }
      await this.sendBotMove()
    } else if (!this.playing.myTurn) {
      this.display.interaction = 'move'
      this.playing.myTurn = true
      this.playing.enemy.stamina = this.maxStamina
      this.display.canAttack = { infantry: true, archer: true, mounted: true }
    }
  }

  trackManiple(index: number, item: any) {
    return 'maniple'+index
  }

  getXY(e: any): Array<number> {
    if (e.touches && e.touches[0]) {
      return [e.touches[0].clientX, e.touches[0].clientY]
    } else if (e?.changedTouches && e.changedTouches[0]) {
      return [e.changedTouches[0].clientX, e.changedTouches[0].clientY]
    }

    return [e.clientX, e.clientY]
  }

  getCountType(type: string) {
    let count = 0
    this.deployment.forEach((d: any) => d.type === type ? count++ : false)
    return count
  }

  getId(arr: Array<any>): number {
    let id = 0
    arr.forEach((item: any) => {
      if (id < item.id) id = item.id
    })
    return id+1
  }

  checkBan(maniple: any): boolean {
    const w1 = maniple.formation*this.getCellWidth()
    const h1 = Math.ceil(maniple.hps.length/maniple.formation)*this.getCellHeight()

    let answer = false
    this.deployment.forEach((m: any) => {
      const w2 = m.formation*this.getCellWidth()
      const h2 = Math.ceil(m.hps.length/m.formation)*this.getCellHeight()
      if (m.id !== maniple.id && maniple.x+w1-0.001 > m.x && maniple.x+0.001 < m.x+w2) {
        if (maniple.y+h1-0.001 > m.y && maniple.y+0.001 < m.y+h2) {
          answer = true
        }
      }
    })
    return answer
  }

  checkBanInGame(maniple: any): boolean {
    const w1 = maniple.formation
    const h1 = Math.ceil(maniple.hps.length/maniple.formation)

    let answer = false

    if (maniple.x < 0 || maniple.y < 0 || maniple.x+w1 > this.display.grid.w || maniple.y+h1 > this.display.grid.h) {
      answer = true
    } else {
      this.display.maniples.forEach((m: any) => {
        const w2 = m.formation
        const h2 = Math.ceil(m.hps.length/m.formation)

        if (m.id !== maniple.id && maniple.x+w1 > m.x && maniple.x < m.x+w2) {
          if (maniple.y+h1 > m.y && maniple.y < m.y+h2) {
            answer = true
          }
        }
      })
    }

    return answer
  }

  getArray(length: number, fill: any) {
    return new Array(length).fill(fill)
  }

  setEnemyArmy(): void {

    let formation = 6
    let hps = [100]
    for (let i = 0; i < 4; i++) {
      let type = 'infantry'
      if (i === 0 || i === 1) {
        type = 'infantry'
        formation = this.configService.infantry.formation
        hps = new Array(this.configService.infantry.length).fill(this.configService.infantry.hp)
      }

      if (i === 2) {
        type = 'archer'
        formation = this.configService.archer.formation
        hps = new Array(this.configService.archer.length).fill(this.configService.archer.hp)
      }

      if (i === 3) {
        type = 'mounted'
        formation = this.configService.mounted.formation
        hps = new Array(this.configService.mounted.length).fill(this.configService.mounted.hp)
      }

      let [x, y] = [
        Math.floor(Math.random()*(this.display.grid.w-formation)),
        Math.floor(Math.random()*((this.display.grid.h-Math.floor((2/3)*this.display.grid.h)-Math.ceil(hps.length/formation))))
      ]

      const maniple = {
        id: this.getId(this.display.maniples),
        x,
        y,
        formation,
        color: this.enemyColor,
        type,
        hps,
        direction: 'bottom',
        me: false
      }

      if (!this.checkBanInGame(maniple)) {
        this.display.maniples.push(maniple)
      } else {
        i--
      }
    }

  }

  onChooseMenu(id: number): void {
    this.menu.show = false
    if (id === 1) {
      this.display.interaction = 'move'
    } else if (id === 2) {
      this.display.interaction = 'attack'
    } else if (id === 3) {
      this.display.interaction = 'rotate'
    } else if (id === 4) {
      this.changeTurn()
    }
  }

  imReady(): void {
    if (this.maxManiple.infantry-this.getCountType('infantry') > 0 || this.maxManiple.archer-this.getCountType('archer') > 0 || this.maxManiple.mounted-this.getCountType('mounted') > 0) return

    this.deployment.forEach((m: any) => {
      this.display.maniples.push({
        id: m.id,
        x: m.xCell,
        y: m.yCell,
        formation: m.formation,
        color: m.color,
        type: m.type,
        hps: [...m.hps],
        direction: 'top',
        me: true
      })
    })
    this.deployment = []
    this.stage = 'battle'


    this.setEnemyArmy()
  }

  reloadPage(): void {
    window.location.reload()
  }

  dblClick(): void {
    if (!this.winner.show) this.menu.show = true
  }

  touchStartPointer(e: any): void {
    if (!this.mouse.dbl) {
      this.mouse.dbl = true
      clearTimeout(this.mouse.timeout)
      this.mouse.timeout = setTimeout(() => {
        this.mouse.dbl = false
      }, 200)
    } else {
      this.dblClick()
      this.mouse.dbl = false
      clearTimeout(this.mouse.timeout)
    }
  }

  startPointer(e: any): void {
    this.mouse.active = true
    const [x, y] = this.getXY(e)
    let target = e.target
    while (target.tagName !== 'APP-MANIPLE') {
      if (target.tagName === 'BODY') return
      target = target.parentNode
    }
    const type = target.getAttribute('type')

    if (this.getCountType(type) >= this.maxManiple[type]) {
      this.mouse.active = false
      return
    }

    const rectTarget = target.getBoundingClientRect()

    this.mouse.delta = {
      x: x-rectTarget.x,
      y: y-rectTarget.y
    }

    const coord = {
      x: x-this.mouse.delta.x,
      y: y-this.mouse.delta.y
    }

    let id = parseInt(target.getAttribute('idmaniple'))
    if (id) {
      this.deployment.map((m: any) => {
        if (m.id === id) m.moving = true
        return m
      })
      return
    }

    if (type === 'infantry') {
      this.deployment.push({
        id: this.getId(this.deployment),
        ban: true,
        moving: true,
        x: coord.x,
        y: coord.y,
        width: this.configService.infantry.formation*this.getCellWidth(),
        height: Math.ceil(this.configService.infantry.length/this.configService.infantry.formation)*this.getCellHeight(),
        color: this.myColor,
        type,
        hps: new Array(this.configService.infantry.length).fill(this.configService.infantry.hp),
        formation: this.configService.infantry.formation
      })
    } else if (type === 'archer') {
      this.deployment.push({
        id: this.getId(this.deployment),
        ban: true,
        moving: true,
        x: coord.x,
        y: coord.y,
        width: this.configService.archer.formation*this.getCellWidth(),
        height: Math.ceil(this.configService.archer.length/this.configService.archer.formation)*this.getCellHeight(),
        color: this.myColor,
        type,
        hps: new Array(this.configService.archer.length).fill(this.configService.archer.hp),
        formation: this.configService.archer.formation
      })
    } else if (type === 'mounted') {
      this.deployment.push({
        id: this.getId(this.deployment),
        ban: true,
        moving: true,
        x: coord.x,
        y: coord.y,
        width: this.configService.mounted.formation*this.getCellWidth(),
        height: Math.ceil(this.configService.mounted.length/this.configService.mounted.formation)*this.getCellHeight(),
        color: this.myColor,
        type,
        hps: new Array(this.configService.mounted.length).fill(this.configService.mounted.hp),
        formation: this.configService.mounted.formation
      })
    }
  }

  movePointer(e: any): void {
    if (!this.mouse.active) return

    const displayRect = this.displayRef.nativeElement.getBoundingClientRect()

    const [x, y] = this.getXY(e)

    let maniple = this.deployment.find((m: any) => m.moving)

    let [xCell, yCell] = [
      Math.floor(((x-this.mouse.delta.x)-displayRect.x)/this.getCellWidth()),
      Math.floor(((y-this.mouse.delta.y)-displayRect.y)/this.getCellHeight())
    ]

    if (xCell < 0 || yCell < Math.floor(this.display.grid.h*(2/3)) || xCell+maniple.formation > this.display.grid.w || yCell+Math.ceil(maniple.hps.length/maniple.formation) > this.display.grid.h) {
      maniple.ban = true
    } else {
      maniple.ban = false
    }

    if (maniple.ban) {
      maniple.x = x-this.mouse.delta.x
      maniple.y = y-this.mouse.delta.y
    } else {
      maniple.xCell = xCell
      maniple.yCell = yCell

      maniple.x = displayRect.x+xCell*this.getCellWidth()
      maniple.y = displayRect.y+yCell*this.getCellHeight()

      maniple.ban = this.checkBan(maniple)
    }
  }

  endPointer(e: any): void {
    this.playing.me.potentialStamina = 0
    this.playing.enemy.potentialStamina = 0

    this.mouse.active = false

    let maniple = this.deployment.find((m: any) => m.moving)
    if (!maniple) return
    maniple.moving = false
    if (maniple.ban) {
      this.deployment = this.deployment.filter((m: any) => m.id !== maniple.id)
    }

  }

  async test(): Promise<void> {
    let m = this.display.maniples.find((m: any) => m.id === 5)
    // let myManiples = this.display.maniples.filter((m: any) => m.me)
    await this.asyncService.delay(300)
    //
    // await this.botService.rotate(m, 'right')
    //
    // await this.botService.step(m, 'right', 3)
    //
    // await this.botService.step(m, 'bottom', 5)

    // await this.botService.step(m, 'bottom', 10)

    // this.botService.makeMove(this.display.maniples)

    // let test = {...m}
    // test.x = 2
    // test.y = 0
    // console.log(this.botService.checkBan(this.display.maniples, test))

    // console.log(this.botService.bestPosition(this.display.maniples, m))

    // console.log( this.botService.searchPath(this.display.maniples, m, { x: 4, y: 4 }) )

    // console.log( this.botService.searchRotate(this.display.maniples, m, 'right'))

    // this.botService.potentialDamage(m)
    // console.log(this.botService.potentialDamage(myManiples, m, 0, 18, 'right'))
    // this.botService.potentialDamage(m)
    // await this.botService.step(m, 'left', 1)
    // await this.botService.rotate(m, 'right')
    // await this.botService.attack(m, [15*this.getCellWidth(), 15*this.getCellHeight()])
    // await this.botService.attack(m, [15*this.getCellWidth(), 20*this.getCellHeight()])
    // await this.botService.attack(m, [15*this.getCellWidth(), 25*this.getCellHeight()])
  }

  ngOnInit(): void {
    this.setSize()

    this.test()

    this.isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
  }

  ngAfterViewInit(): void {

  }

}

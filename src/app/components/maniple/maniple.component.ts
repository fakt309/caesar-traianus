import { Component, OnInit, Input, HostBinding, ElementRef } from '@angular/core'
import { IconService } from '@services/icon.service'

@Component({
  selector: 'app-maniple',
  templateUrl: './maniple.component.html',
  styleUrls: ['./maniple.component.scss']
})
export class ManipleComponent implements OnInit {

  @HostBinding('style.width.px') @Input() width: number = 100
  @HostBinding('style.height.px') @Input() height: number = 100
  @Input() color: string = "#ffffff"
  @Input() type: 'infantry' | 'mounted' | 'archer' = 'infantry'
  @Input() hps: Array<number> = []
  @Input() formation: number = 5

  margin: number = 0.02

  constructor(
    private host: ElementRef,
    public iconService: IconService
  ) { }

  getLengthX(): number {
    return this.formation
  }

  getLengthY(): number {
    return Math.ceil(this.hps.length/this.formation)
  }

  getWidthCenturia(): number {
    return this.width/this.formation-2*this.margin*this.width
  }

  getHeightCenturia(): number {
    return this.height/this.getLengthY()-2*this.margin*this.height
  }

  getCoordX(idx: number): number {
    let aliveBefore = 0
    let aliveAll = 0
    for (let i = 0; i < this.hps.length; i++) {
      if (this.hps[i] > 0) aliveAll++
      if (this.hps[i] > 0 && i < idx) aliveBefore++
    }

    let x = this.getWidthCenturia()*(aliveBefore%this.getLengthX())+this.margin*this.width*(2*(aliveBefore%this.getLengthX())+1)

    if ((Math.floor(aliveBefore/this.getLengthX())+1 === Math.ceil(aliveAll/this.getLengthX())) && Math.ceil(aliveAll/this.getLengthX()) > 1) {
      let empty = (this.getLengthX()*this.getLengthY()-aliveAll)%this.getLengthX()
      x += this.getWidthCenturia()*Math.floor(empty/2)+this.margin*this.width*(2*Math.floor(empty/2))
    }

    return x
  }

  getCoordY(idx: number): number {
    let aliveBefore = 0
    for (let i = 0; i < idx; i++) {
      if (this.hps[i] > 0) aliveBefore++
    }

    let y = this.getHeightCenturia()*Math.floor(aliveBefore/this.getLengthX())+this.margin*this.height*(2*Math.floor(aliveBefore/this.getLengthX())+1)

    return y
  }

  trackCenturia(index: number, item: any) {
    return 'centuria'+index
  }

  setSize(): void {
    let aliveAll = 0
    for (let i = 0; i < this.hps.length; i++) {
      if (this.hps[i] > 0) aliveAll++
    }

    let w = aliveAll < this.getLengthX() ? aliveAll : this.getLengthX()
    let h = Math.ceil(aliveAll/this.getLengthX())

    this.host.nativeElement.style.width = `${this.getWidthCenturia()*w+this.margin*this.width*2*w}px`
    this.host.nativeElement.style.height = `${this.getHeightCenturia()*h+this.margin*this.height*2*h}px`
  }

  ngOnInit(): void { }

  ngDoCheck(): void {
    this.setSize()
  }

}

import { Component, OnInit, Input, HostBinding } from '@angular/core'
import { IconService } from '@services/icon.service'

@Component({
  selector: 'app-arrow',
  templateUrl: './arrow.component.html',
  styleUrls: ['./arrow.component.scss']
})
export class ArrowComponent implements OnInit {

  @Input() x1: number = 0
  @Input() y1: number = 0
  @Input() x2: number = 0
  @Input() y2: number = 0
  @HostBinding('style.width.px') @Input() width: number = 20

  @HostBinding('style.height.px') height: number = 0
  @HostBinding('style.left.px') left: number = 0
  @HostBinding('style.top.px') top: number = 0
  @HostBinding('style.transform') transform: string = `rotate(0deg)`

  heightBody: number = 0

  constructor(
    public iconService: IconService
  ) { }

  getLength(): number {
    return ((this.x2-this.x1)**2+(this.y2-this.y1)**2)**(1/2)
  }

  getAngle(): number {
    if (this.y2 >= this.y1 && this.x2 >= this.x1) {
      return Math.atan((this.y2-this.y1)/(this.x2-this.x1))
    } else if ((this.y2 < this.y1 && this.x2 < this.x1) || (this.y2 >= this.y1 && this.x2 <= this.x1)) {
      return Math.atan((this.y2-this.y1)/(this.x2-this.x1))+Math.PI
    } else if (this.y2 <= this.y1 && this.x2 >= this.x1) {
      return Math.atan((this.y2-this.y1)/(this.x2-this.x1))+2*Math.PI
    }
    return 0
  }

  radToDeg(rad: number): number {
    return rad*180/Math.PI
  }

  setPosition(): void {
    this.heightBody = this.getLength()-this.width
    if (this.heightBody < 0.1) this.heightBody = 0
    this.height = this.getLength()
    this.left = this.x1-this.width/2
    this.top = this.y1
    this.transform = `rotate(${this.getAngle()+3/2*Math.PI}rad)`
  }

  ngOnInit(): void {
    this.setPosition()
  }

  ngDoCheck(): void {
    this.getLength()
    this.setPosition()
  }

}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-attack',
  templateUrl: './attack.component.html',
  styleUrls: ['./attack.component.scss']
})
export class AttackComponent implements OnInit {

  @Input() type: 'melee' | 'range' = 'melee'
  @Input() x1: number = 0
  @Input() y1: number = 0
  @Input() x2: number = 0
  @Input() y2: number = 0
  @Input() width: number = 0
  @Input() height: number = 0
  @Input() grid: { w: number, h: number } = { w: 0, h: 0 }
  @Input() mode: 'horizontal' | 'vertical' = 'horizontal'

  margin: number = 0
  rotate: number = 0

  constructor() { }

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

  getLength(): number {
    return ((this.x2-this.x1)**2+(this.y2-this.y1)**2)**(1/2)
  }

  setPosition(): void {
    this.rotate = this.getAngle()+3/2*Math.PI
  }

  ngDoCheck(): void {
    this.setPosition()
  }

  ngOnInit(): void {
  }

}

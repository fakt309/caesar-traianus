 import { Component, OnInit, Input } from '@angular/core'
 import { ConfigService } from '@services/config.service'

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent implements OnInit {

  @Input() interaction: 'move' | 'attack' | 'rotate' | 'none' = 'none'
  @Input() image: string = 'assets/spqr.png'
  @Input() color: string = '#bc2e2e'
  @Input() name: string = 'Rome'
  @Input() mana: any = { value: this.configService.fullStamina, potential: 0 }

  constructor(
    public configService: ConfigService
  ) { }

  getIcon(): string {
    if (this.interaction === 'move') {
      return '/assets/move.svg'
    } else if (this.interaction === 'attack') {
      return '/assets/sword.svg'
    } else if (this.interaction === 'rotate') {
      return '/assets/rotate.svg'
    }

    return ''
  }

  ngOnInit(): void {
  }

}

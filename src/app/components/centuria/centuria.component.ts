import { Component, OnInit, Input, AfterViewInit, HostBinding } from '@angular/core'
import { IconService } from '@services/icon.service'

@Component({
  selector: 'app-centuria',
  templateUrl: './centuria.component.html',
  styleUrls: ['./centuria.component.scss']
})
export class CenturiaComponent implements OnInit, AfterViewInit {

  @HostBinding('style.width.px') @Input() width: number = 20
  @HostBinding('style.height.px') @Input() height: number = 20
  @Input() color: string = "#ffffff"
  @Input() type: 'infantry' | 'mounted' | 'archer' = 'infantry'
  @Input() hp: number = 100

  constructor(
    public iconService: IconService
  ) { }

  getIcon(): string {
    if (this.type === 'infantry') {
      return `url("${this.iconService.get('sword', this.color)}")`
    } else if (this.type === 'mounted') {
      return `url("${this.iconService.get('horse', this.color)}")`
    } else if (this.type === 'archer') {
      return `url("${this.iconService.get('bow', this.color)}")`
    }
    return ''
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void { }

}

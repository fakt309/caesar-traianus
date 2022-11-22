import { Component, OnInit, HostBinding } from '@angular/core'
import { IconService } from '@services/icon.service'

@Component({
  selector: 'app-bow-arrow',
  templateUrl: './bow-arrow.component.html',
  styleUrls: ['./bow-arrow.component.scss']
})
export class BowArrowComponent implements OnInit {

  @HostBinding('style.background-image') background: string = `url("${this.iconService.get('arrow')}")`

  constructor(
    private iconService: IconService
  ) { }

  ngOnInit(): void {
  }

}

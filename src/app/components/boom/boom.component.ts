import { Component, OnInit, Input, HostBinding } from '@angular/core'
import { IconService } from '@services/icon.service'

@Component({
  selector: 'app-boom',
  templateUrl: './boom.component.html',
  styleUrls: ['./boom.component.scss']
})
export class BoomComponent implements OnInit {

  @HostBinding('style.background-image') background: string = `url("${this.iconService.get('explosion', '#ffeb3b', '#000000')}")`

  constructor(
    private iconService: IconService
  ) { }

  ngOnInit(): void {
  }

}

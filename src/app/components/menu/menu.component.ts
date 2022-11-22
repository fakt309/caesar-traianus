import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core'
import { trigger,transition, style, animate } from '@angular/animations'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    trigger('shooout', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('0.2s', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        animate('0.2s', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})
export class MenuComponent implements OnInit {

  @HostBinding('@shooout') shooout: string = 'in'

  @Input() options: Array<{ id: number, title: string, icon: string }> = []
  @Output() onChoose: EventEmitter<number> = new EventEmitter<number>()

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mana',
  templateUrl: './mana.component.html',
  styleUrls: ['./mana.component.scss']
})
export class ManaComponent implements OnInit {

  @Input() value: number = 100
  @Input() potential: number = 100
  @Input() max: number = 100

  constructor() { }

  ngOnInit(): void {
  }

}

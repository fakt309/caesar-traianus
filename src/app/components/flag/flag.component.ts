import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-flag',
  templateUrl: './flag.component.html',
  styleUrls: ['./flag.component.scss']
})
export class FlagComponent implements OnInit {

  @Input() color: string = '#bc2e2e'
  @Input() image: string = 'assets/spqr.png'

  constructor() { }

  ngOnInit(): void {
  }

}

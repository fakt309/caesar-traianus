import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { PageHomeComponent } from './components/page-home/page-home.component'
import { PageGameComponent } from './components/page-game/page-game.component'

const routes: Routes = [
  {
    component: PageHomeComponent,
    path: ''
  }, {
    component: PageGameComponent,
    path: 'play'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

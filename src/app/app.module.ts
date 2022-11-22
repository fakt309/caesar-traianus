import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component';
import { DisplayComponent } from './components/display/display.component';
import { CenturiaComponent } from './components/centuria/centuria.component';
import { ManipleComponent } from './components/maniple/maniple.component';
import { PageHomeComponent } from './components/page-home/page-home.component';
import { QuotePipe } from './pipes/quote.pipe';
import { ArrowComponent } from './components/arrow/arrow.component';
import { AttackComponent } from './components/attack/attack.component';
import { BoomComponent } from './components/boom/boom.component';
import { BowArrowComponent } from './components/bow-arrow/bow-arrow.component';
import { PageGameComponent } from './components/page-game/page-game.component';
import { FlagComponent } from './components/flag/flag.component';
import { InfoCardComponent } from './components/info-card/info-card.component';
import { ManaComponent } from './components/mana/mana.component';
import { MenuComponent } from './components/menu/menu.component'

@NgModule({
  declarations: [
    AppComponent,
    DisplayComponent,
    CenturiaComponent,
    ManipleComponent,
    PageHomeComponent,
    QuotePipe,
    ArrowComponent,
    AttackComponent,
    BoomComponent,
    BowArrowComponent,
    PageGameComponent,
    FlagComponent,
    InfoCardComponent,
    ManaComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

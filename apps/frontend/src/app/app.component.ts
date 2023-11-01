import { AsyncPipe, JsonPipe } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ToastServiceHostComponent } from '@stochus/daisy-ui'
import { NavbarComponent } from './navbar/navbar.component'
import { NxWelcomeComponent } from './nx-welcome.component'

@Component({
  standalone: true,
  imports: [
    NxWelcomeComponent,
    RouterModule,
    AsyncPipe,
    HttpClientModule,
    JsonPipe,
    NavbarComponent,
    ToastServiceHostComponent,
  ],
  selector: 'stochus-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}

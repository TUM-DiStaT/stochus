import { HttpClientModule } from '@angular/common/http'
import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ToastServiceHostComponent } from '@stochus/daisy-ui'
import { FooterComponent } from './footer/footer.component'
import { NavbarComponent } from './navbar/navbar.component'

@Component({
  standalone: true,
  imports: [
    RouterModule,
    HttpClientModule,
    NavbarComponent,
    ToastServiceHostComponent,
    FooterComponent,
  ],
  selector: 'stochus-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}

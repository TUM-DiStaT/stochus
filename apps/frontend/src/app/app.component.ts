import { AsyncPipe, JsonPipe } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { NgChartsConfiguration } from 'ng2-charts'
import { ToastServiceHostComponent } from '@stochus/daisy-ui'
import { NavbarComponent } from './navbar/navbar.component'

@Component({
  standalone: true,
  imports: [
    RouterModule,
    AsyncPipe,
    HttpClientModule,
    JsonPipe,
    NavbarComponent,
    ToastServiceHostComponent,
  ],
  providers: [
    {
      provide: NgChartsConfiguration,
      useValue: {
        generateColors: true,
      } satisfies NgChartsConfiguration,
    },
  ],
  selector: 'stochus-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}

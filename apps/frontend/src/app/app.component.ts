import { AsyncPipe, JsonPipe } from '@angular/common'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { RouterModule } from '@angular/router'
import { Subject } from 'rxjs'
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
export class AppComponent implements OnInit {
  hello$ = new Subject()

  constructor(private readonly http: HttpClient) {}

  ngOnInit() {
    this.getData()
  }

  getData() {
    this.http.get('/api/hello').subscribe(this.hello$)
  }
}

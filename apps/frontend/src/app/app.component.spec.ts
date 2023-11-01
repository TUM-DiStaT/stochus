import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import 'reflect-metadata'
import { KeycloakTestingModule } from '@stochus/auth/frontend'
import { AppComponent } from './app.component'
import { NxWelcomeComponent } from './nx-welcome.component'

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        NxWelcomeComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        KeycloakTestingModule,
      ],
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })
})

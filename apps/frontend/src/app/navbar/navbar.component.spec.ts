import { ComponentFixture, TestBed } from '@angular/core/testing'
import 'reflect-metadata'
import { NEVER } from 'rxjs'
import { KeycloakTestingModule, UserService } from '@stochus/auth/frontend'
import { StudiesService } from '@stochus/studies/frontend-static'
import { NavbarComponent } from './navbar.component'

describe('NavbarComponent', () => {
  let component: NavbarComponent
  let fixture: ComponentFixture<NavbarComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent, KeycloakTestingModule],
      providers: [
        {
          provide: UserService,
          useValue: {
            userHasRole: () => NEVER,
          },
        },
        {
          provide: StudiesService,
          useValue: {
            userHasRole: () => NEVER,
          },
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(NavbarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

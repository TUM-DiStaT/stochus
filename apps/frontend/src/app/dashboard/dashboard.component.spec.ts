import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import 'reflect-metadata'
import { NEVER } from 'rxjs'
import {
  StudiesParticipationService,
  StudiesService,
} from '@stochus/studies/frontend-static'
import { DashboardComponent } from './dashboard.component'

describe('DashboardComponent', () => {
  let component: DashboardComponent
  let fixture: ComponentFixture<DashboardComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        HttpClientTestingModule,
        {
          provide: StudiesParticipationService,
          useValue: {},
        },
        {
          provide: StudiesService,
          useValue: {
            getAllForStudent: () => NEVER,
          },
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(DashboardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

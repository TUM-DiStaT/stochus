import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import 'reflect-metadata'
import { NEVER } from 'rxjs'
import { StudiesService } from '../studies.service'
import { StudiesManagementOverviewComponent } from './studies-management-overview.component'

describe('StudiesManagementOverviewComponent', () => {
  let component: StudiesManagementOverviewComponent
  let fixture: ComponentFixture<StudiesManagementOverviewComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudiesManagementOverviewComponent, RouterTestingModule],
      providers: [
        {
          provide: StudiesService,
          useValue: {
            getAllOwnedByUser: () => NEVER,
          },
        },
      ],
      declarations: [],
    }).compileComponents()

    fixture = TestBed.createComponent(StudiesManagementOverviewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

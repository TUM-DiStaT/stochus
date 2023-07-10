import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute } from '@angular/router'
import 'reflect-metadata'
import { AssignmentsListComponent } from './assignments-list.component'

describe('AssignmentsListComponent', () => {
  let component: AssignmentsListComponent
  let fixture: ComponentFixture<AssignmentsListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentsListComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(AssignmentsListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

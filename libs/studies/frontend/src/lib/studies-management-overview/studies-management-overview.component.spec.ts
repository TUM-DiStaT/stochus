import { ComponentFixture, TestBed } from '@angular/core/testing'
import { StudiesManagementOverviewComponent } from './studies-management-overview.component'

describe('StudiesManagementOverviewComponent', () => {
  let component: StudiesManagementOverviewComponent
  let fixture: ComponentFixture<StudiesManagementOverviewComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudiesManagementOverviewComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(StudiesManagementOverviewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

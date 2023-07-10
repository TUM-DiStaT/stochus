import { ComponentFixture, TestBed } from '@angular/core/testing'
import { GuessRandomNumberConfigFormComponent } from './guess-random-number-config-form.component'

describe('GuessRandomNumberConfigFormComponent', () => {
  let component: GuessRandomNumberConfigFormComponent
  let fixture: ComponentFixture<GuessRandomNumberConfigFormComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessRandomNumberConfigFormComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(GuessRandomNumberConfigFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '@stochus/daisy-ui'

@Component({
  selector: 'stochus-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}

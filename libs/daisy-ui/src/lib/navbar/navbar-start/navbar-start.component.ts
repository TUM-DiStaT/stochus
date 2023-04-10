import { Component, HostBinding } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'daisy-navbar-start',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-start.component.html',
})
export class NavbarStartComponent {
  @HostBinding('class')
  class = 'navbar-start'
}

import { CommonModule } from '@angular/common'
import { Component, HostBinding } from '@angular/core'

@Component({
  selector: 'daisy-navbar-center',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-center.component.html',
})
export class NavbarCenterComponent {
  @HostBinding('class')
  class = 'navbar-center'
}

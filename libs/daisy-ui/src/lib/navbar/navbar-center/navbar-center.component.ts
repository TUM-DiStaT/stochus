import { Component, HostBinding } from '@angular/core'
import { CommonModule } from '@angular/common'

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

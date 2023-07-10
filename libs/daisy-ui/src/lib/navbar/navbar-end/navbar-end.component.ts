import { CommonModule } from '@angular/common'
import { Component, HostBinding } from '@angular/core'

@Component({
  selector: 'daisy-navbar-end',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-end.component.html',
})
export class NavbarEndComponent {
  @HostBinding('class')
  class = 'navbar-end'
}

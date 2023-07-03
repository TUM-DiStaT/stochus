import { CommonModule } from '@angular/common'
import { Component, HostBinding } from '@angular/core'

@Component({
  selector: 'daisy-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  @HostBinding('class')
  class = 'navbar'
}

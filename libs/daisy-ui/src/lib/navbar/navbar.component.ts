import { Component, HostBinding } from '@angular/core'
import { CommonModule } from '@angular/common'

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

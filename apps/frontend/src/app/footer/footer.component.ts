import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { octMarkGithub } from '@ng-icons/octicons'

@Component({
  selector: 'stochus-footer',
  standalone: true,
  imports: [CommonModule, NgIconComponent, RouterLink],
  templateUrl: './footer.component.html',
  providers: [provideIcons({ octMarkGithub })],
})
export class FooterComponent {}

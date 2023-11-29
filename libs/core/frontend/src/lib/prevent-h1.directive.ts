import { Directive, OnInit } from '@angular/core'
import { MarkdownService } from 'ngx-markdown'

@Directive({
  selector: 'markdown[stochusPreventH1]',
  standalone: true,
})
export class PreventH1Directive implements OnInit {
  constructor(private readonly markdownService: MarkdownService) {}

  ngOnInit() {
    this.markdownService.renderer.heading = (text: string, level: number) => {
      const newLevel = Math.min(6, level + 1)
      return `<h${newLevel}>${text}</h${newLevel}>`
    }
  }
}

import { Directive, ViewContainerRef } from '@angular/core'

@Directive({
  selector: '[stochusDynamicContent]',
  standalone: true,
})
export class DynamicContentDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

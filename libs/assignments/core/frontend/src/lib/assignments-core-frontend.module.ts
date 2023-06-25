import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { assignmentsCoreFrontendRoutes } from './lib.routes'

@NgModule({
  imports: [CommonModule, RouterModule.forChild(assignmentsCoreFrontendRoutes)],
  exports: [RouterModule],
})
export class AssignmentsCoreFrontendModule {}

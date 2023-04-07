import { bootstrapApplication } from '@angular/platform-browser'
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router'
import { AppComponent } from './app/app.component'
import { appRoutes } from './app/app.routes'
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core'
import { initKeycloak } from '@stochus/auth/frontend'
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular'

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(KeycloakAngularModule),
    {
      provide: APP_INITIALIZER,
      useFactory: initKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
  ],
}).catch((err) => console.error(err))

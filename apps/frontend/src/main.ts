import { APP_INITIALIZER, importProvidersFrom } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { provideRouter } from '@angular/router'
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular'
import { initKeycloak } from '@stochus/auth/frontend'
import { AppComponent } from './app/app.component'
import { appRoutes } from './app/app.routes'

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(KeycloakAngularModule),
    {
      provide: APP_INITIALIZER,
      useFactory: initKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    provideRouter(appRoutes),
  ],
}).catch((err) => console.error(err))

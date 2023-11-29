import { HttpClientModule } from '@angular/common/http'
import { ApplicationConfig } from '@angular/core'
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core'
import { provideRouter } from '@angular/router'
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular'
import { MonacoEditorModule } from 'ngx-monaco-editor-v2'
import { initKeycloak } from '@stochus/auth/frontend'
import { appRoutes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(KeycloakAngularModule),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(MonacoEditorModule.forRoot()),
    {
      provide: APP_INITIALIZER,
      useFactory: initKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    provideRouter(appRoutes),
  ],
}

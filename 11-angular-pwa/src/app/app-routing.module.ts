import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountriesComponent } from './pages/countries/countries.component';
import { CountryComponent } from './pages/country/country.component';

const routes: Routes = [
  { path: '', component: CountriesComponent },
  { path: 'country/:id', component: CountryComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  /* para que no se tenga problemas al hacer algún deploy, por ejemplo, en GitHub Pages en este caso, porque la primera vez que se entra a la página desplegada que nos da GitHub Pages carga todo normal pero cuando se refresca entonces aparece un 404 Not Found propio de GitHub Pages */
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class AppRoutingModule {}

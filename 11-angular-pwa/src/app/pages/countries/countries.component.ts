import { Component, computed, inject } from '@angular/core';
import { CountryResponse } from 'src/app/interfaces/country.interface';
import { CountriesService } from 'src/app/services/countries.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css'],
})
export class CountriesComponent {
  /* INYECCIÓN DE DEPENDENCIAS */
  private countriesService = inject(CountriesService);

  /* VARIABLES */
  /* computed(....) toma una función que devuelve el valor calculado basado en los valores de los observables de entrada que seria "this.countriesService.countries()" */
  public countriesData = computed<CountryResponse[]>(() => {
    // console.log(this.countriesService.countries());

    return this.countriesService.countries();
  });
}

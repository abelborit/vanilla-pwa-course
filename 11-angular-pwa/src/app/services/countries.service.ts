import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { CountryResponse } from '../interfaces/country.interface';

@Injectable({ providedIn: 'root' })
export class CountriesService {
  constructor() {
    this.handleGetCountries();
  }

  /* CONSTANTES */
  private BASE_URL = 'https://restcountries.com/v3.1';

  /* INYECCIÓN DE DEPENDENCIAS */
  private httpClient = inject(HttpClient);

  /* VARIABLES */
  public countries = signal<CountryResponse[]>([]);

  /* MÉTODOS */
  private handleGetCountries(): void {
    console.log('handleGetCountries');

    this.httpClient
      .get<CountryResponse[]>(`${this.BASE_URL}/lang/spanish`)
      .pipe(
        tap((countriesArray) => console.log(countriesArray)),
        catchError(() => of([]))
      )
      .subscribe({
        next: (countriesResponse) => {
          console.log('countriesResponse');
          this.countries.set(countriesResponse);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  public handleGetCountryById(id: string): Observable<CountryResponse | null> {
    console.log({ country_id: id });

    return this.httpClient
      .get<CountryResponse[]>(`${this.BASE_URL}/alpha/${id}`)
      .pipe(
        // tap((countryInfo) => console.log(countryInfo)),
        map((countryInfo) => {
          return countryInfo.length > 0 ? countryInfo[0] : null;
        }),
        catchError(() => of(null))
      );
  }
}

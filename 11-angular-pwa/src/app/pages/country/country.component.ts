import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { CountryResponse } from 'src/app/interfaces/country.interface';
import { CountriesService } from 'src/app/services/countries.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css'],
})
export class CountryComponent implements OnInit {
  /* INYECCIÓN DE DEPENDENCIAS */
  private countriesService = inject(CountriesService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  /* VARIABLES */
  // public countryInfo = signal<CountryResponse | undefined>(undefined);
  public countryInfo: WritableSignal<CountryResponse | undefined> =
    signal(undefined);

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => {
          return this.countriesService.handleGetCountryById(id);
        })
      )
      .subscribe((response) => {
        // console.log(response);

        if (!response) {
          // console.log("there isn't country with this alpha code❌");
          return this.router.navigateByUrl('');
        }

        return this.countryInfo.set(response);
      });
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CountriesComponent } from './countries.component';
import { CountryResponse } from 'src/app/interfaces/country.interface';
import { mockCountries } from 'src/app/mockData/mockCountries.mock';
import { WritableSignal, signal } from '@angular/core';
import { CountriesService } from 'src/app/services/countries.service';
import { Observable, of } from 'rxjs';

/* hacer un mock del servicio para que no ingrese la lógica del servicio a este testing ya que el servicio tiene su propio testing. El mockCountriesService será un objeto que tenrá llaves por cada método/propiedad del servicio original los cuales algunos retornarán data ficticia o mockeada para simular su funcionamiento */
const mockCountriesService: {
  countries: WritableSignal<CountryResponse[]>;
  handleGetCountryById: (id: String) => Observable<CountryResponse | null>;
} = {
  countries: signal<CountryResponse[]>(mockCountries), // información ficticia
  handleGetCountryById: (mockId) => of(mockCountries[0]), // información ficticia
};

describe('CountriesComponent', () => {
  let component: CountriesComponent;
  let fixture: ComponentFixture<CountriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CountriesComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: CountriesService, useValue: mockCountriesService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountriesComponent); // instanciar el componente que queremos crear que previamente tiene que estar en declarations[....] del configureTestingModule({....})
    component = fixture.componentInstance; // obtener la instancia del componente que se ha generado
    fixture.detectChanges(); // tener todos los componentes ya en el onInit (tener todo ya renderizado) ya que en el testing se tiene que hacer todo de forma manual porque Angular no hace detección de cambios en el testing
  });

  it('should create CountriesComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call "countriesService.countries()", public countriesData = computed<CountryResponse[]>', () => {
    /* crear un espía para espiar un servicio y de ese servicio espiar un método/propiedad */
    const countriesSpy = spyOn(mockCountriesService, 'countries');
    countriesSpy.and.returnValue(mockCountries); // retornar la data mockeada en vez de lo que normalmente devolvería

    component.countriesData(); // llamar a la señal computada y luego hacer la verificación del test

    /* veritifación del test */
    expect(mockCountriesService.countries()).toEqual(mockCountries);
  });
});

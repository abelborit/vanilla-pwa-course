import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { WritableSignal, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { CountriesService } from 'src/app/services/countries.service';
import { CountryComponent } from './country.component';
import { CountryResponse } from 'src/app/interfaces/country.interface';
import { mockCountries } from 'src/app/mockData/mockCountries.mock';

const mockId: string = 'GTM';

/* haciendo un mock de los servicios que necesitaría para no colocar el servicio completo en las pruebas. Se coloca <Partial> porque se está haciendo uso parcial de las funcionalidades que tiene el servicio */
const mockActivatedRoute: Partial<ActivatedRoute> = {
  /* se está colocando un id por defecto GTM de Guatemala. El "mockActivatedRoute" es un objeto que tiene la llave "params" y en el "country.component.ts" regresa un observable entonces por eso se coloca "of(....)" y ahí adentro lo que regresaría que es el id "{ id: 'GTM' }" */
  params: of({ id: mockId }), // darle un valor mockeado a ActivatedRoute
};

const mockRouterSpy: jasmine.SpyObj<Partial<Router>> = {
  navigateByUrl: jasmine.createSpy('navigateByUrl'), // espiar el método navigateByUrl
};

/* hacer un mock del servicio para que no ingrese la lógica del servicio a este testing ya que el servicio tiene su propio testing. El mockCountriesService será un objeto que tenrá llaves por cada método/propiedad del servicio original los cuales algunos retornarán data ficticia o mockeada para simular su funcionamiento */
const mockCountriesService: {
  countries: WritableSignal<CountryResponse[]>;
  handleGetCountryById: (id: String) => Observable<CountryResponse | null>;
} = {
  countries: signal<CountryResponse[]>(mockCountries), // información ficticia
  handleGetCountryById: (mockId) => of(mockCountries[0]), // información ficticia
};

describe('CountryComponent', () => {
  let component: CountryComponent;
  let fixture: ComponentFixture<CountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CountryComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouterSpy },
        { provide: CountriesService, useValue: mockCountriesService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* ************************************************************************************************************************ */

  it('should create the CountryComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should have a variable "countryInfo" with "undefined" as default value, public countryInfo: WritableSignal<CountryResponse | undefined>', () => {
    /* crear una nueva señal con valor undefined por defecto */
    const countryInfo: WritableSignal<CountryResponse | undefined> =
      signal(undefined);

    /* asignar la señal creada al componente */
    /* countryInfo as unknown: Primero, countryInfo se convierte a unknown, que es un tipo que representa un valor que puede ser de cualquier tipo. Esta conversión permite que TypeScript acepte la asignación que viene a continuación. */
    /* as typeof fixture.componentInstance.countryInfo: A continuación, unknown se convierte al tipo de fixture.componentInstance.countryInfo. typeof aquí se utiliza para obtener el tipo de fixture.componentInstance.countryInfo, que es el tipo de la propiedad countryInfo en el componente fixture. */
    // fixture.componentInstance.countryInfo =
    //   countryInfo as unknown as typeof fixture.componentInstance.countryInfo;

    /* asignar la señal creada al componente de forma directa */
    fixture.componentInstance.countryInfo = countryInfo;

    /* actualizar la vista de la pantalla */
    fixture.detectChanges();

    /* Verificar que la variable countryInfo exista (porque será una función entonces debería existir y abajo recién se accede a su valor interno) */
    expect(fixture.componentInstance.countryInfo).toBeTruthy();

    /* Verificar que el valor interno de la señal sea undefined */
    expect(fixture.componentInstance.countryInfo()).toBeUndefined();
  });

  it('should call "handleGetCountryById" method with correct id', () => {
    /* crear un espía para espiar un servicio y de ese servicio espiar un método/propiedad */
    const handleGetCountryByIdSpy = spyOn(
      mockCountriesService,
      'handleGetCountryById'
    );

    /* FORMA 1: usando returnValue(....) */
    /* and.returnValue() se utiliza cuando se quiere que el espía devuelva un valor específico cuando se llama a la función espiada. Es útil cuando la función espiada siempre debe devolver el mismo valor predefinido */
    // handleGetCountryByIdSpy.and.returnValue(of(mockCountries[0])); // retornar la data mockeada en vez de lo que normalmente devolvería

    /* FORMA 2: usando callFake(() => ....) */
    /* and.callFake() se utiliza cuando se necesita un control más granular sobre el comportamiento del espía y se quiere definir nuestra propia lógica para la función espiada. Se puede usar para devolver diferentes valores en función de los argumentos pasados a la función espiada o realizar otras operaciones */
    handleGetCountryByIdSpy.and.callFake(() => of(mockCountries[0])); // retornar la data mockeada en vez de lo que normalmente devolvería

    component.ngOnInit(); // llamar al ngOnInit y luego hacer la verificación del test

    expect(mockCountriesService.handleGetCountryById).toHaveBeenCalledWith(
      mockId
    );
  });

  it('should call "countriesService.handleGetCountryById(id)", ngOnInit(): void', () => {
    /* crear un espía para espiar un servicio y de ese servicio espiar un método/propiedad */
    const handleGetCountryByIdSpy = spyOn(
      mockCountriesService,
      'handleGetCountryById'
    );
    handleGetCountryByIdSpy.and.returnValue(of(mockCountries[0])); // retornar la data mockeada en vez de lo que normalmente devolvería

    component.ngOnInit(); // llamar al ngOnInit y luego hacer la verificación del test

    /* veritifación del test */
    expect(mockCountriesService.handleGetCountryById).toHaveBeenCalled();
    // expect(mockCountriesService.countries).toEqual(mockCountries);
  });

  it('should render a title country with "Guatemala" value, <h1 data-testid="titleCountry">{{ countryInfo()?.name?.common }}</h1>', () => {
    /* Obtener el elemento HTML después de que fixture.detectChanges() haya actualizado la vista como está en el segundo beforeEach() */
    const elementHTML = fixture.debugElement.query(
      By.css('[data-testid=titleCountry]')
    );

    /* Realizar la verificación */
    expect(elementHTML.nativeElement.textContent).toBe('Guatemala');
  });

  it('should navigate to empty route if country id is not found', () => {
    /* crear un espía para espiar un servicio y de ese servicio espiar un método/propiedad */
    const handleGetCountryByIdSpy = spyOn(
      mockCountriesService,
      'handleGetCountryById'
    );
    handleGetCountryByIdSpy.and.returnValue(of(null));

    component.ngOnInit(); // llamar al ngOnInit y luego hacer la verificación del test

    /* Realizar la verificación */
    expect(mockRouterSpy.navigateByUrl).toHaveBeenCalledWith('');
  });
});

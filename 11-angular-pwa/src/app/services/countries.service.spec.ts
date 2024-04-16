import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CountriesService } from './countries.service';

describe('CountriesService', () => {
  let countriesService: CountriesService;

  /* cuando es testing para servicios no es necesario colocar el .compileComponents() al TestBed como en los componentes */
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    countriesService = TestBed.inject(CountriesService);
  });

  it('should be created CountriesService', () => {
    expect(countriesService).toBeTruthy();
  });
});

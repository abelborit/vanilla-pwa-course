import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  /* FORMA 2: waitForAsync(() => {......}) */
  beforeEach(waitForAsync(() => {
    /* el TestBed es la base por el medio que se hace testing en Angular, nos proveerá todo lo necesario para poder hacer el testing. Aquí estamos configurando un módulo de testing que es el "configureTestingModule" que será muy similar a lo que tiene el "app.module.ts" en este caso para que pueda funcionar el "app.component.ts" que es el componente que estamos haciendo el testing porque se tiene que colocar en un módulo con solo lo que necesite para que pueda funcionar */
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule], // para el enrutamiento porque se usa el "<router-outlet />" en el HTML
    }).compileComponents(); // para poder compilar los componentes que estoy especificando
  }));

  /* FORMA 2: asycn y await */
  // beforeEach(async () => {
  //   /* el TestBed es la base por el medio que se hace testing en Angular, nos proveerá todo lo necesario para poder hacer el testing. Aquí estamos configurando un módulo de testing que es el "configureTestingModule" que será muy similar a lo que tiene el "app.module.ts" en este caso para que pueda funcionar el "app.component.ts" que es el componente que estamos haciendo el testing porque se tiene que colocar en un módulo con solo lo que necesite para que pueda funcionar */
  //   await TestBed.configureTestingModule({
  //     declarations: [AppComponent],
  //     imports: [RouterTestingModule], // para el enrutamiento porque se usa el "<router-outlet />" en el HTML
  //   }).compileComponents(); // para poder compilar los componentes que estoy especificando
  // });

  it('should create the AppComponent', () => {
    /* crear un fixture para representar un componente. Recordar que el testing se ejecuta de manera independiente a la aplicación entonces tenemos que generarlo manualmente  usando "TestBed.createComponent(......);" y colocar el componente que queremos crear porque como este componente al final de cuentas es una simple clase entonces tiene que ser instanciada para ser ejecutada */
    const fixture = TestBed.createComponent(AppComponent);

    /* aquí se podría colocar como el nombre del archivo, es decir, "appComponent" o sino solo la primera parte "app" que será igual a la instancia del componente creado anteriormente, es decir "fixture.componentInstance;" */
    const app = fixture.componentInstance;

    /* lo que se espera de la prueba unitaria */
    expect(app).toBeTruthy();
  });

  it(`should have as title 'angular-pwa'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('angular-pwa');
  });

  /* se comenta esta prueba unitaria porque no se está haciendo uso del "title = 'angular-pwa';" en el archivo HTML */
  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('.content span')?.textContent).toContain(
  //     'angular-pwa app is running!'
  //   );
  // });
});

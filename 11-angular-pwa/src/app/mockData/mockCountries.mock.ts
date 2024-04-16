import {
  CountryResponse,
  Region,
  Side,
  StartOfWeek,
  Status,
} from 'src/app/interfaces/country.interface';

export const mockCountries: CountryResponse[] = [
  {
    name: {
      common: 'Guatemala',
      official: 'Republic of Guatemala',
      nativeName: {
        spa: {
          official: 'República de Guatemala',
          common: 'Guatemala',
        },
      },
    },
    tld: ['.gt'],
    cca2: 'GT',
    ccn3: '320',
    cca3: 'GTM',
    cioc: 'GUA',
    independent: true,
    status: Status.OfficiallyAssigned,
    unMember: true,
    currencies: {
      GTQ: {
        name: 'Guatemalan quetzal',
        symbol: 'Q',
      },
    },
    idd: {
      root: '+5',
      suffixes: ['02'],
    },
    capital: ['Guatemala City'],
    altSpellings: ['GT'],
    region: Region.Americas,
    subregion: 'Central America',
    languages: {
      spa: 'Spanish',
    },
    translations: {
      ara: {
        official: 'جمهورية غواتيمالا',
        common: 'غواتيمالا',
      },
      bre: {
        official: 'Republik Guatemala',
        common: 'Guatemala',
      },
      ces: {
        official: 'Republika Guatemala',
        common: 'Guatemala',
      },
      cym: {
        official: 'Republic of Guatemala',
        common: 'Guatemala',
      },
      deu: {
        official: 'Republik Guatemala',
        common: 'Guatemala',
      },
      est: {
        official: 'Guatemala Vabariik',
        common: 'Guatemala',
      },
      fin: {
        official: 'Guatemalan tasavalta',
        common: 'Guatemala',
      },
      fra: {
        official: 'République du Guatemala',
        common: 'Guatemala',
      },
      hrv: {
        official: 'Republika Gvatemala',
        common: 'Gvatemala',
      },
      hun: {
        official: 'Guatemalai Köztársaság',
        common: 'Guatemala',
      },
      ita: {
        official: 'Repubblica del Guatemala',
        common: 'Guatemala',
      },
      jpn: {
        official: 'グアテマラ共和国',
        common: 'グアテマラ',
      },
      kor: {
        official: '과테말라 공화국',
        common: '과테말라',
      },
      nld: {
        official: 'Republiek Guatemala',
        common: 'Guatemala',
      },
      per: {
        official: 'جمهوری گواتِمالا',
        common: 'گواتِمالا',
      },
      pol: {
        official: 'Republika Gwatemali',
        common: 'Gwatemala',
      },
      por: {
        official: 'República da Guatemala',
        common: 'Guatemala',
      },
      rus: {
        official: 'Республика Гватемала',
        common: 'Гватемала',
      },
      slk: {
        official: 'Guatemalská republika',
        common: 'Guatemala',
      },
      spa: {
        official: 'República de Guatemala',
        common: 'Guatemala',
      },
      srp: {
        official: 'Република Гватемала',
        common: 'Гватемала',
      },
      swe: {
        official: 'Republiken Guatemala',
        common: 'Guatemala',
      },
      tur: {
        official: 'Guatemala Cumhuriyeti',
        common: 'Guatemala',
      },
      urd: {
        official: 'جمہوریہ گواتیمالا',
        common: 'گواتیمالا',
      },
      zho: {
        official: '危地马拉共和国',
        common: '危地马拉',
      },
    },
    latlng: [15.5, -90.25],
    landlocked: false,
    borders: ['BLZ', 'SLV', 'HND', 'MEX'],
    area: 108889.0,
    demonyms: {
      eng: {
        f: 'Guatemalan',
        m: 'Guatemalan',
      },
      fra: {
        f: 'Guatémaltèque',
        m: 'Guatémaltèque',
      },
    },
    flag: '🇬🇹',
    maps: {
      googleMaps: 'https://goo.gl/maps/JoRAbem4Hxb9FYbVA',
      openStreetMaps: 'https://www.openstreetmap.org/relation/1521463',
    },
    population: 16858333,
    gini: {
      '2014': 48.3,
    },
    fifa: 'GUA',
    car: {
      signs: ['GCA'],
      side: Side.Right,
    },
    timezones: ['UTC-06:00'],
    continents: ['North America'],
    flags: {
      png: 'https://flagcdn.com/w320/gt.png',
      svg: 'https://flagcdn.com/gt.svg',
      alt: 'The flag of Guatemala is composed of three equal vertical bands of light blue, white and light blue, with the national coat of arms centered in the white band.',
    },
    coatOfArms: {
      png: 'https://mainfacts.com/media/images/coats_of_arms/gt.png',
      svg: 'https://mainfacts.com/media/images/coats_of_arms/gt.svg',
    },
    startOfWeek: StartOfWeek.Monday,
    capitalInfo: {
      latlng: [14.62, -90.52],
    },
    postalCode: {
      format: '#####',
      regex: '^(\\d{5})$',
    },
  },
  {
    name: {
      common: 'Cuba',
      official: 'Republic of Cuba',
      nativeName: {
        spa: {
          official: 'República de Cuba',
          common: 'Cuba',
        },
      },
    },
    tld: ['.cu'],
    cca2: 'CU',
    ccn3: '192',
    cca3: 'CUB',
    cioc: 'CUB',
    independent: true,
    status: Status.OfficiallyAssigned,
    unMember: true,
    currencies: {
      CUC: {
        name: 'Cuban convertible peso',
        symbol: '$',
      },
      CUP: {
        name: 'Cuban peso',
        symbol: '$',
      },
    },
    idd: {
      root: '+5',
      suffixes: ['3'],
    },
    capital: ['Havana'],
    altSpellings: ['CU', 'Republic of Cuba', 'República de Cuba'],
    region: Region.Americas,
    subregion: 'Caribbean',
    languages: {
      spa: 'Spanish',
    },
    translations: {
      ara: {
        official: 'جمهورية كوبا',
        common: 'كوبا',
      },
      bre: {
        official: 'Republik Kuba',
        common: 'Kuba',
      },
      ces: {
        official: 'Kubánská republika',
        common: 'Kuba',
      },
      cym: {
        official: 'Gweriniaeth Ciwba',
        common: 'Ciwba',
      },
      deu: {
        official: 'Republik Kuba',
        common: 'Kuba',
      },
      est: {
        official: 'Kuuba Vabariik',
        common: 'Kuuba',
      },
      fin: {
        official: 'Kuuban tasavalta',
        common: 'Kuuba',
      },
      fra: {
        official: 'République de Cuba',
        common: 'Cuba',
      },
      hrv: {
        official: 'Republika Kuba',
        common: 'Kuba',
      },
      hun: {
        official: 'Kubai Köztársaság',
        common: 'Kuba',
      },
      ita: {
        official: 'Repubblica di Cuba',
        common: 'Cuba',
      },
      jpn: {
        official: 'キューバ共和国',
        common: 'キューバ',
      },
      kor: {
        official: '쿠바 공화국',
        common: '쿠바',
      },
      nld: {
        official: 'Republiek Cuba',
        common: 'Cuba',
      },
      per: {
        official: 'جمهوری کوبا',
        common: 'کوبا',
      },
      pol: {
        official: 'Republika Kuby',
        common: 'Kuba',
      },
      por: {
        official: 'República de Cuba',
        common: 'Cuba',
      },
      rus: {
        official: 'Республика Куба',
        common: 'Куба',
      },
      slk: {
        official: 'Kubánska republika',
        common: 'Kuba',
      },
      spa: {
        official: 'República de Cuba',
        common: 'Cuba',
      },
      srp: {
        official: 'Република Куба',
        common: 'Куба',
      },
      swe: {
        official: 'Republiken Kuba',
        common: 'Kuba',
      },
      tur: {
        official: 'Küba Cumhuriyeti',
        common: 'Küba',
      },
      urd: {
        official: 'جمہوریہ کیوبا',
        common: 'کیوبا',
      },
      zho: {
        official: '古巴共和国',
        common: '古巴',
      },
    },
    latlng: [21.5, -80.0],
    landlocked: false,
    area: 109884.0,
    demonyms: {
      eng: {
        f: 'Cuban',
        m: 'Cuban',
      },
      fra: {
        f: 'Cubaine',
        m: 'Cubain',
      },
    },
    flag: '🇨🇺',
    maps: {
      googleMaps: 'https://goo.gl/maps/1dDw1QfZspfMUTm99',
      openStreetMaps: 'https://www.openstreetmap.org/relation/307833',
    },
    population: 11326616,
    fifa: 'CUB',
    car: {
      signs: ['C'],
      side: Side.Right,
    },
    timezones: ['UTC-05:00'],
    continents: ['North America'],
    flags: {
      png: 'https://flagcdn.com/w320/cu.png',
      svg: 'https://flagcdn.com/cu.svg',
      alt: 'The flag of Cuba is composed of five equal horizontal bands of blue alternating with white and a red equilateral triangle superimposed on the hoist side of the field. The triangle has its base on the hoist end, spans about two-fifth the width of the field and bears a white five-pointed star at its center.',
    },
    coatOfArms: {
      png: 'https://mainfacts.com/media/images/coats_of_arms/cu.png',
      svg: 'https://mainfacts.com/media/images/coats_of_arms/cu.svg',
    },
    startOfWeek: StartOfWeek.Monday,
    capitalInfo: {
      latlng: [23.12, -82.35],
    },
    postalCode: {
      format: 'CP #####',
      regex: '^(?:CP)*(\\d{5})$',
    },
  },
];

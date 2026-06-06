/**
 * MotoGP 2026 rider biographical data.
 * Sources: Wikipedia (individual rider pages) + 2026 MotoGP World Championship page.
 * wins = MotoGP premier-class feature race wins only (no sprints).
 * championships = FIM World Championship titles across all classes.
 * seasons = MotoGP seasons entered (including 2026).
 */
export interface MotoGPRiderData {
  givenName: string;
  familyName: string;
  nationality: string;   // matches NATIONALITY_FLAGS keys in overlay
  dateOfBirth: string;   // ISO 8601
  number: string;        // permanent race number
  wins: number;
  championships: number;
  seasons: number;
}

export const MOTOGP_RIDER_DATA: Record<string, MotoGPRiderData> = {
  'marco-bezzecchi': {
    givenName: 'Marco', familyName: 'Bezzecchi',
    nationality: 'Italian', dateOfBirth: '1998-11-12',
    number: '72', wins: 9, championships: 0, seasons: 5,
  },
  'jorge-martin': {
    givenName: 'Jorge', familyName: 'Martín',
    nationality: 'Spanish', dateOfBirth: '1998-01-29',
    number: '89', wins: 8, championships: 2, seasons: 6,
  },
  'fabio-di-giannantonio': {
    givenName: 'Fabio', familyName: 'Di Giannantonio',
    nationality: 'Italian', dateOfBirth: '1998-10-10',
    number: '49', wins: 2, championships: 0, seasons: 5,
  },
  'pedro-acosta': {
    givenName: 'Pedro', familyName: 'Acosta',
    nationality: 'Spanish', dateOfBirth: '2004-05-25',
    number: '37', wins: 0, championships: 2, seasons: 3,
  },
  'ai-ogura': {
    givenName: 'Ai', familyName: 'Ogura',
    nationality: 'Japanese', dateOfBirth: '2001-01-26',
    number: '79', wins: 0, championships: 1, seasons: 2,
  },
  'raul-fernandez': {
    givenName: 'Raúl', familyName: 'Fernández',
    nationality: 'Spanish', dateOfBirth: '2000-10-23',
    number: '25', wins: 1, championships: 0, seasons: 5,
  },
  'francesco-bagnaia': {
    givenName: 'Francesco', familyName: 'Bagnaia',
    nationality: 'Italian', dateOfBirth: '1997-01-14',
    number: '63', wins: 31, championships: 3, seasons: 8,
  },
  'marc-marquez': {
    givenName: 'Marc', familyName: 'Márquez',
    nationality: 'Spanish', dateOfBirth: '1993-02-17',
    number: '93', wins: 73, championships: 9, seasons: 13,
  },
  'alex-marquez': {
    givenName: 'Àlex', familyName: 'Márquez',
    nationality: 'Spanish', dateOfBirth: '1996-04-23',
    number: '73', wins: 4, championships: 2, seasons: 7,
  },
  'fermin-aldeguer': {
    givenName: 'Fermín', familyName: 'Aldeguer',
    nationality: 'Spanish', dateOfBirth: '2005-04-05',
    number: '54', wins: 1, championships: 0, seasons: 2,
  },
  'luca-marini': {
    givenName: 'Luca', familyName: 'Marini',
    nationality: 'Italian', dateOfBirth: '1997-08-10',
    number: '10', wins: 0, championships: 0, seasons: 6,
  },
  'enea-bastianini': {
    givenName: 'Enea', familyName: 'Bastianini',
    nationality: 'Italian', dateOfBirth: '1997-12-30',
    number: '23', wins: 7, championships: 1, seasons: 6,
  },
  'fabio-quartararo': {
    givenName: 'Fabio', familyName: 'Quartararo',
    nationality: 'French', dateOfBirth: '1999-04-20',
    number: '20', wins: 11, championships: 1, seasons: 8,
  },
  'brad-binder': {
    givenName: 'Brad', familyName: 'Binder',
    nationality: 'South_African', dateOfBirth: '1995-08-11',
    number: '33', wins: 2, championships: 1, seasons: 7,
  },
  'franco-morbidelli': {
    givenName: 'Franco', familyName: 'Morbidelli',
    nationality: 'Italian', dateOfBirth: '1994-12-04',
    number: '21', wins: 3, championships: 1, seasons: 9,
  },
  'johann-zarco': {
    givenName: 'Johann', familyName: 'Zarco',
    nationality: 'French', dateOfBirth: '1990-07-16',
    number: '5', wins: 2, championships: 2, seasons: 10,
  },
  'diogo-moreira': {
    givenName: 'Diogo', familyName: 'Moreira',
    nationality: 'Brazilian', dateOfBirth: '2004-04-23',
    number: '11', wins: 0, championships: 1, seasons: 1,
  },
  'joan-mir': {
    givenName: 'Joan', familyName: 'Mir',
    nationality: 'Spanish', dateOfBirth: '1997-09-01',
    number: '36', wins: 1, championships: 2, seasons: 8,
  },
  'alex-rins': {
    givenName: 'Álex', familyName: 'Rins',
    nationality: 'Spanish', dateOfBirth: '1995-12-08',
    number: '42', wins: 6, championships: 0, seasons: 10,
  },
  'maverick-vinales': {
    givenName: 'Maverick', familyName: 'Viñales',
    nationality: 'Spanish', dateOfBirth: '1995-01-12',
    number: '12', wins: 10, championships: 1, seasons: 11,
  },
  'augusto-fernandez': {
    givenName: 'Augusto', familyName: 'Fernández',
    nationality: 'Spanish', dateOfBirth: '1997-09-23',
    number: '47', wins: 0, championships: 1, seasons: 4,
  },
  'toprak-razgatlioglu': {
    givenName: 'Toprak', familyName: 'Razgatlıoğlu',
    nationality: 'Turkish', dateOfBirth: '1996-10-16',
    number: '7', wins: 0, championships: 3, seasons: 1,
  },
  'jack-miller': {
    givenName: 'Jack', familyName: 'Miller',
    nationality: 'Australian', dateOfBirth: '1995-01-18',
    number: '43', wins: 4, championships: 0, seasons: 12,
  },
};

// Maps abbreviated standings names → rider slug for API route
export const MOTOGP_RIDER_REFS: Record<string, string> = {
  'M. Bezzecchi':       'marco-bezzecchi',
  'J. Martín':          'jorge-martin',
  'F. Di Giannantonio': 'fabio-di-giannantonio',
  'P. Acosta':          'pedro-acosta',
  'A. Ogura':           'ai-ogura',
  'R. Fernández':       'raul-fernandez',
  'F. Bagnaia':         'francesco-bagnaia',
  'M. Márquez':         'marc-marquez',
  'A. Márquez':         'alex-marquez',
  'F. Aldeguer':        'fermin-aldeguer',
  'L. Marini':          'luca-marini',
  'E. Bastianini':      'enea-bastianini',
  'F. Quartararo':      'fabio-quartararo',
  'B. Binder':          'brad-binder',
  'F. Morbidelli':      'franco-morbidelli',
  'J. Zarco':           'johann-zarco',
  'D. Moreira':         'diogo-moreira',
  'J. Mir':             'joan-mir',
  'A. Rins':            'alex-rins',
  'M. Viñales':         'maverick-vinales',
  'A. Fernández':       'augusto-fernandez',
  'T. Razgatlıoğlu':   'toprak-razgatlioglu',
  'J. Miller':          'jack-miller',
};

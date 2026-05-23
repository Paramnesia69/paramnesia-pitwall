import type { NormalizedNewsItem } from '@/types';

/**
 * Curated motorsport news — sourced from motorsport.com, autosport.com, formula1.com, crash.net
 * Updated: 2026-05-23
 */
export const NEWS_ITEMS: NormalizedNewsItem[] = [
  // ─── F1 Canadian GP Weekend (May 22–24) ─────────────────
  {
    id: 'n-016',
    title: 'Russell grabs sprint pole position ahead of Antonelli and Norris',
    summary:
      'George Russell set a 1:12.965 to beat teammate Kimi Antonelli by 0.068s in Sprint Qualifying at Montreal, with the McLarens of Norris and Piastri locking out row two.',
    url: 'https://www.formula1.com/en/latest/article/russell-grabs-pole-position-in-canada-sprint-qualifying-ahead-of-antonelli-and-norris.7Fm9bjk84nwzOysiMriBCs',
    source: 'Formula1.com',
    publishedAt: '2026-05-22T21:30:00Z',
    series: ['f1'],
  },
  {
    id: 'n-017',
    title: "Russell 'never doubted' himself as he returns to pole position",
    summary:
      'After trailing Antonelli in recent rounds, Russell credits the new Mercedes upgrade package for helping him rediscover his qualifying edge at the Canadian GP.',
    url: 'https://www.formula1.com/en/latest/article/russell-never-doubted-himself-as-he-returns-to-pole-position-for-canada-sprint.2LfJ4u2mVXqhEJfiJjJabN',
    source: 'Formula1.com',
    publishedAt: '2026-05-22T22:00:00Z',
    series: ['f1'],
  },
  {
    id: 'n-001',
    title: 'Antonelli dominates Canadian GP practice amid three red flags',
    summary:
      'The Mercedes driver led the sole practice session at Montreal while teammate George Russell spun under braking.',
    url: 'https://www.autosport.com/f1/news/f1-canadian-gp-kimi-antonelli-dominates-practice-session-amid-three-red-flags/10823021/',
    source: 'Autosport',
    publishedAt: '2026-05-22T18:03:00Z',
    series: ['f1'],
  },
  {
    id: 'n-002',
    title: 'Mercedes and McLaren debut host of upgrades at Canadian GP',
    summary:
      'Mercedes brings its first major upgrade package of 2026 while McLaren deploys the second phase of its development plan including a new front wing.',
    url: 'https://www.autosport.com/f1/news/mercedes-and-mclaren-deploy-latest-upgrades-at-f1-canadian-gp/10823033/',
    source: 'Autosport',
    publishedAt: '2026-05-22T18:41:00Z',
    series: ['f1'],
  },
  {
    id: 'n-018',
    title: 'Cadillac details new upgrade package for Canadian GP',
    summary:
      'The Cadillac F1 team reveals updated front wing, floor, diffuser and rear suspension for its MAC-26 as the squad accelerates development in its debut season.',
    url: 'https://www.motorsport.com/f1/news/cadillac-details-new-f1-upgrade-package-for-canadian-gp/10822214/',
    source: 'Motorsport.com',
    publishedAt: '2026-05-22T14:00:00Z',
    series: ['f1'],
  },
  {
    id: 'n-004',
    title: "Leclerc: Ferrari is down on power 'even to Ford'",
    summary:
      'Charles Leclerc expresses concern about Ferrari\'s engine power deficit relative to Mercedes and other manufacturers in the 2026 season.',
    url: 'https://www.autosport.com/f1/news/charles-leclerc-claims-ferrari-is-down-on-engine-power-even-to-ford/10822764/',
    source: 'Autosport',
    publishedAt: '2026-05-22T09:38:00Z',
    series: ['f1'],
  },
  {
    id: 'n-006',
    title: 'The steps Antonelli and Mercedes have taken to solve his start problem',
    summary:
      "Analysis of Mercedes' technical adjustments to address Antonelli's recurring poor starts despite the team's competitive advantage.",
    url: 'https://www.autosport.com/f1/news/the-steps-antonelli-and-mercedes-have-taken-to-solve-his-f1-start-problem/10822962/',
    source: 'Autosport',
    publishedAt: '2026-05-22T15:38:00Z',
    series: ['f1'],
  },
  {
    id: 'n-003',
    title: 'Haas warns against raising F1 cost cap to fix 2027 power unit issues',
    summary:
      'Team principal Ayao Komatsu cautions that solving regulatory problems through budget increases contradicts cost control objectives.',
    url: 'https://www.motorsport.com/f1/news/haas-warns-against-raising-f1-cost-cap-to-fix-2027-power-unit-issues/10822774/',
    source: 'Motorsport.com',
    publishedAt: '2026-05-22T19:04:00Z',
    series: ['f1'],
  },

  // ─── MotoGP ──────────────────────────────────────────────
  {
    id: 'n-019',
    title: 'Mir loses Catalan GP podium as five riders penalised for tyre pressure',
    summary:
      'Joan Mir dropped from second to outside the podium after a 16-second penalty for tyre pressure infringement in the twice-restarted Barcelona race.',
    url: 'https://www.autosport.com/motogp/news/final-catalan-gp-results-as-five-riders-penalised-and-joan-mir-loses-motogp-podium/10821731/',
    source: 'Autosport',
    publishedAt: '2026-05-22T11:00:00Z',
    series: ['motogp'],
  },
  {
    id: 'n-020',
    title: 'Joan Mir announces Honda exit, linked with Gresini Ducati for 2027',
    summary:
      'The 2020 world champion will leave Honda at the end of 2026 after growing frustrated by the manufacturer\'s silence on future plans, with Gresini Racing the likely destination.',
    url: 'https://www.motorsport.com/motogp/news/joan-mir-makes-honda-exit-decision-after-receiving-no-news-on-future/10821359/',
    source: 'Motorsport.com',
    publishedAt: '2026-05-21T16:00:00Z',
    series: ['motogp'],
  },
  {
    id: 'n-008',
    title: "Aprilia chief: Acosta shouldn't have been allowed in restarted Catalan GP",
    summary:
      'Aprilia Racing CEO Massimo Rivola questions the decision allowing Acosta to participate in the Barcelona race restart following a mechanical failure.',
    url: 'https://www.motorsport.com/motogp/news/aprlia-rivola-pedro-acosta-restart-catalan-gp-crash/10822600/',
    source: 'Motorsport.com',
    publishedAt: '2026-05-22T11:12:00Z',
    series: ['motogp'],
  },
  {
    id: 'n-009',
    title: 'Alex Marquez to miss next two MotoGP rounds after Barcelona crash',
    summary:
      'Gresini Racing confirmed Marquez will sit out Mugello and Balaton Park to recover from injuries sustained at the Catalan Grand Prix.',
    url: 'https://www.motorsport.com/motogp/news/alex-marquez-miss-next-two-motogp-races-barcelona-crash/10822549/',
    source: 'Motorsport.com',
    publishedAt: '2026-05-21T12:32:00Z',
    series: ['motogp'],
  },
  {
    id: 'n-010',
    title: 'Monster to become Aprilia title sponsor from Italian GP',
    summary:
      'Monster Energy will serve as Aprilia\'s primary sponsor starting at Mugello, as the team dominates the 2026 MotoGP season.',
    url: 'https://www.motorsport.com/motogp/news/aprilia-title-sponsor-monster-energy-2026/10822460/',
    source: 'Motorsport.com',
    publishedAt: '2026-05-21T07:34:00Z',
    series: ['motogp'],
  },

  // ─── DTM ─────────────────────────────────────────────────
  {
    id: 'n-021',
    title: 'DTM Zandvoort Qualifying: Pepper takes maiden pole in the rain',
    summary:
      'Jordan Pepper secured his first DTM pole with a 1:42.194 in wet conditions at Zandvoort, beating championship leader Maro Engel by just 0.008s.',
    url: 'https://de.motorsport.com/dtm/news/dtm-qualifying-zandvoort-1-grasser-lamborghini-pole-bei-regen-25060701/3428418/',
    source: 'Motorsport.com',
    publishedAt: '2026-05-23T10:00:00Z',
    series: ['dtm'],
  },
  {
    id: 'n-014',
    title: 'DTM Zandvoort Practice: Ferrari dominance, timing chaos, Lamborghini upturn',
    summary:
      'Matteo Cairoli posted the fastest time in disjointed Friday practice at Zandvoort, with Ferrari showing strong performance across the field.',
    url: 'https://www.motorsport.com/dtm/news/dtm-practice-at-zandvoort-ferrari-dominance-timing-chaos-a-lambo-upturn/10823015/',
    source: 'Motorsport.com',
    publishedAt: '2026-05-22T18:13:00Z',
    series: ['dtm'],
  },

  // ─── WEC ─────────────────────────────────────────────────
  {
    id: 'n-012',
    title: 'The 2026 Le Mans 24 Hours entry list in full',
    summary:
      'Complete roster of competitors for the 2026 Le Mans 24 Hours, featuring 18 Hypercar entries including Aston Martin, Toyota, and other manufacturers.',
    url: 'https://www.motorsport.com/wec/news/the-2026-le-mans-24-hours-entry-list-in-full/10798927/',
    source: 'Motorsport.com',
    publishedAt: '2026-05-14T12:00:00Z',
    series: ['wec'],
  },
  {
    id: 'n-013',
    title: "Frijns relieved after BMW's maiden WEC Hypercar win at Spa",
    summary:
      "BMW secured its first WEC Hypercar victory at Spa using an unconventional short-fuel strategy that proved decisive.",
    url: 'https://www.motorsport.com/wec/news/robin-frijns-relieved-after-bmws-hypercar-win-in-wec-this-was-a-race-we-had-to-win/10819618/',
    source: 'Motorsport.com',
    publishedAt: '2026-05-10T16:00:00Z',
    series: ['wec'],
  },
];

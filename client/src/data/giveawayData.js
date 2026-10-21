/**
 * VELOOP Giveaway System - Mock API Data Contract
 * Mirrors the exact JSON schemas returned by the authoritative backend API.
 * Uses high-resolution copyright-free online photography from Unsplash.
 */

// Generate dynamic relative dates based on runtime execution
const now = new Date();
const addDays = (d, days) => new Date(d.getTime() + days * 86400000).toISOString();
const subDays = (d, days) => new Date(d.getTime() - days * 86400000).toISOString();

export const MOCK_SERVER_TIME = now.toISOString();

export const MOCK_USER = {
  userId: 'VE10025',
  email: 'jivan@veloop.io',
  role: 'USER',
  status: 'ACTIVE',
  wallet: {
    ves: 1250,
    sves: 800,
    tokens: 5000
  }
};

export const MOCK_STATS = {
  isDemo: true,
  totalPrizesAwarded: 12480,
  totalParticipants: 48920,
  activeCampaigns: 4,
  happyWinnersCount: 3850
};

export const MOCK_GIVEAWAYS = [
  {
    giveawayId: 'gw-iphone-15-pro',
    campaign: 'Summer Rewards 2026',
    slug: 'iphone-15-pro',
    title: 'Apple iPhone 15 Pro (128GB)',
    description: 'Experience titanium craftsmanship, the A17 Pro chip, and pro-grade photography in natural titanium.',
    prize: {
      id: 'prize-iphone-15',
      name: 'iPhone 15 Pro (128GB)',
      type: 'PHYSICAL',
      claimType: 'PHYSICAL',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      localImage: '/assets/prizes/iphone-15-pro.jpg',
      accentColor: '#E2E8F0', // Natural Titanium
      badge: 'Grand Reward',
      retailValue: '₹1,34,900'
    },
    status: 'ACTIVE',
    winnersStatus: 'PENDING',
    startAt: subDays(now, 5),
    endAt: addDays(now, 5),
    entry: {
      currency: 'VE',
      amount: 250
    },
    winnerCount: 1,
    participantsCount: 1420,
    claimWindowDays: 7,
    rules: [
      'Only 1 entry per account permitted.',
      'Winner is selected via cryptographically secure random distribution.',
      'Claim details must be submitted within 7 calendar days of winner announcement.',
      'Requires full Indian postal address and active phone verification.'
    ],
    terms: [
      'Eligibility: Registered VELOOP users in good standing.',
      'Taxes & Duties: Compliant with Indian applicable reward tax policies.',
      'Refund Policy: [PLACEHOLDER — pending VELOOP reward policy].',
      'Non-transferable: Prize cannot be exchanged for cash or credit.'
    ]
  },
  {
    giveawayId: 'gw-apple-watch-s9',
    campaign: 'Summer Rewards 2026',
    slug: 'apple-watch-series-9',
    title: 'Apple Watch Series 9 GPS',
    description: 'Advanced health sensors, brighter Always-On display, and magical Double Tap gesture interaction.',
    prize: {
      id: 'prize-apple-watch-9',
      name: 'Apple Watch Series 9 GPS 45mm',
      type: 'PHYSICAL',
      claimType: 'PHYSICAL',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
      localImage: '/assets/prizes/apple-watch.jpg',
      accentColor: '#10B981', // Racing Emerald
      badge: 'Popular Choice',
      retailValue: '₹44,900'
    },
    status: 'ACTIVE',
    winnersStatus: 'PENDING',
    startAt: subDays(now, 3),
    endAt: addDays(now, 7),
    entry: {
      currency: 'VE',
      amount: 200
    },
    winnerCount: 3,
    participantsCount: 980,
    claimWindowDays: 7,
    rules: [
      '1 entry per account allowed.',
      'Selection executed atomically upon giveaway conclusion.',
      'Courier delivery to all serviceable Indian PIN codes.'
    ],
    terms: [
      'Standard Apple India manufacturer warranty included.',
      'Claim window: 7 days from winner announcement.'
    ]
  },
  {
    giveawayId: 'gw-airpods-pro-2',
    campaign: 'Summer Rewards 2026',
    slug: 'airpods-pro',
    title: 'Apple AirPods Pro (2nd Generation)',
    description: 'Up to 2x more Active Noise Cancellation, Adaptive Audio, and USB-C MagSafe charging case.',
    prize: {
      id: 'prize-airpods-pro',
      name: 'AirPods Pro (2nd Gen, USB-C)',
      type: 'PHYSICAL',
      claimType: 'PHYSICAL',
      image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
      localImage: '/assets/prizes/airpods-pro.jpg',
      accentColor: '#84CC16', // Sage/Lime
      badge: 'Super Tier',
      retailValue: '₹24,900'
    },
    status: 'ACTIVE',
    winnersStatus: 'PENDING',
    startAt: subDays(now, 2),
    endAt: addDays(now, 9),
    entry: {
      currency: 'SVE',
      amount: 500
    },
    winnerCount: 5,
    participantsCount: 650,
    claimWindowDays: 7,
    rules: [
      'Requires Super Veloop Entries (SVE) to enter.',
      '5 distinct verified winners chosen at random.'
    ],
    terms: [
      'Physical item dispatched after claim verification.'
    ]
  },
  {
    giveawayId: 'gw-amazon-2000',
    campaign: 'Summer Rewards 2026',
    slug: 'amazon-2000',
    title: 'Amazon ₹2,000 Gift Voucher',
    description: 'Instant shopping credit for millions of products on Amazon India with 1-year validity.',
    prize: {
      id: 'prize-amazon-2000',
      name: 'Amazon India ₹2,000 Gift Card',
      type: 'GIFT_CARD',
      claimType: 'GIFT_CARD',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      localImage: '/assets/prizes/amazon-2000.jpg',
      accentColor: '#F97316', // Amazon Warm Amber
      badge: 'Top Voucher',
      retailValue: '₹2,000'
    },
    status: 'ACTIVE',
    winnersStatus: 'PENDING',
    startAt: subDays(now, 1),
    endAt: addDays(now, 12),
    entry: {
      currency: 'VE',
      amount: 500
    },
    winnerCount: 10,
    participantsCount: 2310,
    claimWindowDays: 7,
    rules: [
      'Delivered straight to winner email address.',
      '10 winners awarded ₹2,000 each.'
    ],
    terms: [
      'Subject to Amazon Gift Card terms and conditions.'
    ]
  },
  {
    giveawayId: 'gw-amazon-500',
    campaign: 'Summer Rewards 2026',
    slug: 'amazon-500',
    title: 'Amazon ₹500 Shopping Voucher',
    description: 'Quick digital shopping credit for daily essentials, electronics, or books.',
    prize: {
      id: 'prize-amazon-500',
      name: 'Amazon India ₹500 Gift Card',
      type: 'GIFT_CARD',
      claimType: 'GIFT_CARD',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80',
      localImage: '/assets/prizes/amazon-500.jpg',
      accentColor: '#F59E0B', // Champagne Gold
      badge: 'Upcoming Drop',
      retailValue: '₹500'
    },
    status: 'UPCOMING',
    winnersStatus: 'PENDING',
    startAt: addDays(now, 2),
    endAt: addDays(now, 14),
    entry: {
      currency: 'VE',
      amount: 300
    },
    winnerCount: 15,
    participantsCount: 0,
    claimWindowDays: 7,
    rules: [
      'Opens for participation soon. Set a reminder!'
    ],
    terms: [
      'Delivered digitally to verified email.'
    ]
  },
  {
    giveawayId: 'gw-amazon-20',
    campaign: 'Mini Reward Drops',
    slug: 'amazon-20',
    title: 'Amazon ₹20 Instant Token Drop',
    description: 'Low-threshold token giveaway for instant vouchers with 50 lucky winners.',
    prize: {
      id: 'prize-amazon-20',
      name: 'Amazon India ₹20 Code',
      type: 'DIGITAL',
      claimType: 'GIFT_CARD',
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
      localImage: '/assets/prizes/amazon-20.jpg',
      accentColor: '#D97706', // Warm Bronze
      badge: 'Finished Event',
      retailValue: '₹20'
    },
    status: 'ENDED',
    winnersStatus: 'FINALIZED',
    startAt: subDays(now, 10),
    endAt: subDays(now, 1),
    entry: {
      currency: 'TOKEN',
      amount: 2000
    },
    winnerCount: 50,
    participantsCount: 3120,
    claimWindowDays: 7,
    rules: [
      'Draw completed and verified on-chain.'
    ],
    terms: [
      'All prizes finalized and distributed.'
    ]
  }
];

export const MOCK_PAST_WINNERS = [
  {
    id: 'win-01',
    maskedUserId: 'VE****82',
    prizeName: 'iPhone 15 Pro (128GB)',
    campaign: 'August Reward Rush',
    wonAt: subDays(now, 14),
    avatarColor: '#10B981'
  },
  {
    id: 'win-02',
    maskedUserId: 'VE****19',
    prizeName: 'Apple Watch Series 9',
    campaign: 'August Reward Rush',
    wonAt: subDays(now, 15),
    avatarColor: '#F59E0B'
  },
  {
    id: 'win-03',
    maskedUserId: 'VE****44',
    prizeName: 'AirPods Pro (2nd Gen)',
    campaign: 'Monsoon Bonanza',
    wonAt: subDays(now, 18),
    avatarColor: '#84CC16'
  },
  {
    id: 'win-04',
    maskedUserId: 'VE****91',
    prizeName: 'Amazon ₹2,000 Gift Voucher',
    campaign: 'Monsoon Bonanza',
    wonAt: subDays(now, 21),
    avatarColor: '#F97316'
  },
  {
    id: 'win-05',
    maskedUserId: 'VE****33',
    prizeName: 'Amazon ₹500 Shopping Voucher',
    campaign: 'Weekly Flash Drop',
    wonAt: subDays(now, 25),
    avatarColor: '#E2E8F0'
  }
];

export const MOCK_FAQS = [
  {
    id: 'faq-1',
    question: 'How do I earn entries to join giveaways?',
    answer: 'Entries (VE, SVE, or Tokens) are rewarded through active participation in VELOOP programs, completing missions, and engaging on the platform.'
  },
  {
    id: 'faq-2',
    question: 'Are winners chosen fairly?',
    answer: 'Yes. Winners are selected automatically using cryptographically secure random number generators (crypto.randomInt) over active entries on our authoritative backend.'
  },
  {
    id: 'faq-3',
    question: 'Can I enter a giveaway more than once?',
    answer: 'To ensure a balanced and fair opportunity for all participants, each user is strictly limited to 1 verified entry per giveaway event.'
  },
  {
    id: 'faq-4',
    question: 'What happens if I win a physical item?',
    answer: 'You will receive a notification and prompt on the giveaway page. You will have 7 days to submit your Indian postal delivery address and phone number for verified courier shipping.'
  },
  {
    id: 'faq-5',
    question: 'How are gift vouchers delivered?',
    answer: 'Digital vouchers (such as Amazon Gift Cards) are delivered directly to your verified account email address within 24 hours of claim submission.'
  },
  {
    id: 'faq-6',
    question: 'What happens if a giveaway ends with fewer participants than prizes?',
    answer: 'All valid participants are awarded prizes, and remaining unallocated prize pools are archived or rolled forward into subsequent reward campaigns.'
  },
  {
    id: 'faq-7',
    question: 'Are there any fees or delivery charges for winners?',
    answer: 'Zero delivery charges. VELOOP covers standard shipping and handling for all physical merchandise distributed across India.'
  }
];

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User, Wallet, Prize, Giveaway, GiveawayWinner } from '../models/index.js';

dotenv.config();

const PRIZES = [
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max 256GB Natural Titanium',
    type: 'PHYSICAL',
    claimType: 'PHYSICAL_SHIPPING',
    image: '/assets/prizes/iphone-15-pro.webp',
    description: 'Apple A17 Pro chip, Grade 5 aerospace titanium, 48MP Pro camera system with 5x optical telephoto.',
    retailPrice: 134900
  },
  {
    id: 'apple-watch-ultra-2',
    name: 'Apple Watch Ultra 2 Titanium GPS + Cellular',
    type: 'PHYSICAL',
    claimType: 'PHYSICAL_SHIPPING',
    image: '/assets/prizes/apple-watch.webp',
    description: 'Rugged 49mm titanium case, 3000-nit Always-On display, precision dual-frequency GPS, 36-hour battery life.',
    retailPrice: 89900
  },
  {
    id: 'airpods-max-silver',
    name: 'AirPods Max Wireless Headphones Silver',
    type: 'PHYSICAL',
    claimType: 'PHYSICAL_SHIPPING',
    image: '/assets/prizes/airpods-pro.webp',
    description: 'Apple-designed dynamic driver, Pro-level Active Noise Cancellation, Transparency mode, Spatial Audio.',
    retailPrice: 59900
  },
  {
    id: 'amazon-in-gift-card-5000',
    name: 'Amazon.in Gift Voucher ₹5,000',
    type: 'GIFT_CARD',
    claimType: 'DIGITAL_CODE',
    image: '/assets/prizes/amazon-2000.webp',
    description: 'Instant redeemable Amazon Pay code valid for 12 months across all categories with zero fees.',
    retailPrice: 5000
  },
  {
    id: 'flipkart-gift-voucher-2500',
    name: 'Flipkart Shopping Voucher ₹2,500',
    type: 'GIFT_CARD',
    claimType: 'DIGITAL_CODE',
    image: '/assets/prizes/amazon-500.webp',
    description: 'Direct digital voucher code redeemable instantly on Flipkart for electronics, apparel, and home essentials.',
    retailPrice: 2500
  },
  {
    id: 'usdt-token-pool-500',
    name: '500 USDT Token Pool (Split Draw)',
    type: 'DIGITAL',
    claimType: 'WALLET_AIRDROP',
    image: '/assets/prizes/amazon-20.webp',
    description: 'Guaranteed 500 USDT multi-winner token distribution credited directly to connected web3 or in-app wallets.',
    retailPrice: 42500
  }
];

export async function seedDatabase(scenario = 'active') {
  console.log(`[Seed] Running seed for scenario: ${scenario}`);

  // Clear existing collections
  await Promise.all([
    User.deleteMany({}),
    Wallet.deleteMany({}),
    Prize.deleteMany({}),
    Giveaway.deleteMany({}),
    GiveawayWinner.deleteMany({})
  ]);

  // Seed Prizes
  await Prize.insertMany(PRIZES);
  console.log(`[Seed] Inserted ${PRIZES.length} prizes.`);

  // Seed Demo Users & Wallets
  const defaultPasswordHash = await bcrypt.hash('Password123!', 10);

  const demoUsers = [
    { userId: 'VE10025', email: 'jivan@veloop.io', role: 'USER' },
    { userId: 'VE10082', email: 'aarav.m@gmail.com', role: 'USER' },
    { userId: 'VE10041', email: 'priya.s@yahoo.co.in', role: 'USER' },
    { userId: 'VE10099', email: 'admin@veloop.io', role: 'ADMIN' }
  ];

  for (const u of demoUsers) {
    await User.create({
      userId: u.userId,
      email: u.email,
      passwordHash: defaultPasswordHash,
      role: u.role,
      status: 'ACTIVE'
    });

    await Wallet.create({
      userId: u.userId,
      ves: u.userId === 'VE10025' ? 2500 : 1500,
      sves: u.userId === 'VE10025' ? 1000 : 750,
      tokens: u.userId === 'VE10025' ? 5000 : 2500
    });
  }
  console.log(`[Seed] Inserted ${demoUsers.length} users and wallets.`);

  const now = new Date();

  let status = 'ACTIVE';
  let winnersStatus = 'PENDING';
  let startAt = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  let endAtOffsetDays = 7;

  if (scenario === 'upcoming') {
    status = 'UPCOMING';
    startAt = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    endAtOffsetDays = 14;
  } else if (scenario === 'ended-pending') {
    status = 'ENDED';
    winnersStatus = 'PENDING';
    startAt = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    endAtOffsetDays = -2;
  } else if (scenario === 'ended-finalized') {
    status = 'ENDED';
    winnersStatus = 'FINALIZED';
    startAt = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
    endAtOffsetDays = -5;
  }

  const giveawayConfigs = [
    {
      giveawayId: 'gw-iphone-15-pro',
      slug: 'iphone-15-pro-max',
      title: 'Apple iPhone 15 Pro Max (256GB)',
      prizeId: 'iphone-15-pro-max',
      currency: 'VE',
      amount: 250,
      winnerCount: 1,
      endDays: endAtOffsetDays + 5,
      participantsCount: 428
    },
    {
      giveawayId: 'gw-apple-watch-ultra-2',
      slug: 'apple-watch-ultra-2',
      title: 'Apple Watch Ultra 2 Titanium',
      prizeId: 'apple-watch-ultra-2',
      currency: 'VE',
      amount: 200,
      winnerCount: 3,
      endDays: endAtOffsetDays + 2,
      participantsCount: 312
    },
    {
      giveawayId: 'gw-airpods-max-silver',
      slug: 'airpods-max-silver',
      title: 'AirPods Max Wireless Headphones',
      prizeId: 'airpods-max-silver',
      currency: 'SVE',
      amount: 500,
      winnerCount: 5,
      endDays: endAtOffsetDays,
      participantsCount: 194
    },
    {
      giveawayId: 'gw-amazon-voucher-5000',
      slug: 'amazon-in-gift-card-5000',
      title: 'Amazon.in ₹5,000 Instant Voucher',
      prizeId: 'amazon-in-gift-card-5000',
      currency: 'VE',
      amount: 500,
      winnerCount: 10,
      endDays: endAtOffsetDays - 1,
      participantsCount: 512
    },
    {
      giveawayId: 'gw-flipkart-voucher-2500',
      slug: 'flipkart-gift-voucher-2500',
      title: 'Flipkart ₹2,500 Gift Voucher',
      prizeId: 'flipkart-gift-voucher-2500',
      currency: 'VE',
      amount: 300,
      winnerCount: 15,
      endDays: endAtOffsetDays - 2,
      participantsCount: 380
    },
    {
      giveawayId: 'gw-usdt-token-pool-500',
      slug: 'usdt-token-pool-500',
      title: '500 USDT Token Liquidity Drop',
      prizeId: 'usdt-token-pool-500',
      currency: 'TOKEN',
      amount: 2000,
      winnerCount: 25,
      endDays: endAtOffsetDays + 1,
      participantsCount: 840
    }
  ];

  for (const cfg of giveawayConfigs) {
    const endAt = new Date(now.getTime() + cfg.endDays * 24 * 60 * 60 * 1000);
    const poolStatus = endAt < now ? 'ENDED' : status;

    const gw = await Giveaway.create({
      giveawayId: cfg.giveawayId,
      campaign: 'Exclusive Rewards Pool',
      slug: cfg.slug,
      title: cfg.title,
      description: `Participate in the official VELOOP draw for ${cfg.title}. Verified blockchain-anchored fairness.`,
      prizeId: cfg.prizeId,
      status: poolStatus,
      winnersStatus: poolStatus === 'ENDED' ? winnersStatus : 'PENDING',
      startAt,
      endAt,
      entry: {
        currency: cfg.currency,
        amount: cfg.amount
      },
      winnerCount: cfg.winnerCount,
      rules: [
        'Single entry per verified VELOOP user account.',
        'Entry fee is conditionally deducted upon cryptographic ticket generation.',
        'Winners are selected via provably fair crypto-random draw at zero countdown.',
        'Physical prizes ship pan-India with valid tracking; digital codes delivered instantly.'
      ],
      eligibility: ['Active account in good standing', 'Minimum wallet balance', 'Pan-India shipping eligibility'],
      terms: ['VELOOP standard reward guidelines apply', 'No cash conversion for voucher prizes'],
      claimWindowDays: 7,
      participantsCount: cfg.participantsCount,
      finalizedAt: poolStatus === 'ENDED' && winnersStatus === 'FINALIZED' ? endAt : null
    });

    if (poolStatus === 'ENDED' && winnersStatus === 'FINALIZED') {
      await GiveawayWinner.create({
        giveawayId: gw.giveawayId,
        prizeId: gw.prizeId,
        userId: 'VE10082',
        selectionMethod: 'CRYPTO_RANDOM',
        selectedAt: endAt,
        status: 'CONFIRMED'
      });
    }
  }

  console.log(`[Seed] Seeded 6 giveaways for scenario '${scenario}'.`);
}

// Direct CLI execution
if (process.argv[1]?.endsWith('seed.js')) {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/veloop_giveaway';
  const scenarioArg = process.argv.find((a) => a.startsWith('--scenario='));
  const scenarioIndex = process.argv.indexOf('--scenario');
  const scenario = scenarioArg
    ? scenarioArg.split('=')[1]
    : scenarioIndex !== -1 && process.argv[scenarioIndex + 1]
    ? process.argv[scenarioIndex + 1]
    : 'active';

  mongoose
    .connect(uri)
    .then(async () => {
      await seedDatabase(scenario);
      await mongoose.disconnect();
      console.log('[Seed] Database seed completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed] Database seed failed:', err.message);
      process.exit(1);
    });
}

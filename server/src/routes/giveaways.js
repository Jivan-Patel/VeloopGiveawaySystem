import { Router } from 'express';
import { Giveaway } from '../models/Giveaway.js';
import { Prize } from '../models/Prize.js';
import { GiveawayWinner } from '../models/GiveawayWinner.js';
import { GiveawayParticipation } from '../models/GiveawayParticipation.js';
import { Wallet } from '../models/Wallet.js';
import { PrizeClaim } from '../models/PrizeClaim.js';
import { maskUserId, getEffectiveStatus } from '../utils/statusHelper.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/authMiddleware.js';
import { joinGiveaway } from '../services/participationService.js';

const router = Router();

/**
 * GET /api/giveaways/current
 * Returns active and upcoming giveaways, platform stats, and authoritative serverTime.
 */
router.get('/current', optionalAuthMiddleware, async (req, res, next) => {
  try {
    const serverTime = new Date().toISOString();
    const giveaways = await Giveaway.find({ status: { $ne: 'ARCHIVED' } }).lean();
    const prizes = await Prize.find().lean();
    const prizeMap = new Map(prizes.map((p) => [p.id, p]));

    const processed = giveaways.map((gw) => {
      const effStatus = getEffectiveStatus(gw, serverTime);
      return {
        ...gw,
        status: effStatus,
        prize: prizeMap.get(gw.prizeId) || null
      };
    });

    const activeCount = processed.filter((g) => g.status === 'ACTIVE').length;
    const totalParticipants = processed.reduce((sum, g) => sum + (g.participantsCount || 0), 0);

    res.status(200).json({
      status: 'success',
      serverTime,
      data: {
        giveaways: processed,
        stats: {
          totalDistributed: '₹4,85,000+',
          totalWinners: 85,
          activePools: activeCount,
          verifiedRate: '100%'
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/giveaways/previous
 * Returns paginated completed giveaways.
 */
router.get('/previous', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { status: 'ENDED' };
    const [giveaways, total] = await Promise.all([
      Giveaway.find(query).sort({ endAt: -1 }).skip(skip).limit(limit).lean(),
      Giveaway.countDocuments(query)
    ]);

    const prizes = await Prize.find().lean();
    const prizeMap = new Map(prizes.map((p) => [p.id, p]));

    const processed = giveaways.map((gw) => ({
      ...gw,
      prize: prizeMap.get(gw.prizeId) || null
    }));

    res.status(200).json({
      status: 'success',
      data: {
        giveaways: processed,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/giveaways/previous/winners
 * Returns masked past winners for slider and tabs.
 */
router.get('/previous/winners', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const winners = await GiveawayWinner.find({ status: 'CONFIRMED' })
      .sort({ selectedAt: -1 })
      .limit(limit)
      .lean();

    const [giveaways, prizes] = await Promise.all([
      Giveaway.find().lean(),
      Prize.find().lean()
    ]);
    const gwMap = new Map(giveaways.map((g) => [g.giveawayId, g]));
    const prizeMap = new Map(prizes.map((p) => [p.id, p]));

    const processed = winners.map((w) => {
      const gw = gwMap.get(w.giveawayId);
      const prize = prizeMap.get(w.prizeId);
      return {
        id: w._id,
        maskedUserId: maskUserId(w.userId),
        prizeName: prize ? prize.name : 'Exclusive Reward',
        prizeImage: prize ? prize.image : '/assets/prizes/gift-box-gold.svg',
        campaign: gw ? gw.campaign : 'Exclusive Rewards Pool',
        wonAt: w.selectedAt
      };
    });

    res.status(200).json({
      status: 'success',
      data: processed
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/giveaways/my-wins
 * Authenticated user's won giveaways and claim states.
 */
router.get('/my-wins', authMiddleware, async (req, res, next) => {
  try {
    const wins = await GiveawayWinner.find({ userId: req.user.userId }).lean();
    const claims = await PrizeClaim.find({ userId: req.user.userId }).lean();
    const claimMap = new Map(claims.map((c) => [c.giveawayId, c]));

    const giveawayIds = wins.map((w) => w.giveawayId);
    const giveaways = await Giveaway.find({ giveawayId: { $in: giveawayIds } }).lean();
    const prizes = await Prize.find().lean();
    const prizeMap = new Map(prizes.map((p) => [p.id, p]));

    const data = wins.map((w) => {
      const gw = giveaways.find((g) => g.giveawayId === w.giveawayId);
      const prize = prizeMap.get(w.prizeId);
      const claim = claimMap.get(w.giveawayId);

      return {
        winnerId: w._id,
        giveawayId: w.giveawayId,
        prize: prize || null,
        campaign: gw ? gw.campaign : 'Exclusive Rewards Pool',
        wonAt: w.selectedAt,
        claimState: claim ? claim.status : 'NOT_SUBMITTED'
      };
    });

    res.status(200).json({
      status: 'success',
      data
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/giveaways/:id/my-status
 * Derives user status, wallet balance, join eligibility, and claim state.
 */
router.get('/:id/my-status', authMiddleware, async (req, res, next) => {
  try {
    const identifier = req.params.id;
    const giveaway = await Giveaway.findOne({
      $or: [{ giveawayId: identifier }, { slug: identifier }]
    }).lean();

    if (!giveaway) {
      return res.status(404).json({
        code: 'GIVEAWAY_NOT_FOUND',
        message: "We couldn't find this giveaway."
      });
    }

    const userId = req.user.userId;
    const [participation, wallet, winner, claim] = await Promise.all([
      GiveawayParticipation.findOne({ userId, giveawayId: giveaway.giveawayId }).lean(),
      Wallet.findOne({ userId }).lean(),
      GiveawayWinner.findOne({ userId, giveawayId: giveaway.giveawayId }).lean(),
      PrizeClaim.findOne({ userId, giveawayId: giveaway.giveawayId }).lean()
    ]);

    const currencyKey = giveaway.entry.currency === 'VE' ? 'ves' : giveaway.entry.currency === 'SVE' ? 'sves' : 'tokens';
    const balance = wallet ? wallet[currencyKey] || 0 : 0;
    const hasEnoughBalance = balance >= giveaway.entry.amount;
    const hasJoined = !!participation;
    const isWinner = !!winner;

    let claimState = 'NOT_SUBMITTED';
    if (claim) claimState = claim.status;

    let canJoin = false;
    let reason = null;

    if (hasJoined) {
      reason = 'ALREADY_PARTICIPATING';
    } else if (!hasEnoughBalance) {
      reason = `INSUFFICIENT_${giveaway.entry.currency}_BALANCE`;
    } else if (giveaway.status !== 'ACTIVE') {
      reason = giveaway.status === 'ENDED' ? 'GIVEAWAY_ENDED' : 'GIVEAWAY_NOT_ACTIVE';
    } else {
      canJoin = true;
    }

    res.status(200).json({
      status: 'success',
      data: {
        giveawayId: giveaway.giveawayId,
        currency: giveaway.entry.currency,
        requiredFee: giveaway.entry.amount,
        userBalance: balance,
        hasEnoughBalance,
        hasJoined,
        canJoin,
        reason,
        isWinner,
        claimState,
        participation: participation || null
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/giveaways/:id/winners
 * Masked winners for this giveaway. Empty if winnersStatus is PENDING.
 */
router.get('/:id/winners', async (req, res, next) => {
  try {
    const identifier = req.params.id;
    const giveaway = await Giveaway.findOne({
      $or: [{ giveawayId: identifier }, { slug: identifier }]
    }).lean();

    if (!giveaway) {
      return res.status(404).json({
        code: 'GIVEAWAY_NOT_FOUND',
        message: "We couldn't find this giveaway."
      });
    }

    if (giveaway.winnersStatus !== 'FINALIZED') {
      return res.status(200).json({
        status: 'success',
        winnersStatus: 'PENDING',
        data: []
      });
    }

    const winners = await GiveawayWinner.find({
      giveawayId: giveaway.giveawayId,
      status: 'CONFIRMED'
    }).lean();

    const masked = winners.map((w) => ({
      winnerId: w._id,
      maskedUserId: maskUserId(w.userId),
      selectedAt: w.selectedAt
    }));

    res.status(200).json({
      status: 'success',
      winnersStatus: 'FINALIZED',
      data: masked
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/giveaways/:idOrSlug
 * Full details for a single giveaway.
 */
router.get('/:idOrSlug', optionalAuthMiddleware, async (req, res, next) => {
  try {
    const identifier = req.params.idOrSlug;
    const giveaway = await Giveaway.findOne({
      $or: [{ giveawayId: identifier }, { slug: identifier }]
    }).lean();

    if (!giveaway) {
      return res.status(404).json({
        code: 'GIVEAWAY_NOT_FOUND',
        message: "We couldn't find this giveaway."
      });
    }

    const prize = await Prize.findOne({ id: giveaway.prizeId }).lean();
    const serverTime = new Date().toISOString();
    const effStatus = getEffectiveStatus(giveaway, serverTime);

    res.status(200).json({
      status: 'success',
      serverTime,
      data: {
        ...giveaway,
        status: effStatus,
        prize: prize || null
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/giveaways/:id/join
 * Authenticated join with ACID transactions and idempotency deduplication.
 */
router.post('/:id/join', authMiddleware, async (req, res, next) => {
  try {
    const idempotencyKey = req.headers['idempotency-key'];
    const deviceId = req.headers['x-device-id'] || req.ip;
    const userAgent = req.headers['user-agent'] || '';
    const hasTamperedFields = Boolean(
      req.body && (req.body.amount || req.body.currency || req.body.userId || req.body.prizeId)
    );

    const result = await joinGiveaway({
      userId: req.user.userId,
      giveawayIdentifier: req.params.id,
      idempotencyKey,
      deviceId,
      userAgent,
      hasTamperedFields,
      ip: req.ip
    });

    res.status(result.statusCode).json({
      status: 'success',
      data: result.data
    });
  } catch (err) {
    next(err);
  }
});

export default router;

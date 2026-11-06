import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { finalizeGiveaway, redrawWinner } from '../services/winnerService.js';
import { getAdminClaims, updateClaimStatus } from '../services/claimService.js';
import { Giveaway } from '../models/Giveaway.js';
import { GiveawayParticipation } from '../models/GiveawayParticipation.js';
import { FraudEvent } from '../models/FraudEvent.js';
import { AuditLog } from '../models/AuditLog.js';

export const adminRouter = express.Router();

// Enforce authentication and admin privileges on all admin routes
adminRouter.use(authMiddleware, requireAdmin);

/**
 * POST /api/admin/giveaways/:id/finalize
 * Atomically triggers cryptographically secure winner selection and finalizes giveaway.
 */
adminRouter.post('/giveaways/:id/finalize', async (req, res, next) => {
  try {
    const result = await finalizeGiveaway(req.params.id, req.user.userId);
    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/giveaways/:id/redraw
 * Disqualifies a winner and redraws a replacement.
 */
adminRouter.post('/giveaways/:id/redraw', async (req, res, next) => {
  try {
    const { disqualifiedUserId, reason } = req.body;
    if (!disqualifiedUserId) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'disqualifiedUserId is required' }
      });
    }

    const result = await redrawWinner(
      req.params.id,
      disqualifiedUserId,
      reason,
      req.user.userId
    );

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/claims
 * Returns paginated claims for administrative processing and tracking.
 */
adminRouter.get('/claims', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.giveawayId) filter.giveawayId = req.query.giveawayId;

    const result = await getAdminClaims(filter, page, limit);
    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/admin/claims/:id
 * Updates claim status, courier partner, tracking number, and administrative notes.
 */
adminRouter.patch('/claims/:id', async (req, res, next) => {
  try {
    const result = await updateClaimStatus(req.params.id, req.body, req.user.userId);
    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/dashboard
 * Aggregates high-level metrics for admin console.
 */
adminRouter.get('/dashboard', async (req, res, next) => {
  try {
    const [giveawaysCount, activeParticipants, pendingClaims, fraudEvents, recentAudit] =
      await Promise.all([
        Giveaway.countDocuments(),
        GiveawayParticipation.countDocuments({ status: 'ACTIVE' }),
        getAdminClaims({ status: 'SUBMITTED' }, 1, 5),
        FraudEvent.countDocuments(),
        AuditLog.find().sort({ createdAt: -1 }).limit(10).lean()
      ]);

    res.json({
      success: true,
      data: {
        giveawaysCount,
        activeParticipants,
        pendingClaimsCount: pendingClaims.total,
        fraudEventsCount: fraudEvents,
        recentAudit
      }
    });
  } catch (err) {
    next(err);
  }
});

export default adminRouter;

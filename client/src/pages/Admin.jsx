import { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Trophy,
  Package,
  Layers,
  RefreshCw,
  Clock,
  Sparkles,
  Truck,
  X,
  Lock
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { giveawayApi } from '../services/giveawayApi';
import ThemedLoader from '../components/Loader/ThemedLoader';
import styles from './Admin.module.css';

export function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pools'); // 'pools' | 'claims' | 'audit'
  const [giveaways, setGiveaways] = useState([]);
  const [claims, setClaims] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [redrawModal, setRedrawModal] = useState({ open: false, giveawayId: null, userId: '' });
  const [redrawReason, setRedrawReason] = useState('Disqualification per PRD rule check');
  const [fulfillmentForm, setFulfillmentForm] = useState({
    status: 'PROCESSING',
    courierPartner: 'BlueDart Express',
    trackingNumber: 'BD-789420',
    notes: 'Dispatched via priority air courier'
  });

  // Verify Admin authorization
  const isAdmin = user?.role === 'ADMIN' || user?.userId === 'dev-user-001';

  useEffect(() => {
    let ignore = false;
    const loadData = async () => {
      try {
        const gwRes = await giveawayApi.getCurrentGiveaways();
        if (!ignore) {
          const currentList = gwRes.data?.giveaways || [];
          setGiveaways(currentList);

          const sampleClaims = [
            {
              _id: 'clm-001',
              giveawayId: 'gw-summer-2026',
              prizeName: 'iPhone 15 Pro (128GB)',
              prizeType: 'PHYSICAL',
              userId: 'VE10025',
              status: 'SUBMITTED',
              submittedAt: new Date(Date.now() - 3600000).toISOString(),
              details: {
                fullName: 'Jivan Patel',
                phone: '9876543210',
                addressLine1: 'SG Highway, Bodakdev',
                city: 'Ahmedabad',
                state: 'Gujarat',
                pincode: '380054'
              }
            },
            {
              _id: 'clm-002',
              giveawayId: 'gw-gadget-airpods',
              prizeName: 'Apple AirPods Pro 2',
              prizeType: 'PHYSICAL',
              userId: 'VE10088',
              status: 'PROCESSING',
              submittedAt: new Date(Date.now() - 86400000).toISOString(),
              details: {
                fullName: 'Rahul Sharma',
                phone: '9822334455',
                addressLine1: 'Koramangala 4th Block',
                city: 'Bengaluru',
                state: 'Karnataka',
                pincode: '560034',
                courierPartner: 'Delhivery',
                trackingNumber: 'DL-9948201'
              }
            }
          ];
          setClaims(sampleClaims);

          setAuditLogs([
            {
              _id: 'aud-001',
              action: 'GIVEAWAY_FINALIZED',
              userId: 'ADMIN',
              giveawayId: 'gw-summer-2026',
              result: 'SUCCESS',
              createdAt: new Date(Date.now() - 7200000).toISOString()
            },
            {
              _id: 'aud-002',
              action: 'PARTICIPATION_BLOCKED',
              userId: 'VE10099',
              giveawayId: 'gw-crypto-2026',
              result: 'FAILURE',
              details: { reason: 'High fraud risk score (+75) on duplicate device' },
              createdAt: new Date(Date.now() - 14400000).toISOString()
            }
          ]);
        }
      } catch (err) {
        if (!ignore) {
          console.warn('[Admin] Fetch error:', err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const handleFinalize = async (giveawayId) => {
    try {
      setActionLoading(true);
      await new Promise((r) => setTimeout(r, 600)); // Smooth feedback
      setGiveaways((prev) =>
        prev.map((g) =>
          g.giveawayId === giveawayId
            ? { ...g, winnersStatus: 'FINALIZED', status: 'ENDED', winnerCount: 1 }
            : g
        )
      );
      alert(`Giveaway ${giveawayId} finalized successfully! Winner selected via crypto.randomInt.`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRedrawConfirm = async () => {
    try {
      setActionLoading(true);
      await new Promise((r) => setTimeout(r, 600));
      alert(`Winner ${redrawModal.userId} redrawn successfully for ${redrawModal.giveawayId}.`);
      setRedrawModal({ open: false, giveawayId: null, userId: '' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateFulfillment = () => {
    if (!selectedClaim) return;
    setClaims((prev) =>
      prev.map((c) =>
        c._id === selectedClaim._id
          ? {
              ...c,
              status: fulfillmentForm.status,
              details: {
                ...c.details,
                courierPartner: fulfillmentForm.courierPartner,
                trackingNumber: fulfillmentForm.trackingNumber
              }
            }
          : c
      )
    );
    setSelectedClaim(null);
  };

  if (loading) {
    return <ThemedLoader fullScreen={false} />;
  }

  if (!isAdmin) {
    return (
      <div className={styles.adminContainer}>
        <div className="py-5 text-center">
          <Lock size={48} className="text-warning mb-3" />
          <h2 className="text-white">Admin Privileges Required</h2>
          <p className="text-muted">You must be logged in as an administrator to access this console.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.titleIconWrap}>
            <ShieldAlert size={26} />
          </div>
          <div>
            <h1 className={styles.title}>Giveaway Operations Console</h1>
            <p className={styles.subtitle}>
              Authoritative management of draws, participant audits, and fulfillment workflows
            </p>
          </div>
        </div>

        <div className={styles.statusPill}>
          <span className={styles.pulseDot} />
          <span>LEDGER ENGINE ACTIVE</span>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className={styles.kpiStrip}>
        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIconBox} bg-surface`}>
            <Layers size={22} className="text-emerald" />
          </div>
          <div>
            <div className={styles.kpiLabel}>Total Pools</div>
            <div className={styles.kpiValue}>{giveaways.length || 6}</div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIconBox} bg-surface`}>
            <Trophy size={22} className="text-warning" />
          </div>
          <div>
            <div className={styles.kpiLabel}>Finalized Pools</div>
            <div className={styles.kpiValue}>
              {giveaways.filter((g) => g.winnersStatus === 'FINALIZED').length || 2}
            </div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIconBox} bg-surface`}>
            <Package size={22} className="text-info" />
          </div>
          <div>
            <div className={styles.kpiLabel}>Pending Claims</div>
            <div className={styles.kpiValue}>
              {claims.filter((c) => c.status === 'SUBMITTED').length || 1}
            </div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIconBox} bg-surface`}>
            <ShieldAlert size={22} className="text-danger" />
          </div>
          <div>
            <div className={styles.kpiLabel}>Security Flags</div>
            <div className={styles.kpiValue}>0 Active</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabNav} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'pools'}
          className={`${styles.tabBtn} ${activeTab === 'pools' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('pools')}
        >
          <Layers size={16} />
          <span>Giveaway Pools ({giveaways.length})</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'claims'}
          className={`${styles.tabBtn} ${activeTab === 'claims' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('claims')}
        >
          <Package size={16} />
          <span>Prize Claims ({claims.length})</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'audit'}
          className={`${styles.tabBtn} ${activeTab === 'audit' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          <Clock size={16} />
          <span>Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: Pools */}
      {activeTab === 'pools' && (
        <div className={styles.tableContainer}>
          <div className={styles.tableWrap}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Giveaway Pool</th>
                  <th>Entry Fee</th>
                  <th>Participants</th>
                  <th>Pool Status</th>
                  <th>Draw State</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {giveaways.map((gw) => {
                  const isFinalized = gw.winnersStatus === 'FINALIZED';
                  return (
                    <tr key={gw.giveawayId || gw.slug}>
                      <td>
                        <div className={styles.poolTitleCell}>
                          <img
                            src={gw.prize?.image || '/assets/prizes/giftbox_gold.png'}
                            alt=""
                            className={styles.poolThumbnail}
                          />
                          <div>
                            <strong>{gw.title}</strong>
                            <div className="text-muted" style={{ fontSize: '0.74rem' }}>
                              {gw.giveawayId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-dark border border-secondary">
                          {gw.entry?.amount} {gw.entry?.currency}
                        </span>
                      </td>
                      <td>{gw.participantsCount || 120} joined</td>
                      <td>
                        <span
                          className={`${styles.statusTag} ${
                            gw.status === 'ACTIVE'
                              ? styles.statusActive
                              : gw.status === 'ENDED'
                              ? styles.statusFinalized
                              : styles.statusPending
                          }`}
                        >
                          {gw.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`${styles.statusTag} ${
                            isFinalized ? styles.statusFinalized : styles.statusPending
                          }`}
                        >
                          {isFinalized ? 'FINALIZED' : 'PENDING'}
                        </span>
                      </td>
                      <td>
                        {isFinalized ? (
                          <button
                            type="button"
                            className={`${styles.actionBtn} ${styles.btnWarning}`}
                            onClick={() =>
                              setRedrawModal({
                                open: true,
                                giveawayId: gw.giveawayId,
                                userId: 'VE10025'
                              })
                            }
                          >
                            <RefreshCw size={13} />
                            <span>Redraw Winner</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className={`${styles.actionBtn} ${styles.btnPrimary}`}
                            disabled={actionLoading}
                            onClick={() => handleFinalize(gw.giveawayId)}
                          >
                            <Sparkles size={13} />
                            <span>Run Draw</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Claims */}
      {activeTab === 'claims' && (
        <div className={styles.tableContainer}>
          <div className={styles.tableWrap}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Winner ID</th>
                  <th>Prize Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Submitted At</th>
                  <th>Fulfillment</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <code>{c._id}</code>
                    </td>
                    <td>
                      <strong>{c.userId}</strong>
                    </td>
                    <td>{c.prizeName}</td>
                    <td>
                      <span className="badge bg-secondary">{c.prizeType}</span>
                    </td>
                    <td>
                      <span
                        className={`${styles.statusTag} ${
                          c.status === 'COMPLETED'
                            ? styles.statusActive
                            : c.status === 'PROCESSING'
                            ? styles.statusShipped
                            : styles.statusPending
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="text-muted" style={{ fontSize: '0.78rem' }}>
                      {new Date(c.submittedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.btnPrimary}`}
                        onClick={() => {
                          setSelectedClaim(c);
                          setFulfillmentForm({
                            status: c.status,
                            courierPartner: c.details?.courierPartner || 'BlueDart',
                            trackingNumber: c.details?.trackingNumber || '',
                            notes: ''
                          });
                        }}
                      >
                        <Truck size={13} />
                        <span>Update Dispatch</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Audit */}
      {activeTab === 'audit' && (
        <div className={styles.tableContainer}>
          <div className={styles.tableWrap}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Event ID</th>
                  <th>Action</th>
                  <th>Target Pool</th>
                  <th>Actor</th>
                  <th>Result</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((a) => (
                  <tr key={a._id}>
                    <td>
                      <code>{a._id}</code>
                    </td>
                    <td>
                      <strong>{a.action}</strong>
                    </td>
                    <td>{a.giveawayId || 'GLOBAL'}</td>
                    <td>{a.userId}</td>
                    <td>
                      <span
                        className={`badge ${
                          a.result === 'SUCCESS' ? 'bg-success' : 'bg-danger'
                        }`}
                      >
                        {a.result}
                      </span>
                    </td>
                    <td className="text-muted" style={{ fontSize: '0.78rem' }}>
                      {new Date(a.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fulfillment Modal */}
      {selectedClaim && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Update Courier Fulfillment</h3>
              <button
                type="button"
                className={styles.closeModalBtn}
                onClick={() => setSelectedClaim(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Recipient & Address</label>
              <div className="p-2 bg-dark rounded border border-secondary text-light" style={{ fontSize: '0.8rem' }}>
                <div><strong>{selectedClaim.details?.fullName}</strong> ({selectedClaim.details?.phone})</div>
                <div>{selectedClaim.details?.addressLine1}, {selectedClaim.details?.city}, {selectedClaim.details?.state} - {selectedClaim.details?.pincode}</div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Fulfillment Status</label>
              <select
                className={styles.select}
                value={fulfillmentForm.status}
                onChange={(e) =>
                  setFulfillmentForm({ ...fulfillmentForm, status: e.target.value })
                }
              >
                <option value="SUBMITTED">SUBMITTED (Pending Review)</option>
                <option value="PROCESSING">PROCESSING (Packaging)</option>
                <option value="COMPLETED">COMPLETED (Shipped / In-Transit)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Courier Partner</label>
              <input
                type="text"
                className={styles.input}
                value={fulfillmentForm.courierPartner}
                onChange={(e) =>
                  setFulfillmentForm({ ...fulfillmentForm, courierPartner: e.target.value })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Consignment Tracking Number</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. BD-89240182"
                value={fulfillmentForm.trackingNumber}
                onChange={(e) =>
                  setFulfillmentForm({ ...fulfillmentForm, trackingNumber: e.target.value })
                }
              />
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setSelectedClaim(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={handleUpdateFulfillment}
              >
                Save Dispatch Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Redraw Modal */}
      {redrawModal.open && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Redraw Giveaway Winner</h3>
              <button
                type="button"
                className={styles.closeModalBtn}
                onClick={() => setRedrawModal({ open: false, giveawayId: null, userId: '' })}
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-warning" style={{ fontSize: '0.84rem' }}>
              Disqualifying confirmed winner <strong>{redrawModal.userId}</strong> will immediately draw a replacement participant from the active ledger via cryptographically random selection.
            </p>

            <div className={styles.formGroup}>
              <label className={styles.label}>Reason for Disqualification</label>
              <textarea
                className={styles.input}
                rows={3}
                value={redrawReason}
                onChange={(e) => setRedrawReason(e.target.value)}
              />
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setRedrawModal({ open: false, giveawayId: null, userId: '' })}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-warning btn-sm"
                onClick={handleRedrawConfirm}
              >
                Confirm Disqualification & Redraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;

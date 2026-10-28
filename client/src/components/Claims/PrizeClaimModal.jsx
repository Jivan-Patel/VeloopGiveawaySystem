import { useState, useEffect } from 'react';
import {
  X,
  Award,
  Clock,
  ShieldCheck,
  Truck,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Package,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getPrizeTypeConfig } from '../../config/prizeTypes';
import { CLAIM_STATUS, USER_STATE } from '../../config/giveawayStatus';
import styles from './PrizeClaimModal.module.css';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

/**
 * Prize Claim Modal (PRD Section 130 & WD7 Milestone)
 * Multi-state, accessible dialog for verified giveaway winners to claim prizes.
 * Form layout derived dynamically from prizeTypes registry (Physical vs Gift Card).
 */
export function PrizeClaimModal({ isOpen, onClose, prize, giveawayTitle }) {
  const {
    userState,
    claimStatus,
    setClaimStatus,
    claimPrizeType,
    submitClaim,
    claimRecord
  } = useAuth();

  // Prize configuration derived strictly from prizeTypes registry
  const effectivePrizeType = claimPrizeType || prize?.type || 'PHYSICAL';
  const prizeConfig = getPrizeTypeConfig(effectivePrizeType);

  const [formData, setFormData] = useState({
    fullName: 'Jivan Patel',
    phoneNumber: '9876543210',
    streetAddress: '402, Highline Residency, SG Highway',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380054',
    email: 'jivan@veloop.io',
    acceptedTerms: true
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmittingInternal, setIsSubmittingInternal] = useState(false);

  // Keyboard navigation & accessibility focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const modalElement = document.getElementById('prize-claim-dialog');
        if (!modalElement) return;

        const focusables = modalElement.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isPhysical = effectivePrizeType === 'PHYSICAL';
  const displayPrizeTitle = isPhysical
    ? (prize?.name || 'iPhone 15 Pro (128GB)')
    : (prize?.name || 'Amazon ₹2,000 Gift Voucher');
  const displayPrizeImage = isPhysical
    ? (prize?.image || '/assets/prizes/iphone15pro.png')
    : (prize?.image || '/assets/prizes/amazon2000.png');

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate using prizeTypes registry
    const errors = prizeConfig.validate ? prizeConfig.validate(formData) : {};
    if (!formData.acceptedTerms) {
      errors.acceptedTerms = 'You must accept the claim terms to proceed';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Trigger submission simulation
    setIsSubmittingInternal(true);
    setClaimStatus('SUBMITTING');

    setTimeout(() => {
      setIsSubmittingInternal(false);
      submitClaim({
        prizeName: displayPrizeTitle,
        prizeType: effectivePrizeType,
        ...formData
      });
    }, 1200);
  };

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        id="prize-claim-dialog"
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="claim-modal-title"
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleWrap}>
            <Award className={styles.headerIcon} size={20} />
            <div>
              <h2 id="claim-modal-title" className={styles.modalTitle}>
                Prize Claim Portal
              </h2>
              <p className={styles.modalSubtitle}>
                {giveawayTitle || 'Summer Rewards 2026'} · Verified Winner Claim
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Close claim dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          {/* Non-Winner Guard */}
          {userState !== USER_STATE.WINNER ? (
            <div className={styles.guardBanner}>
              <AlertTriangle size={32} className={styles.guardIcon} />
              <h3 className={styles.guardTitle}>Access Restricted</h3>
              <p className={styles.guardText}>
                This claim session is reserved exclusively for verified giveaway winners. Your account (
                <span className="text-white fw-bold">VE10025</span>) is currently marked as{' '}
                <span className="text-gold fw-bold">{userState}</span>.
              </p>
              <div className="mt-3">
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={onClose}
                >
                  Return to Giveaway Home
                </button>
              </div>
            </div>
          ) : claimStatus === CLAIM_STATUS.EXPIRED ? (
            /* Expired Claim State */
            <div className={styles.expiredBanner}>
              <Clock size={36} className={styles.expiredIcon} />
              <h3 className={styles.expiredTitle}>Claim Window Expired</h3>
              <p className={styles.expiredText}>
                The official 7-day claim window for this giveaway has elapsed. In compliance with Rule 6.2 of the VELOOP Terms, unclaimed physical and digital rewards are automatically returned to the community pool or re-drawn.
              </p>
              <div className="mt-3">
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={onClose}
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : claimStatus === CLAIM_STATUS.SUBMITTED || claimStatus === CLAIM_STATUS.PROCESSING || claimStatus === CLAIM_STATUS.COMPLETED ? (
            /* Submitted / Processing / Dispatched Success State */
            <div className={styles.successState}>
              <div className={styles.successIconCircle}>
                <CheckCircle2 size={36} />
              </div>
              <h3 className={styles.successTitle}>
                {claimStatus === CLAIM_STATUS.COMPLETED
                  ? 'Prize Dispatched & In Transit!'
                  : 'Claim Submitted Successfully!'}
              </h3>
              <p className={styles.successSubtitle}>
                Your verification details have been received and logged to the VELOOP audit ledger.
              </p>

              {/* Reference Card */}
              <div className={styles.recapCard}>
                <div className={styles.recapRow}>
                  <span className={styles.recapLabel}>Claim Reference ID</span>
                  <span className={styles.recapValueCode}>
                    {claimRecord?.claimId || 'CLM-84920'}
                  </span>
                </div>
                <div className={styles.recapRow}>
                  <span className={styles.recapLabel}>Prize Awarded</span>
                  <span className={styles.recapValue}>
                    {displayPrizeTitle}
                  </span>
                </div>
                <div className={styles.recapRow}>
                  <span className={styles.recapLabel}>Fulfillment Status</span>
                  <span className={styles.recapStatusBadge}>
                    {claimStatus === CLAIM_STATUS.COMPLETED ? 'DISPATCHED' : 'PENDING VERIFICATION'}
                  </span>
                </div>
                <div className={styles.recapRow}>
                  <span className={styles.recapLabel}>
                    {isPhysical ? 'Delivery Address' : 'Recipient Email'}
                  </span>
                  <span className={styles.recapValue}>
                    {isPhysical
                      ? `${formData.fullName}, ${formData.city}, ${formData.state} - ${formData.pincode}`
                      : formData.email}
                  </span>
                </div>
                <div className={styles.recapRow}>
                  <span className={styles.recapLabel}>Estimated Timeline</span>
                  <span className={styles.recapValue}>
                    {prizeConfig.estimatedFulfillment}
                  </span>
                </div>
              </div>

              <div className={styles.actionRowCenter}>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={onClose}
                >
                  Close & View Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* Unclaimed (NOT_SUBMITTED) & Submitting State: Verification Panel + Dynamic Form */
            <div className={styles.claimFlow}>
              {/* Step 1: Verification Panel */}
              <div className={styles.verificationCard}>
                <div className={styles.verificationHeader}>
                  <div className={styles.prizeThumbBox}>
                    <img
                      src={displayPrizeImage}
                      alt={displayPrizeTitle}
                      className={styles.prizeThumb}
                    />
                  </div>
                  <div className={styles.prizeMeta}>
                    <div className={styles.prizeBadgePill}>
                      <Award size={12} />
                      <span>{prizeConfig.label}</span>
                    </div>
                    <h3 className={styles.prizeName}>{displayPrizeTitle}</h3>
                    <div className={styles.countdownPill}>
                      <Clock size={12} />
                      <span>Claim Window: 6d 23h 48m remaining</span>
                    </div>
                  </div>
                </div>

                <div className={styles.trustNotices}>
                  <div className={styles.noticeItem}>
                    <ShieldCheck size={14} className={styles.noticeIcon} />
                    <span>Cryptographically verified winner (VE****25). Non-transferable.</span>
                  </div>
                  <div className={styles.noticeItem}>
                    {isPhysical ? (
                      <Truck size={14} className={styles.noticeIcon} />
                    ) : (
                      <Mail size={14} className={styles.noticeIcon} />
                    )}
                    <span>
                      {isPhysical
                        ? 'Doorstep delivery insured across all Indian postal PIN codes.'
                        : 'Encrypted digital voucher code dispatched directly to email.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 2: Form derived strictly from prizeTypes registry */}
              <form onSubmit={handleSubmit} className={styles.formContainer} noValidate>
                <div className={styles.formSectionHeader}>
                  <Package size={16} />
                  <span>
                    {isPhysical ? 'Shipping & Delivery Details' : 'Digital Voucher Delivery'}
                  </span>
                </div>

                {isPhysical ? (
                  /* Physical Prize Form Fields */
                  <div className={styles.formGrid}>
                    {/* Full Name */}
                    <div className={styles.fieldFull}>
                      <label htmlFor="field-fullname" className={styles.label}>
                        Full Legal Name <span className={styles.required}>*</span>
                      </label>
                      <input
                        id="field-fullname"
                        type="text"
                        className={`${styles.input} ${formErrors.fullName ? styles.inputError : ''}`}
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="e.g. Jivan Patel"
                        disabled={isSubmittingInternal}
                      />
                      {formErrors.fullName && (
                        <span className={styles.errorText}>{formErrors.fullName}</span>
                      )}
                    </div>

                    {/* Mobile Number (10 digits) */}
                    <div className={styles.fieldFull}>
                      <label htmlFor="field-phone" className={styles.label}>
                        10-Digit Mobile Number <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.inputPrefixWrap}>
                        <span className={styles.phonePrefix}>+91</span>
                        <input
                          id="field-phone"
                          type="tel"
                          maxLength={10}
                          className={`${styles.input} ${styles.inputWithPrefix} ${formErrors.phoneNumber ? styles.inputError : ''}`}
                          value={formData.phoneNumber}
                          onChange={(e) =>
                            handleInputChange('phoneNumber', e.target.value.replace(/\D/g, ''))
                          }
                          placeholder="9876543210"
                          disabled={isSubmittingInternal}
                        />
                      </div>
                      {formErrors.phoneNumber && (
                        <span className={styles.errorText}>{formErrors.phoneNumber}</span>
                      )}
                    </div>

                    {/* Street Address */}
                    <div className={styles.fieldFull}>
                      <label htmlFor="field-address" className={styles.label}>
                        Delivery Street Address <span className={styles.required}>*</span>
                      </label>
                      <textarea
                        id="field-address"
                        rows={2}
                        className={`${styles.textarea} ${formErrors.streetAddress ? styles.inputError : ''}`}
                        value={formData.streetAddress}
                        onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                        placeholder="Flat, House No., Building Name, Street / Sector"
                        disabled={isSubmittingInternal}
                      />
                      {formErrors.streetAddress && (
                        <span className={styles.errorText}>{formErrors.streetAddress}</span>
                      )}
                    </div>

                    {/* City */}
                    <div className={styles.fieldHalf}>
                      <label htmlFor="field-city" className={styles.label}>
                        City <span className={styles.required}>*</span>
                      </label>
                      <input
                        id="field-city"
                        type="text"
                        className={`${styles.input} ${formErrors.city ? styles.inputError : ''}`}
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="City"
                        disabled={isSubmittingInternal}
                      />
                      {formErrors.city && (
                        <span className={styles.errorText}>{formErrors.city}</span>
                      )}
                    </div>

                    {/* State Dropdown */}
                    <div className={styles.fieldHalf}>
                      <label htmlFor="field-state" className={styles.label}>
                        State <span className={styles.required}>*</span>
                      </label>
                      <select
                        id="field-state"
                        className={`${styles.select} ${formErrors.state ? styles.inputError : ''}`}
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        disabled={isSubmittingInternal}
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      {formErrors.state && (
                        <span className={styles.errorText}>{formErrors.state}</span>
                      )}
                    </div>

                    {/* PIN Code (6 digits) */}
                    <div className={styles.fieldFull}>
                      <label htmlFor="field-pincode" className={styles.label}>
                        Postal PIN Code (6 digits) <span className={styles.required}>*</span>
                      </label>
                      <input
                        id="field-pincode"
                        type="text"
                        maxLength={6}
                        className={`${styles.input} ${formErrors.pincode ? styles.inputError : ''}`}
                        value={formData.pincode}
                        onChange={(e) =>
                          handleInputChange('pincode', e.target.value.replace(/\D/g, ''))
                        }
                        placeholder="380054"
                        disabled={isSubmittingInternal}
                      />
                      {formErrors.pincode && (
                        <span className={styles.errorText}>{formErrors.pincode}</span>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Gift Card Form Fields (Email Only - No Postal Address) */
                  <div className={styles.formGrid}>
                    <div className={styles.fieldFull}>
                      <label htmlFor="field-email" className={styles.label}>
                        Recipient Email Address <span className={styles.required}>*</span>
                      </label>
                      <input
                        id="field-email"
                        type="email"
                        className={`${styles.input} ${formErrors.email ? styles.inputError : ''}`}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="jivan@veloop.io"
                        disabled={isSubmittingInternal}
                      />
                      {formErrors.email && (
                        <span className={styles.errorText}>{formErrors.email}</span>
                      )}
                      <p className={styles.helperText}>
                        The activation code and redemption voucher will be sent to this verified inbox within 24 hours.
                      </p>
                    </div>
                  </div>
                )}

                {/* Terms Acceptance Checkbox */}
                <div className={styles.termsBox}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={formData.acceptedTerms}
                      onChange={(e) => handleInputChange('acceptedTerms', e.target.checked)}
                      disabled={isSubmittingInternal}
                      className={styles.checkbox}
                    />
                    <span>
                      I confirm that the details provided are accurate and understand that physical claims are non-transferable per VELOOP terms.
                    </span>
                  </label>
                  {formErrors.acceptedTerms && (
                    <span className={styles.errorText}>{formErrors.acceptedTerms}</span>
                  )}
                </div>

                {/* Submit CTA */}
                <div className={styles.actionRow}>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={onClose}
                    disabled={isSubmittingInternal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.primaryBtn}
                    disabled={isSubmittingInternal}
                  >
                    {isSubmittingInternal ? (
                      <span className={styles.submittingSpinnerWrap}>
                        <span className={styles.spinner} />
                        <span>Submitting Claim…</span>
                      </span>
                    ) : (
                      <span>Confirm & Claim Prize →</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <span className={styles.footerNote}>
            🛡️ Protected by VELOOP Cryptographic Ledger Audit · 24/7 Logistics Support
          </span>
          <a
            href="/giveaway#rules"
            className={styles.footerLink}
            onClick={onClose}
          >
            Rules & Terms <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default PrizeClaimModal;

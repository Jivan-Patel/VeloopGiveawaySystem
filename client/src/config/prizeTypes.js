/**
 * VELOOP Giveaway System - Prize Types Registry
 * Defines claim form mapping, required validation fields, and fulfillment metadata.
 */

export const PRIZE_TYPES = {
  PHYSICAL: {
    type: 'PHYSICAL',
    label: 'Physical Product',
    badgeText: 'Shipped to Doorstep',
    formType: 'PhysicalClaimForm',
    estimatedFulfillment: '3–7 Business Days',
    requiredFields: [
      { name: 'fullName', label: 'Full Legal Name', type: 'text', placeholder: 'Enter your full name' },
      { name: 'phoneNumber', label: '10-Digit Mobile Number', type: 'tel', placeholder: 'e.g. 9876543210' },
      { name: 'streetAddress', label: 'Delivery Address', type: 'textarea', placeholder: 'Flat, House No., Building, Street' },
      { name: 'city', label: 'City', type: 'text', placeholder: 'City' },
      { name: 'state', label: 'State', type: 'text', placeholder: 'State' },
      { name: 'pincode', label: 'PIN Code (6 digits)', type: 'text', placeholder: 'e.g. 400001' }
    ],
    validate: (data) => {
      const errors = {};
      if (!data.fullName?.trim()) errors.fullName = 'Full name is required';
      if (!/^[6-9]\d{9}$/.test(data.phoneNumber || '')) errors.phoneNumber = 'Valid 10-digit Indian mobile required';
      if (!data.streetAddress?.trim()) errors.streetAddress = 'Delivery address is required';
      if (!data.city?.trim()) errors.city = 'City is required';
      if (!data.state?.trim()) errors.state = 'State is required';
      if (!/^\d{6}$/.test(data.pincode || '')) errors.pincode = 'Valid 6-digit Indian PIN code required';
      return errors;
    }
  },

  GIFT_CARD: {
    type: 'GIFT_CARD',
    label: 'Digital Gift Voucher',
    badgeText: 'Instant Email Voucher',
    formType: 'GiftCardClaimForm',
    estimatedFulfillment: 'Within 24 Hours',
    requiredFields: [
      { name: 'email', label: 'Recipient Email Address', type: 'email', placeholder: 'name@example.com' }
    ],
    validate: (data) => {
      const errors = {};
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Valid email address is required';
      }
      return errors;
    }
  },

  DIGITAL: {
    type: 'DIGITAL',
    label: 'Digital Reward',
    badgeText: 'Direct Credit / Digital Code',
    formType: 'GiftCardClaimForm',
    estimatedFulfillment: 'Instant to 12 Hours',
    requiredFields: [
      { name: 'email', label: 'Registered Email Address', type: 'email', placeholder: 'name@example.com' }
    ],
    validate: (data) => {
      const errors = {};
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Valid email address is required';
      }
      return errors;
    }
  }
};

/**
 * Returns the prize configuration for a given prize type. Defaults to PHYSICAL.
 */
export const getPrizeTypeConfig = (type) => {
  const normalized = (type || '').toUpperCase();
  return PRIZE_TYPES[normalized] || PRIZE_TYPES.PHYSICAL;
};

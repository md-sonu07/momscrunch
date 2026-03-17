const DEFAULT_FREE_SHIPPING_THRESHOLD = 499;

const roundCurrency = (value) => Number((value || 0).toFixed(2));

export const calculateOrderSummary = ({
    subtotal = 0,
    gstPercentage = 0,
    deliveryCharge = 0,
    freeShippingThreshold = DEFAULT_FREE_SHIPPING_THRESHOLD,
    couponDiscount = 0,
}) => {
    const normalizedSubtotal = roundCurrency(subtotal);
    const normalizedThreshold = Number(freeShippingThreshold ?? DEFAULT_FREE_SHIPPING_THRESHOLD);
    const freeShippingEligible = normalizedSubtotal >= normalizedThreshold && normalizedSubtotal > 0;
    const shipping = freeShippingEligible || normalizedSubtotal === 0
        ? 0
        : roundCurrency(Number(deliveryCharge || 0));

    const taxableTotal = Math.max(normalizedSubtotal - Number(couponDiscount || 0), 0);
    const tax = roundCurrency((taxableTotal * Number(gstPercentage || 0)) / 100);
    const total = roundCurrency(taxableTotal + shipping + tax);

    return {
        subtotal: normalizedSubtotal,
        shipping,
        tax,
        total,
        couponDiscount: Number(couponDiscount || 0),
        freeShippingEligible,
        freeShippingThreshold: normalizedThreshold,
    };
};

export const formatCurrency = (value) => roundCurrency(Number(value || 0)).toFixed(2);

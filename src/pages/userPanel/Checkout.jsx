import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    MapPin,
    CreditCard,
    CheckCircle2,
    Truck,
    ShieldCheck,
    Clock,
    ShoppingBag,
    Plus,
    Minus,
    Trash2
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { applyCoupon, removeCoupon } from '../../api/cart.api';
import { fetchCart, updateQuantity, deleteItem } from '../../redux/thunk/cartThunk';
import { getStoreSettings } from '../../redux/thunk/storeSettingsThunk';
import { selectCartItems } from '../../redux/slice/cartSlice';
import { fetchAddresses } from '../../redux/thunk/addressThunk';
import { selectAddresses, selectDefaultAddress } from '../../redux/slice/addressSlice';
import { calculateOrderSummary, formatCurrency } from '../../utils/orderSummary';
import { toast } from 'react-hot-toast';
import { placeOrder, createPaymentOrder, verifyPayment } from '../../api/payment.api';
import { getShippingCharges } from '../../api/shipping.api';

const Checkout = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('online');
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [shippingCharges, setShippingCharges] = useState(0);
    const [isFetchingShipping, setIsFetchingShipping] = useState(false);
    const [shippingError, setShippingError] = useState(null);
    const [deliveryMethod, setDeliveryMethod] = useState(null);
    const [shippingForm, setShippingForm] = useState({
        name: '',
        phone: '',
        street: '',
        landmark: '',
        city: '',
        pin_code: '',
        state: '',
        country: 'India',
    });
    const [showCouponInput, setShowCouponInput] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [pendingOrderId, setPendingOrderId] = useState(null);
    const orderPlacedRef = useRef(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const addresses = useSelector(selectAddresses);
    const defaultAddress = useSelector(selectDefaultAddress);
    const {
        gstPercentage,
        deliveryCharge,
        freeShippingThreshold,
    } = useSelector((state) => state.storeSettings);

    useEffect(() => {
        dispatch(fetchCart());
        dispatch(getStoreSettings()).catch(() => { });
        dispatch(fetchAddresses());

        // Load Razorpay SDK dynamically
        const script = document.createElement('script');
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup: remove the script tag when component unmounts
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [dispatch]);

    // Redirect to shop if cart is empty (but not after a successful order)
    const { cart, loading: cartLoading } = useSelector((state) => state.cart);
    useEffect(() => {
        if (!cartLoading && cart && cartItems.length === 0 && !orderPlacedRef.current) {
            navigate('/shop');
            toast.error('Your bucket is empty. Let\'s crunch some items first!', {
                id: 'empty-cart-error'
            });
        }
    }, [cartLoading, cart, cartItems.length, navigate]);

    const applyAddressToForm = (address) => {
        if (!address) {
            return;
        }

        setSelectedAddressId(address.id);
        setShippingForm({
            name: address.name || '',
            phone: address.phone || '',
            street: address.street || '',
            landmark: address.landmark || '',
            city: address.city || '',
            pin_code: address.pin_code || '',
            state: address.state || '',
            country: address.country || 'India',
        });
    };

    useEffect(() => {
        if (defaultAddress && !selectedAddressId) {
            applyAddressToForm(defaultAddress);
        }
    }, [defaultAddress, selectedAddressId]);

    // Calculate subtotal first as it's needed by useEffect
    const { subtotal, originalSubtotal, totalDiscount } = useMemo(() => {
        const selling = cartItems.reduce((acc, item) => acc + (parseFloat(item.product_price) * item.quantity), 0);
        const original = cartItems.reduce((acc, item) => acc + (parseFloat(item.product_original_price || item.product_price) * item.quantity), 0);
        const discount = original - selling;
        return { subtotal: selling, originalSubtotal: original, totalDiscount: discount };
    }, [cartItems]);

    // Fetch shipping charges when pincode changes
    useEffect(() => {
        const fetchShippingCharges = async () => {
            if (!shippingForm.pin_code || shippingForm.pin_code.length !== 6) {
                setShippingCharges(0);
                setShippingError(null);
                setDeliveryMethod(null);
                return;
            }

            setIsFetchingShipping(true);
            setShippingError(null);
            
            try {
                console.log('Sending to API - pincode:', shippingForm.pin_code, 'cart_total:', subtotal);
                const response = await getShippingCharges({
                    pincode: shippingForm.pin_code,
                    cart_total: subtotal
                });
                
                console.log('Shipping API response:', response);
                setShippingCharges(response.shipping_charges || 0);
                setDeliveryMethod(response.delivery_method || null);
                console.log('Delivery method set:', response.delivery_method);
            } catch (error) {
                console.error('Error fetching shipping charges:', error);
                setShippingError(error.response?.data?.detail || 'Failed to fetch shipping charges');
                setShippingCharges(0);
                setDeliveryMethod(null);
            } finally {
                setIsFetchingShipping(false);
            }
        };

        fetchShippingCharges();
    }, [shippingForm.pin_code, subtotal]);

    const cartSummary = useMemo(() => {
        const summary = calculateOrderSummary({
            subtotal,
            gstPercentage,
            deliveryCharge: shippingCharges, // Use dynamic shipping charges
            freeShippingThreshold,
            couponDiscount: cart?.discount || 0,
        });

        return {
            ...summary,
            items: cartItems,
        };
    }, [cartItems, subtotal, gstPercentage, shippingCharges, freeShippingThreshold, cart?.discount]);

    const steps = [
        { id: 1, label: "Shipping", icon: MapPin },
        { id: 2, label: "Payment", icon: CreditCard },
        { id: 3, label: "Confirm", icon: CheckCircle2 }
    ];

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
    const handleShippingInputChange = (field, value) => {
        setShippingForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const isShippingStepValid = [
        shippingForm.name,
        shippingForm.phone,
        shippingForm.street,
        shippingForm.city,
        shippingForm.pin_code,
        shippingForm.state,
    ].every((value) => String(value || '').trim());

    const handleProceed = () => {
        if (step === 1 && !isShippingStepValid) {
            toast.error('Please complete the shipping address first');
            return;
        }

        nextStep();
    };

    const handleBackAction = () => {
        if (step === 1) {
            navigate('/profile/cart');
            return;
        }

        prevStep();
    };

    const handleUpdateQuantity = async (itemId, quantity) => {
        if (quantity < 1) return;
        try {
            await dispatch(updateQuantity({ itemId, quantity })).unwrap();
        } catch (error) {
            toast.error(error || 'Failed to update quantity');
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await dispatch(deleteItem(itemId)).unwrap();
            toast.success('Item removed from order');
        } catch (error) {
            toast.error(error || 'Failed to remove item');
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsApplyingCoupon(true);
        try {
            await applyCoupon(couponCode);
            await dispatch(fetchCart()).unwrap();
            toast.success('Coupon applied successfully!');
            setShowCouponInput(false);
            setCouponCode('');
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to apply coupon');
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = async () => {
        setIsApplyingCoupon(true);
        try {
            await removeCoupon();
            await dispatch(fetchCart()).unwrap();
            toast.success('Coupon removed');
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to remove coupon');
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleCompletePurchase = async () => {
        if (isProcessing) return;
        setIsProcessing(true);

        try {
            // 1. Create order in backend (only if we don't have one already)
            let orderId = pendingOrderId;
            if (!orderId) {
                const orderRes = await placeOrder(shippingForm, paymentMethod);
                orderId = orderRes.order_id;
                setPendingOrderId(orderId);
            }

            if (paymentMethod === 'cod') {
                toast.success('Order Placed Successfully! Your premium crunch is on the way.');
                // Mark order as placed to prevent empty-cart redirect
                orderPlacedRef.current = true;
                // Refresh cart to clear badge count
                dispatch(fetchCart());
                navigate('/profile/orders');
                return;
            }

            // 2. Create Razorpay order
            const razorpayOrder = await createPaymentOrder(orderId);

            // 3. Configure Razorpay options
            const options = {
                key: razorpayOrder.razorpay_key,
                amount: razorpayOrder.amount, // Amount already in paise from backend
                currency: razorpayOrder.currency,
                name: "MomsCrunch",
                description: "Purchase of Handcrafted Premium Cookies",
                order_id: razorpayOrder.razorpay_order_id,
                handler: async (response) => {
                    try {
                        // 4. Verify payment
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        toast.success('Payment Successful! Your crunch is on the way.');
                        // Mark order as placed to prevent empty-cart redirect
                        orderPlacedRef.current = true;
                        // Refresh cart to clear badge count
                        dispatch(fetchCart());
                        setPendingOrderId(null);
                        navigate('/profile/orders');
                    } catch (error) {
                        toast.error('Payment verification failed. Please contact support.');
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: shippingForm.name,
                    contact: shippingForm.phone,
                },
                theme: {
                    color: "#F97316", // Primary color
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                        // Don't clear pendingOrderId - user can retry with same order
                    }
                }
            };

            if (window.Razorpay) {
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                toast.error('Razorpay SDK not loaded. Please refresh the page.');
                setIsProcessing(false);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.detail || 'Failed to initiate payment');
            setIsProcessing(false);
            // Clear pending order ID on error so a fresh order can be created
            setPendingOrderId(null);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 selection:bg-primary pt-10 pb-24">
            <div className="max-w-[1400px] mx-auto sm:px-6">
                {/* Header & Back Button */}
                <div className="mb-8 md:mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <button
                            onClick={() => step === 1 ? navigate('/profile/cart') : prevStep()}
                            className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-[0.2em] group mb-3 cursor-pointer"
                        >
                            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            {step === 1 ? 'Back to Bucket' : 'Previous Step'}
                        </button>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            Secure <span className="text-primary italic">Checkout</span>
                        </h1>
                    </div>

                    {/* Stepper Logic - Desktop */}
                    <div className="hidden md:flex items-center gap-4">
                        {steps.map((s, idx) => (
                            <React.Fragment key={s.id}>
                                <div className={`flex items-center gap-3 ${step >= s.id ? 'text-primary' : 'text-slate-300 dark:text-slate-700'}`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${step >= s.id ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20' : 'border-slate-100 dark:border-slate-800'}`}>
                                        <s.icon size={18} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{s.label}</span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className={`w-12 h-0.5 rounded-full ${step > s.id ? 'bg-primary' : 'bg-slate-100 dark:bg-slate-800'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Stepper Logic - Mobile simplified */}
                    <div className="md:hidden w-full space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span>{steps[step - 1].label}</span>
                            <span className="text-primary">Step 0{step} / 03</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-out"
                                style={{ width: `${(step / 3) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-8 order-2 lg:order-1 space-y-6 md:space-y-8">
                        {step === 1 && (
                            <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Shipping Details</h2>
                                    <span className="hidden md:inline-block text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">Step 01/03</span>
                                </div>

                                <form className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                            <div>
                                                <h3 className="text-sm font-black text-slate-900 dark:text-white">Saved Addresses</h3>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                                    Select one to auto fill checkout details
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {defaultAddress && (
                                                    <button
                                                        type="button"
                                                        onClick={() => applyAddressToForm(defaultAddress)}
                                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 border border-primary/10 px-4 py-2 rounded-xl cursor-pointer"
                                                    >
                                                        Auto Fill Default
                                                    </button>
                                                )}
                                                <Link
                                                    to="/profile/addresses"
                                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary transition-colors"
                                                >
                                                    Manage Addresses
                                                </Link>
                                            </div>
                                        </div>

                                        {addresses.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {addresses.map((address) => (
                                                    <button
                                                        key={address.id}
                                                        type="button"
                                                        onClick={() => applyAddressToForm(address)}
                                                        className={`text-left rounded-2xl border p-4 transition-all cursor-pointer ${selectedAddressId === address.id
                                                            ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                                                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 hover:border-primary/30'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between gap-3 mb-3">
                                                            <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] ${address.is_default ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                                                {address.address_type}
                                                            </span>
                                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                                                                {selectedAddressId === address.id ? 'Selected' : 'Use this address'}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm font-black text-slate-900 dark:text-white">{address.name}</div>
                                                        <div className="text-[11px] font-bold text-slate-500 mt-1">+91 {address.phone}</div>
                                                        <div className="text-[11px] font-bold text-slate-500 mt-3 leading-relaxed">
                                                            {address.street}
                                                            {address.landmark ? `, ${address.landmark}` : ''}
                                                        </div>
                                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-3">
                                                            {address.city}, {address.state} - {address.pin_code}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-5 text-center">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                                                    No saved address yet
                                                </p>
                                                <Link
                                                    to="/profile/addresses"
                                                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary"
                                                >
                                                    <MapPin size={14} />
                                                    Add address first
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <input
                                                type="text"
                                                value={shippingForm.name}
                                                onChange={(e) => handleShippingInputChange('name', e.target.value)}
                                                placeholder="John Doe"
                                                className="w-full bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
                                            <input
                                                type="tel"
                                                value={shippingForm.phone}
                                                onChange={(e) => handleShippingInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                placeholder="+91 98765 43210"
                                                className="w-full bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Complete Address</label>
                                        <textarea
                                            rows="3"
                                            value={shippingForm.street}
                                            onChange={(e) => handleShippingInputChange('street', e.target.value)}
                                            placeholder="Flat/House No, Street, Area"
                                            className="w-full bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none shadow-sm"
                                        ></textarea>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Landmark</label>
                                            <input
                                                type="text"
                                                value={shippingForm.landmark}
                                                onChange={(e) => handleShippingInputChange('landmark', e.target.value)}
                                                placeholder="Near Central Park"
                                                className="w-full bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Country</label>
                                            <input
                                                type="text"
                                                value={shippingForm.country}
                                                onChange={(e) => handleShippingInputChange('country', e.target.value)}
                                                placeholder="India"
                                                className="w-full bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">City</label>
                                            <input
                                                type="text"
                                                value={shippingForm.city}
                                                onChange={(e) => handleShippingInputChange('city', e.target.value)}
                                                placeholder="Jaipur"
                                                className="w-full bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Pin Code</label>
                                            <input
                                                type="text"
                                                value={shippingForm.pin_code}
                                                onChange={(e) => handleShippingInputChange('pin_code', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                placeholder="302001"
                                                className="w-full bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-2 md:col-span-1">
                                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">State</label>
                                            <input
                                                type="text"
                                                value={shippingForm.state}
                                                onChange={(e) => handleShippingInputChange('state', e.target.value)}
                                                placeholder="Rajasthan"
                                                className="w-full bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Shipping Information */}
                                    {shippingForm.pin_code && shippingForm.pin_code.length === 6 && (
                                        <div className="space-y-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">Shipping Information</h3>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                                        Based on your pincode {shippingForm.pin_code}
                                                    </p>
                                                </div>
                                                {deliveryMethod && (
                                                    <div className="text-right">
                                                        <p className="text-xs font-black text-primary">{deliveryMethod}</p>
                                                    </div>
                                                )}
                                                {isFetchingShipping && (
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                                
                                            </div>

                                            {shippingError && (
                                                <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-3">
                                                    <p className="text-[9px] font-bold text-rose-600 dark:text-rose-400">{shippingError}</p>
                                                </div>
                                            )}

                                            
                                        </div>
                                    )}
                                </form>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Payment Method</h2>
                                    <span className="hidden md:inline-block text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">Step 02/03</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { id: 'online', name: 'Online Payment', icon: <CreditCard className="text-primary" />, desc: 'UPI, Card, Net Banking', popular: true },
                                        { id: 'cod', name: 'Cash on Delivery', icon: <Truck className="text-primary" />, desc: 'Pay when you crunch' },
                                    ].map((method) => {
                                        const isActive = paymentMethod === method.id;
                                        return (
                                            <div
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`p-4 border rounded-xl flex items-center gap-4 cursor-pointer transition-all relative overflow-hidden group active:scale-[0.98] ${isActive
                                                    ? 'bg-primary/5 border-primary shadow-lg shadow-primary/10'
                                                    : 'bg-white/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                                    }`}
                                            >
                                                {method.popular && (
                                                    <div className="absolute top-2 right-2 bg-primary text-white text-[7px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full shadow-lg shadow-primary/20">
                                                        Popular
                                                    </div>
                                                )}

                                                <div className={`w-11 h-11 rounded-lg flex items-center justify-center shadow-sm border transition-all ${isActive
                                                    ? 'bg-white dark:bg-slate-900 border-primary/20 scale-105'
                                                    : 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 group-hover:scale-105'
                                                    }`}>
                                                    {method.icon}
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className={`text-[13px] font-black tracking-tight mb-0.5 transition-colors ${isActive ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                                                        {method.name}
                                                    </h3>
                                                    <p className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-primary/60' : 'text-slate-400'}`}>
                                                        {method.desc}
                                                    </p>
                                                </div>

                                                <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${isActive
                                                    ? 'border-primary bg-primary'
                                                    : 'border-slate-200 dark:border-slate-700 group-hover:border-slate-400'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full bg-white transition-all ${isActive ? 'scale-100' : 'scale-0'}`} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="hidden md:block bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-3xl p-8 lg:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none animate-in zoom-in-95 duration-500 text-center">
                                <div className="relative w-32 h-32 mx-auto mb-8">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                                    <div className="relative w-full h-full bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/30">
                                        <CheckCircle2 size={64} strokeWidth={2.5} />
                                    </div>
                                </div>

                                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Almost There!</h2>
                                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm max-w-md mx-auto mb-12 leading-relaxed uppercase tracking-[0.2em]">
                                    Review your final order summary on the right and click "Complete Purchase" <br className="hidden lg:block" /> to finalize your handcrafted crunch order.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-2xl mx-auto border-t border-slate-100 dark:border-slate-800 pt-10">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-primary"><Truck size={20} /></div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery</div>
                                            <div className="text-sm font-extrabold text-slate-900 dark:text-white">Within 1 Week</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-primary"><ShieldCheck size={20} /></div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quality</div>
                                            <div className="text-sm font-extrabold text-slate-900 dark:text-white">100% Organic</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-primary"><Clock size={20} /></div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dispatch</div>
                                            <div className="text-sm font-extrabold text-slate-900 dark:text-white">Within 24 Hours</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Actions for Desktop / Mobile */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                            <div className="flex items-center gap-3 text-slate-400 order-3 md:order-1">
                                <ShieldCheck size={18} className="text-green-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-center md:text-left">Guaranteed SSL Security</span>
                            </div>

                            <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch gap-4 order-1 md:order-2">
                                <button
                                    onClick={handleBackAction}
                                    className="w-full md:w-auto bg-white dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 px-10 py-5 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 hover:border-primary/30 hover:text-primary hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4 group cursor-pointer"
                                >
                                    <ChevronLeft size={18} className="group-hover:-translate-x-1.5 transition-transform" />
                                    {step === 1 ? 'Back to Cart' : 'Go Back'}
                                </button>

                                {step < 3 ? (
                                    <button
                                        onClick={handleProceed}
                                        className="w-full md:w-auto bg-primary text-white px-10 py-5 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                        disabled={step === 1 && !isShippingStepValid}
                                    >
                                        Proceed to {step === 1 ? 'Payment' : 'Review'}
                                        <ChevronRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary (Sticky) */}
                    <div className="lg:col-span-4 order-1 lg:order-2 lg:sticky top-32">
                        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
                            <div className="flex items-center gap-3 mb-6 sm:mb-8">
                                <ShoppingBag size={20} className="text-primary" />
                                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Order Summary</h2>
                            </div>

                            {/* Summary Items List */}
                            <div className="space-y-4 mb-8 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                                {cartSummary.items.map((item) => (
                                    <div key={item.id} className="group/item flex gap-4 items-center bg-white/40 dark:bg-slate-800/20 p-3 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-white/5 transition-all">
                                        <Link to={`/product/${item.product_slug}`} className="w-16 h-19 bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden shadow-inner shrink-0 relative group-hover/item:scale-105 transition-transform cursor-pointer">
                                            <img
                                                src={item.product_image || 'https://images.unsplash.com/photo-1589113103503-496550346c1f?q=80&w=800&auto=format&fit=crop'}
                                                alt={item.product_name}
                                                className="w-full h-full object-cover"
                                            />
                                        </Link>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <Link to={`/product/${item.product_slug}`} className="text-xs font-black text-start text-slate-900 dark:text-white truncate flex-1 hover:text-primary transition-colors cursor-pointer">{item.product_name}</Link>
                                                <button
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer"
                                                    title="Remove Item"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            <Link to={`/product/${item.product_slug}`} className="cursor-pointer group/link">
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-[9px] font-black text-primary uppercase tracking-widest">₹{formatCurrency(item.product_price)}</p>
                                                    {parseFloat(item.product_original_price) > parseFloat(item.product_price) && (
                                                        <p className="text-[8px] font-bold text-slate-400 line-through opacity-60">₹{formatCurrency(item.product_original_price)}</p>
                                                    )}
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">/ unit</span>
                                                </div>
                                            </Link>
                                            <div className="flex items-center justify-between mt-2">

                                                <div className="flex items-center bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-0.5">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="w-6 text-center text-[10px] font-black text-slate-900 dark:text-white tabular-nums">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                                <div className="text-sm font-black text-slate-900 dark:text-white tabular-nums">₹{formatCurrency(item.product_price * item.quantity)}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cost Breakdown */}
                            <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-8 sm:mb-8">
                                <div className="flex justify-between items-center text-sm font-bold text-slate-400 group">
                                    <span className="uppercase tracking-widest text-[10px]">Subtotal (Original)</span>
                                    <span className="text-slate-900 dark:text-white tabular-nums">₹{formatCurrency(originalSubtotal)}</span>
                                </div>
                                {totalDiscount > 0 && (
                                    <div className="flex justify-between items-center text-sm font-bold text-emerald-500 group">
                                        <span className="uppercase tracking-widest text-[10px]">Product Discount</span>
                                        <span className="tabular-nums">-₹{formatCurrency(totalDiscount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-sm font-bold text-slate-400 group">
                                    <span className="uppercase tracking-widest text-[10px]">Shipping</span>
                                    {cartSummary.shipping === 0 ? (
                                        <span className="text-green-500 uppercase tracking-widest text-[10px] font-black underline underline-offset-4 decoration-2">Free</span>
                                    ) : (
                                        <span className="text-slate-900 dark:text-white tabular-nums">₹{formatCurrency(cartSummary.shipping)}</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold text-slate-400 group">
                                    <span className="uppercase tracking-widest text-[10px]">Tax (GST {formatCurrency(gstPercentage)}%)</span>
                                    <span className="text-slate-900 dark:text-white tabular-nums">₹{formatCurrency(cartSummary.tax)}</span>
                                </div>

                                {cartSummary.couponDiscount > 0 && (
                                    <div className="flex justify-between items-center text-sm font-bold text-emerald-500 group animate-in slide-in-from-left-2 transition-all">
                                        <div className="flex items-center gap-2">
                                            <span className="uppercase tracking-widest text-[10px]">Coupon Discount</span>
                                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">{cart.coupon_code}</span>
                                        </div>
                                        <span className="tabular-nums">-₹{formatCurrency(cartSummary.couponDiscount)}</span>
                                    </div>
                                )}

                                {/* Coupon Section */}
                                <div className="mt-4 pt-4 border-t border-slate-100/50 dark:border-slate-800/50">
                                    {!cart?.coupon_code ? (
                                        !showCouponInput ? (
                                            <button
                                                onClick={() => setShowCouponInput(true)}
                                                className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:underline cursor-pointer flex items-center gap-2 transition-all hover:gap-3"
                                            >
                                                <Plus size={14} />
                                                Add coupon code
                                            </button>
                                        ) : (
                                            <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                                    placeholder="ENTER CODE"
                                                    className="flex-1 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={handleApplyCoupon}
                                                    disabled={isApplyingCoupon || !couponCode}
                                                    className="bg-primary text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
                                                >
                                                    {isApplyingCoupon ? '...' : 'Apply'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowCouponInput(false);
                                                        setCouponCode('');
                                                    }}
                                                    className="p-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                            </div>
                                        )
                                    ) : (
                                        <div className="flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100/50 dark:border-emerald-500/10 rounded-xl p-4 animate-in zoom-in-95 duration-300">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                                    <CheckCircle2 size={16} />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                                                        Coupon Applied
                                                    </div>
                                                    <div className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-tighter">
                                                        Code: {cart.coupon_code}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleRemoveCoupon}
                                                className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 border-t-2 border-dashed border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-slate-900 dark:text-white font-black uppercase tracking-[0.2em] text-[10px]">Grand Total</span>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Payable Amount</span>
                                    </div>
                                    <span className="text-3xl font-black text-primary tabular-nums tracking-tighter">₹{formatCurrency(cartSummary.total)}</span>
                                </div>
                            </div>

                            {/* Complete Purchase Button - Desktop Only */}
                            {step === 3 && (
                                <div className="hidden lg:block mt-8">
                                    <button
                                        onClick={handleCompletePurchase}
                                        disabled={isProcessing}
                                        className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4 group cursor-pointer active:translate-y-0 relative overflow-hidden disabled:opacity-50">
                                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]" />
                                        {isProcessing ? 'Processing...' : 'Complete Purchase'}
                                        <ShieldCheck size={20} className="group-hover:rotate-12 transition-transform" />
                                    </button>
                                    <p className="text-[9px] text-center font-bold text-slate-400 uppercase tracking-widest mt-4">
                                        By clicking, you agree to our <Link to="/terms-and-conditions" target="_blank" className="text-primary hover:underline">Terms & Conditions</Link>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Floating Purchase Slip - Step 3 Mobile Only */}
            {step === 3 && (
                <div className="md:hidden fixed bottom-28 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 duration-700">
                    <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl border border-white dark:border-slate-800 rounded-3xl p-6 shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)] dark:shadow-none overflow-hidden sm:group">
                        {/* Receipt Aesthetic: Decorative cutouts and lines */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-3 bg-slate-100 dark:bg-slate-800 rounded-b-xl" />
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background-light dark:bg-background-dark rounded-full border-r border-slate-100 dark:border-slate-800" />
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background-light dark:bg-background-dark rounded-full border-l border-slate-100 dark:border-slate-800" />

                        <div className="flex flex-col gap-6">
                            {/* Summary Header */}
                            <div className="flex items-center justify-between border-b border-dashed border-slate-100 dark:border-slate-800 pb-5">
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Crunch Count</div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-primary/10 rounded-md flex items-center justify-center text-[10px] font-black text-primary">
                                            {cartSummary.items.reduce((acc, item) => acc + item.quantity, 0)}
                                        </div>
                                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Items Selected</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Total Amount</div>
                                    <div className="text-2xl font-black text-primary tabular-nums tracking-tighter">₹{formatCurrency(cartSummary.total)}</div>
                                </div>
                            </div>

                            {/* Almost There Section - Mobile Optimized */}
                            <div className="space-y-4">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white mb-2 shadow-lg shadow-primary/20">
                                        <CheckCircle2 size={18} strokeWidth={3} />
                                    </div>
                                    <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-1">Almost There!</h4>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Final Crunch Verification</p>
                                </div>

                                <div className="grid grid-cols-3 gap-2 py-4 px-2 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                    <div className="flex flex-col items-center text-center gap-1.5 border-r border-slate-200 dark:border-slate-700">
                                        <Truck size={14} className="text-primary" />
                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Delivery</div>
                                        <div className="text-[9px] font-extrabold text-slate-900 dark:text-white">Within 1 Week</div>
                                    </div>
                                    <div className="flex flex-col items-center text-center gap-1.5 border-r border-slate-200 dark:border-slate-700">
                                        <ShieldCheck size={14} className="text-primary" />
                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Quality</div>
                                        <div className="text-[9px] font-extrabold text-slate-900 dark:text-white">100% Organic</div>
                                    </div>
                                    <div className="flex flex-col items-center text-center gap-1.5">
                                        <Clock size={14} className="text-primary" />
                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Dispatch</div>
                                        <div className="text-[9px] font-extrabold text-slate-900 dark:text-white">24 Hours</div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCompletePurchase}
                                disabled={isProcessing}
                                className="w-full bg-primary text-white py-4.5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/40 active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-50">
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]" />
                                {isProcessing ? 'Processing...' : 'Complete Purchase'}
                                <ShieldCheck size={18} className="group-hover:rotate-12 transition-transform" />
                            </button>

                            <p className="text-[8px] text-center font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                By clicking, you agree to our <br />
                                <Link to="/terms-and-conditions" target="_blank" className="text-primary hover:underline">Terms & Conditions</Link>
                            </p>

                            <p className="text-[7.5px] text-center font-black text-slate-400 uppercase tracking-widest opacity-60">
                                Secure Payment • 100% Authentic Quality
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;

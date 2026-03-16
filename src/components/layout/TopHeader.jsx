import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TicketPercent, Truck } from 'lucide-react';
import { getStoreSettings } from '../../redux/thunk/storeSettingsThunk';

const TopHeader = () => {
    const dispatch = useDispatch();
    const {
        gstPercentage,
        couponCode,
        freeShippingThreshold,
    } = useSelector((state) => state.storeSettings);

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        dispatch(getStoreSettings()).catch(() => { });
    }, [dispatch]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev === 0 ? 1 : 0));
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#0f172a] text-white py-2 px-4 border-b border-white/5 relative overflow-hidden">
            <div className="max-w-7xl mx-auto h-5 relative">
                {/* Desktop View: Static Dual Display */}
                <div className="hidden md:flex items-center justify-center gap-6 md:gap-10 h-full">
                    <div className="flex items-center gap-3 group/item cursor-default">
                        <Truck className="text-primary w-4 h-4" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
                            Free Shipping Over ₹{freeShippingThreshold}
                        </p>
                    </div>
                    <div className="h-4 w-px bg-slate-700"></div>
                    <div className="flex items-center gap-3 group/item cursor-default">
                        <TicketPercent className="text-primary w-4 h-4" />
                        {couponCode ? (
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
                                Use Code: <span className="text-primary">{couponCode}</span>
                            </p>
                        ) : (
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
                                GST {Number(gstPercentage).toFixed(2)}% Applied At Checkout
                            </p>
                        )}
                    </div>
                </div>

                {/* Mobile View: Rotating Display */}
                <div className="md:hidden flex items-center justify-center h-full">
                    <div
                        className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${currentIndex === 0 ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-full opacity-0 scale-95'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Truck className="text-primary w-3.5 h-3.5" />
                            <p className="text-[9px] font-black uppercase tracking-[0.15em] whitespace-nowrap text-center">
                                Free Shipping Over ₹{freeShippingThreshold}
                            </p>
                        </div>
                    </div>

                    <div
                        className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${currentIndex === 1 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-full opacity-0 scale-95'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <TicketPercent className="text-primary w-3.5 h-3.5" />
                            {couponCode ? (
                                <p className="text-[9px] font-black uppercase tracking-[0.15em] whitespace-nowrap text-center">
                                    Use Code: <span className="text-primary">{couponCode}</span>
                                </p>
                            ) : (
                                <p className="text-[9px] font-black uppercase tracking-[0.15em] whitespace-nowrap text-center">
                                    GST {Number(gstPercentage).toFixed(2)}% Applied At Checkout
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none"></div>
        </div>
    );
};

export default TopHeader;

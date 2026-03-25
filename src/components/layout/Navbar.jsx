import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../../redux/slice/themeSlice'
import { openSearch, closeSearch, setSearchQuery } from '../../redux/slice/searchSlice'
import { setLocation } from '../../redux/slice/locationSlice'
import { fetchCart } from '../../redux/thunk/cartThunk'
import { selectCartItemCount } from '../../redux/slice/cartSlice'
import { Search, ShoppingCart, Sun, Moon, User, MapPin, X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import SearchDropdown from './SearchDropdown'
import PincodePopup from '../common/PincodePopup'
import { toast } from 'react-hot-toast'
import { fetchStoreProfile } from '../../redux/thunk/storeProfileThunk'

const Navbar = () => {
    const isDarkMode = useSelector((state) => state.theme.mode === 'dark')
    const { query, isOpen } = useSelector((state) => state.search)
    const { currentLocation } = useSelector((state) => state.location)
    const { user, isAuthenticated } = useSelector((state) => state.auth)
    const cartItemCount = useSelector(selectCartItemCount)
    const { data: profile, loading: profileLoading } = useSelector((state) => state.storeProfile)
    const dispatch = useDispatch()
    const location = useLocation()
    const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
    const searchRef = useRef(null);

    console.log("user", user)

    // Dynamic label for Navbar: Showing city primarily
    const locationLabel = currentLocation.city || currentLocation.pincode || 'Select Area';

    // Helper to fetch city from pincode
    const handleSavePincode = async (newPin) => {
        try {
            const res = await fetch(`https://api.postalpincode.in/pincode/${newPin}`);
            const data = await res.json();
            let cityName = 'Unknown Area';
            if (data && data[0] && data[0].Status === "Success") {
                cityName = data[0].PostOffice[0].District || data[0].PostOffice[0].Division;
            }
            dispatch(setLocation({
                pincode: newPin,
                city: cityName
            }));
            toast.success(`Delivery location updated to ${cityName}!`, {
                style: {
                    borderRadius: '16px',
                    background: '#0f172a',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px'
                },
            });
            setIsPincodeModalOpen(false);
        } catch (error) {
            console.error("Pincode fetch error:", error);
            dispatch(setLocation({ pincode: newPin, city: 'Error fetching' }));
            toast.error("Failed to update location");
            setIsPincodeModalOpen(false);
        }
    };

    // Auto-close search on navigation
    useEffect(() => {
        dispatch(closeSearch());
        dispatch(setSearchQuery(''));
    }, [location.pathname, dispatch]);

    // Fetch cart data when user is logged in
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCart());
        }
    }, [isAuthenticated, dispatch]);

    // Fetch store profile for branding
    useEffect(() => {
        if (!profile && !profileLoading) {
            dispatch(fetchStoreProfile());
        }
    }, [dispatch, profile, profileLoading]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                dispatch(closeSearch());
            }
        };

        const isDesktop = window.innerWidth >= 1024;
        if (isOpen && isDesktop) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, dispatch]);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        dispatch(setSearchQuery(val));
        if (val && !isOpen) dispatch(openSearch());
    };

    const handleSearchFocus = () => {
        dispatch(openSearch());
    };

    const clearSearch = () => {
        dispatch(setSearchQuery(''));
        dispatch(closeSearch());
    };

    return (
        <header
            className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-4 xl:px-12 md:px-8 py-3 transition-all duration-300">
            <div className="flex items-center gap-4 md:gap-12">
                <Link to="/" className="flex items-center gap-3 group">
                    {profile?.logo ? (
                        <img src={profile.logo} alt={profile.store_name} className="h-9 w-auto object-contain transition-transform group-hover:scale-105" />
                    ) : (
                        <>
                            {profile?.logo_first_letter && (
                                <div
                                    className="bg-primary w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                                    {profile.logo_first_letter}
                                </div>
                            )}
                            <div className="flex flex-col">
                                {profile?.store_name_full_html ? (
                                    <h1
                                        className="text-slate-900 text-nowrap dark:text-white text-sm sm:text-lg font-black tracking-tight"
                                        dangerouslySetInnerHTML={{ __html: profile.store_name_full_html }}
                                    />
                                ) : (
                                    <h1 className="text-slate-900 text-nowrap dark:text-white text-sm sm:text-lg font-black tracking-tight">
                                        {profile?.store_name || "Mom's Crunch"}
                                    </h1>
                                )}
                            </div>
                        </>
                    )}
                </Link>

                <nav className="hidden md:flex items-center gap-3 xl:gap-7">
                    <NavLink
                        to="/shop" className={({ isActive }) => {
                            const isShopActive = isActive || window.location.pathname.startsWith('/product/');
                            return `nav-link dark:text-slate-200 text-sm font-bold hover:text-primary transition-colors inline-flex items-center gap-1.5 ${isShopActive ? 'active text-primary' : ''}`;
                        }}>
                        Shop
                        <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                    </NavLink>
                    <NavLink
                        to="/our-story" className={({ isActive }) => `nav-link text-nowrap dark:text-slate-200 text-sm font-bold hover:text-primary transition-colors ${isActive ? 'active text-primary' : ''}`}
                    >Our Story</NavLink>
                    <NavLink
                        to="/contact" className={({ isActive }) => `nav-link dark:text-slate-200 text-sm font-bold hover:text-primary transition-colors ${isActive ? 'active text-primary' : ''}`}
                    >Contact</NavLink>
                </nav>
            </div>

            <div className="flex items-center gap-6">
                <div ref={searchRef} className="hidden md:block ml-2 relative group">
                    <div className={`flex items-center bg-slate-50 dark:bg-slate-900/60 border ${isOpen ? 'border-primary/50 shadow-lg shadow-primary/5' : 'border-slate-200/50 dark:border-slate-700/50'} rounded-[15px] px-4 h-10 min:w-20 max:w-80 transition-all duration-300`}>
                        <Search className={`${isOpen ? 'text-primary' : 'text-slate-400'} w-4 h-4 transition-colors`} />
                        <input
                            type="text"
                            value={query}
                            onChange={handleSearchChange}
                            onFocus={handleSearchFocus}
                            placeholder="Search for snacks..."
                            className="bg-transparent border-none outline-none text-[13px] ml-3 flex-1 w-full text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-bold"
                        />
                        {query && (
                            <button onClick={clearSearch} className="ml-2 text-slate-400 hover:text-primary transition-colors">
                                <X size={14} />
                            </button>
                        )}

                    </div>

                    {/* Desktop Search Dropdown */}
                    <SearchDropdown isOpen={isOpen} query={query} />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {/* Location Selection: Only Pincode in Navbar */}
                    <div className="relative">
                        <button
                            onClick={() => setIsPincodeModalOpen(!isPincodeModalOpen)}
                            className="flex items-center gap-2 px-3 h-10 rounded-xl bg-slate-400/5 hover:bg-primary/10 text-slate-500 dark:text-slate-400 hover:text-primary transition-all duration-300 border border-slate-200/40 dark:border-white/5 active:scale-95 group cursor-pointer"
                        >
                            <MapPin size={16} className="group-hover:animate-bounce" />
                            <div className="flex flex-col text-nowrap gap-0.5 items-start leading-none max-w-[80px] md:max-w-[120px]">
                                <span className="text-[8px] font-black uppercase tracking-wider opacity-60 text-slate-400">Deliver to</span>
                                <span className="text-[10px] text-start font-bold truncate w-full text-slate-800 dark:text-white uppercase">
                                    {locationLabel}
                                </span>
                            </div>
                        </button>

                        <PincodePopup
                            isOpen={isPincodeModalOpen}
                            onClose={() => setIsPincodeModalOpen(false)}
                            onSave={handleSavePincode}
                            currentPincode={currentLocation.pincode}
                        />
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={() => dispatch(toggleTheme())}
                        className="flex items-center cursor-pointer justify-center size-10 rounded-full bg-slate-400/5 hover:bg-primary/10 text-slate-500 dark:text-slate-400 hover:text-primary transition-all duration-300 border border-slate-200/40 dark:border-white/5 active:scale-90 relative group overflow-hidden"
                        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        <div className={`transition-all duration-500 transform ${isDarkMode ? 'translate-y-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                            <Sun size={18} className="text-amber-500" />
                        </div>
                        <div className={`absolute transition-all duration-500 transform ${!isDarkMode ? 'translate-y-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                            <Moon size={18} className="text-primary" />
                        </div>
                    </button>

                    {/* Cart */}
                    <Link
                        to="/profile/cart"
                        className="relative hidden md:flex items-center cursor-pointer justify-center size-10 text-slate-500 dark:text-slate-400 hover:text-primary transition-all duration-300 group"
                    >
                        <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        {cartItemCount > 0 && (
                            <span
                                className="absolute top-1 right-1 bg-primary text-white text-[9px] font-black h-4.5 min-w-[18px] px-1 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 border-2 border-white dark:border-background-dark group-hover:-translate-y-0.5 transition-all duration-300">
                                {cartItemCount > 99 ? '99+' : cartItemCount}
                            </span>
                        )}
                    </Link>

                    {/* Profile User */}
                    <Link
                        to="/profile"
                        className="hidden md:flex items-center cursor-pointer capitalize justify-center size-10 border-2 border-white/40 dark:border-white/5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-all duration-300 shadow-md shadow-slate-900/10 dark:shadow-white/5 active:scale-95 group overflow-hidden font-black text-xs"
                    >
                        {user ? user.first_name.charAt(0) + user.last_name.charAt(0) : <User size={18} />}
                    </Link>

                </div>
            </div>
        </header>
    )
}

export default Navbar

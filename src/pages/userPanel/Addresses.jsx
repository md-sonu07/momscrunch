import React, { useEffect, useState } from 'react';
import { MapPin, Plus, Home, Briefcase, Check, Trash2, Edit3, LogIn, RefreshCw, ChevronLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AddressModal from '../../components/common/AddressModal';
import Skeleton from '../../components/common/Skeleton';
import {
    clearAddressError,
    selectAddressError,
    selectAddressHasLoaded,
    selectAddressLoading,
    selectAddresses,
} from '../../redux/slice/addressSlice';
import {
    addAddress,
    editAddress,
    fetchAddresses,
    makeDefaultAddress,
    removeAddress,
} from '../../redux/thunk/addressThunk';

const addressTypeConfig = {
    home: { label: 'Home', icon: Home },
    work: { label: 'Work', icon: Briefcase },
    other: { label: 'Other', icon: MapPin },
};

const Addresses = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const addresses = useSelector(selectAddresses);
    const loading = useSelector(selectAddressLoading);
    const error = useSelector(selectAddressError);
    const hasLoaded = useSelector(selectAddressHasLoaded);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchAddresses());
        }
    }, [dispatch, isAuthenticated]);

    const handleAddAddress = () => {
        dispatch(clearAddressError());
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    const handleEditAddress = (address) => {
        dispatch(clearAddressError());
        setEditingAddress(address);
        setIsModalOpen(true);
    };

    const handleDeleteAddress = async (id) => {
        try {
            await dispatch(removeAddress(id)).unwrap();
            toast.success('Address removed successfully', {
                style: {
                    borderRadius: '16px',
                    background: '#0f172a',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px'
                },
            });
        } catch (deleteError) {
            toast.error(deleteError || 'Failed to delete address', {
                style: {
                    borderRadius: '16px',
                    background: '#dc2626',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px'
                },
            });
        }
    };

    const handleSaveAddress = async (addressData) => {
        try {
            if (editingAddress) {
                await dispatch(editAddress({ id: editingAddress.id, addressData })).unwrap();
                toast.success('Address updated successfully', {
                    style: {
                        borderRadius: '16px',
                        background: '#0f172a',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '12px'
                    },
                });
            } else {
                await dispatch(addAddress(addressData)).unwrap();
                toast.success('New address saved', {
                    style: {
                        borderRadius: '16px',
                        background: '#0f172a',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '12px'
                    },
                });
            }

            setIsModalOpen(false);
            setEditingAddress(null);
        } catch (saveError) {
            toast.error(saveError || 'Failed to save address', {
                style: {
                    borderRadius: '16px',
                    background: '#dc2626',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px'
                },
            });
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await dispatch(makeDefaultAddress(id)).unwrap();
            toast.success('Default address updated', {
                style: {
                    borderRadius: '16px',
                    background: '#0f172a',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px'
                },
            });
        } catch (defaultError) {
            toast.error(defaultError || 'Failed to update default address', {
                style: {
                    borderRadius: '16px',
                    background: '#dc2626',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px'
                },
            });
        }
    };

    const handleRefresh = () => {
        dispatch(clearAddressError());
        dispatch(fetchAddresses());
    };

    const getTypeMeta = (addressType) => addressTypeConfig[addressType] || addressTypeConfig.other;
    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }

        navigate('/profile');
    };

    if (!isAuthenticated) {
        return (
            <div className="py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-2xl p-12 lg:p-20 shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[50vh] flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900/70 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-800 shadow-inner">
                        <LogIn size={40} className="text-slate-300 dark:text-slate-600" />
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Login to Manage Addresses</h2>
                    <p className="text-slate-400 font-bold text-xs max-w-xs mb-10 leading-relaxed uppercase tracking-[0.2em]">
                        Save multiple delivery addresses and use them during checkout.
                    </p>

                    <Link
                        to="/login"
                        className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                    >
                        <LogIn size={16} />
                        Login Now
                    </Link>
                </div>
            </div>
        );
    }

    if (loading && !hasLoaded) {
        return (
            <div className="py-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <Skeleton variant="text" width="60px" height="16px" className="mb-3" />
                        <Skeleton variant="title" width="220px" height="32px" className="mb-1" />
                        <Skeleton variant="text" width="180px" />
                    </div>
                    <Skeleton variant="rectangular" width="180px" height="48px" className="rounded-xl" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white/70 dark:bg-slate-900/40 border border-white dark:border-slate-800 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
                            <div className="flex justify-between mb-6">
                                <Skeleton variant="rectangular" width="100px" height="32px" className="rounded-xl" />
                                <div className="flex gap-2">
                                    <Skeleton variant="rectangular" width="32px" height="32px" className="rounded-xl" />
                                    <Skeleton variant="rectangular" width="32px" height="32px" className="rounded-xl" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Skeleton variant="title" width="150px" height="20px" />
                                    <Skeleton variant="text" width="120px" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton variant="text" width="100%" />
                                    <Skeleton variant="text" width="60%" />
                                    <Skeleton variant="text" width="80%" className="mt-2" />
                                </div>
                                <Skeleton variant="rectangular" width="100%" height="40px" className="rounded-2xl mt-6" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error && !hasLoaded) {
        return (
            <div className="py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-2xl p-12 lg:p-20 shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[50vh] flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-8 border border-red-100 dark:border-red-800 shadow-inner">
                        <MapPin size={40} className="text-red-300 dark:text-red-500/50" />
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Address Error</h2>
                    <p className="text-slate-400 font-bold text-xs max-w-xs mb-10 leading-relaxed uppercase tracking-[0.2em]">
                        {error}
                    </p>

                    <button
                        onClick={handleRefresh}
                        className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <button
                        onClick={handleGoBack}
                        className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-[0.2em] group mb-3 cursor-pointer"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </button>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                        Saved <span className="text-primary italic">Addresses</span>
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            {addresses.length} {addresses.length === 1 ? 'location' : 'locations'} in your bucket
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleAddAddress}
                    className="group bg-primary text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/20 hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center gap-3 cursor-pointer"
                >
                    <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                    Add New Address
                </button>
            </div>

            {addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {addresses.map((address) => {
                        const typeMeta = getTypeMeta(address.address_type);
                        const TypeIcon = typeMeta.icon;

                        return (
                            <div
                                key={address.id}
                                className={`group relative bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border ${address.is_default ? 'border-primary/40' : 'border-white dark:border-slate-800'} rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300 hover:border-primary/20 hover:-translate-y-1`}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl ${address.is_default ? 'bg-primary text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'} text-[10px] font-black uppercase tracking-widest transition-colors`}>
                                        <TypeIcon size={18} />
                                        {typeMeta.label}
                                    </div>

                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEditAddress(address)}
                                            className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary rounded-xl transition-all cursor-pointer"
                                        >
                                            <Edit3 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAddress(address.id)}
                                            className="p-2 bg-red-50 dark:bg-red-500/10 text-red-400 hover:text-red-500 rounded-xl transition-all cursor-pointer"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">{address.name}</h3>
                                        <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                            <Check size={12} className="text-primary" />
                                            +91 {address.phone}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed uppercase tracking-tight">
                                            {address.street}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 italic">
                                            {address.landmark ? `Ref: ${address.landmark}` : 'No landmark added'}
                                        </p>
                                        <p className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest mt-2">
                                            {address.city}, {address.state} - {address.pin_code}
                                        </p>
                                    </div>
                                </div>

                                {!address.is_default ? (
                                    <button
                                        onClick={() => handleSetDefault(address.id)}
                                        className="mt-6 w-full py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-primary hover:border-primary/20 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer"
                                    >
                                        Set as Delivery Default
                                    </button>
                                ) : (
                                    <div className="mt-6 w-full py-3 flex items-center justify-center gap-2 bg-primary/5 text-primary rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] opacity-60">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                        Current Selection
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-2xl p-12 lg:p-20 shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[50vh] flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-primary/5 rounded-2xl flex items-center justify-center mb-8 border border-primary/10 shadow-inner">
                        <MapPin size={40} className="text-primary/20" />
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">No Saved Addresses</h2>
                    <p className="text-slate-400 font-bold text-xs max-w-xs mb-10 leading-relaxed uppercase tracking-[0.2em]">
                        Your bucket is waiting for a delivery destination.
                    </p>

                    <button
                        onClick={handleAddAddress}
                        className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer"
                    >
                        <Plus size={16} />
                        Add First Address
                    </button>
                </div>
            )}

            {isModalOpen && (
                <AddressModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        dispatch(clearAddressError());
                        setIsModalOpen(false);
                        setEditingAddress(null);
                    }}
                    onSave={handleSaveAddress}
                    initialData={editingAddress}
                />
            )}

            <div className="mt-10 mb-20 flex justify-center md:justify-start">
                <button
                    onClick={handleGoBack}
                    className="inline-flex items-center gap-3 bg-white dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 px-8 py-3.5 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 hover:border-primary/30 hover:text-primary hover:-translate-y-1 active:scale-95 transition-all group cursor-pointer"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default Addresses;

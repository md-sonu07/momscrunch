import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Home, Briefcase, MoreHorizontal, Check, Trash2, Edit3, Navigation2, X, Search } from 'lucide-react';
import AddressModal from '../../components/common/AddressModal';
import { toast } from 'react-hot-toast';

const Addresses = () => {
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            type: 'Home',
            name: 'Danish Farhan',
            phone: '+91 9876543210',
            address: 'Flat 402, Sunshine Residency, Lake View Road',
            landmark: 'Near Central Park',
            city: 'Purnia',
            state: 'Bihar',
            pincode: '854301',
            isDefault: true
        }
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    const handleAddAddress = () => {
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setIsModalOpen(true);
    };

    const handleDeleteAddress = (id) => {
        setAddresses(prev => prev.filter(addr => addr.id !== id));
        toast.success("Address removed successfully", {
            style: {
                borderRadius: '16px',
                background: '#0f172a',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '12px'
            },
        });
    };

    const handleSaveAddress = (newAddress) => {
        if (editingAddress) {
            setAddresses(prev => prev.map(addr => addr.id === editingAddress.id ? { ...newAddress, id: addr.id } : addr));
            toast.success("Address updated successfully", {
                style: {
                    borderRadius: '16px',
                    background: '#0f172a',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px'
                },
            });
        } else {
            setAddresses(prev => [...prev, { ...newAddress, id: Date.now(), isDefault: addresses.length === 0 }]);
            toast.success("New address saved", {
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
    };

    const handleSetDefault = (id) => {
        setAddresses(prev => prev.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        })));
        toast.success("Default address updated", {
            style: {
                borderRadius: '16px',
                background: '#0f172a',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '12px'
            },
        });
    };

    const getIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'home': return <Home size={18} />;
            case 'work':
            case 'office': return <Briefcase size={18} />;
            default: return <MapPin size={18} />;
        }
    };

    return (
        <div className="py-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
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

            {/* Address Grid */}
            {addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {addresses.map((addr) => (
                        <div
                            key={addr.id}
                            className={`group relative bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border ${addr.isDefault ? 'border-primary/40' : 'border-white dark:border-slate-800'} rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300 hover:border-primary/20 hover:-translate-y-1`}
                        >
                            {/* Type Label */}
                            <div className="flex items-center justify-between mb-6">
                                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl ${addr.isDefault ? 'bg-primary text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'} text-[10px] font-black uppercase tracking-widest transition-colors`}>
                                    {getIcon(addr.type)}
                                    {addr.type}
                                </div>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEditAddress(addr)}
                                        className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary rounded-xl transition-all"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAddress(addr.id)}
                                        className="p-2 bg-red-50 dark:bg-red-500/10 text-red-400 hover:text-red-500 rounded-xl transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">{addr.name}</h3>
                                    <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                        <Check size={12} className="text-primary" />
                                        {addr.phone}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed uppercase tracking-tight">
                                        {addr.address}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400 italic">
                                        {addr.landmark ? `Ref: ${addr.landmark}` : ''}
                                    </p>
                                    <p className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest mt-2">
                                        {addr.city}, {addr.state} - {addr.pincode}
                                    </p>
                                </div>
                            </div>

                            {/* Set Default Toggle */}
                            {!addr.isDefault && (
                                <button
                                    onClick={() => handleSetDefault(addr.id)}
                                    className="mt-6 w-full py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-primary hover:border-primary/20 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer"
                                >
                                    Set as Delivery Default
                                </button>
                            )}

                            {addr.isDefault && (
                                <div className="mt-6 w-full py-3 flex items-center justify-center gap-2 bg-primary/5 text-primary rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] opacity-60">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                    Current Selection
                                </div>
                            )}
                        </div>
                    ))}
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

            {/* Modal */}
            {isModalOpen && (
                <AddressModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveAddress}
                    initialData={editingAddress}
                />
            )}
        </div>
    );
};

export default Addresses;

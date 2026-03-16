import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoreProfile } from '../../redux/thunk/storeProfileThunk';
import { submitContactMessage } from '../../redux/thunk/contactThunk';
import { resetContactState } from '../../redux/slice/contactSlice';
import { toast } from 'react-hot-toast';
import Skeleton from '../../components/common/Skeleton';

const fallbackMapUrl = 'https://www.google.com/maps?q=Line+Bazar,+Purnia,+Bihar&output=embed';

const Contact = () => {
    const dispatch = useDispatch();
    const { data: profile, loading, error } = useSelector((state) => state.storeProfile);
    // ... existing state ...

    if (loading && !profile) {
        return (
            <div className="min-h-screen bg-white dark:bg-background-dark pt-10 pb-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="mb-12">
                        <Skeleton variant="text" width="100px" className="mb-3" />
                        <Skeleton variant="title" width="40%" height="48px" className="mb-4" />
                        <Skeleton variant="text" width="60%" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} variant="rectangular" height="80px" className="rounded-xl" />
                                ))}
                            </div>
                            <Skeleton variant="rectangular" height="224px" className="rounded-2xl" />
                        </div>
                        <Skeleton variant="rectangular" height="500px" className="rounded-3xl" />
                    </div>
                </div>
            </div>
        );
    }

    const contactState = useSelector((state) => state.contact);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (!profile && !loading) {
            dispatch(fetchStoreProfile());
        }
    }, [dispatch, profile, loading]);

    useEffect(() => {
        if (contactState.success) {
            toast.success(contactState.response?.message || 'Message sent successfully.');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
            });
            setFormErrors({});
            dispatch(resetContactState());
        }
    }, [contactState.success, contactState.response, dispatch]);

    const info = [
        { id: 1, icon: Mail, title: 'Email', value: profile?.email || 'hello@momscrunch.com' },
        { id: 2, icon: Phone, title: 'Call', value: profile?.phone || '+91 98765 43210' },
        { id: 3, icon: MapPin, title: 'Visit', value: profile?.address || 'Add your store address in admin' },
        { id: 4, icon: Clock, title: 'Hours', value: profile?.opening_hours || 'Add opening hours in admin' },
    ];

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const nextErrors = {};
        if (!formData.name.trim()) nextErrors.name = 'Name is required.';
        if (!formData.email.trim()) nextErrors.email = 'Email is required.';
        if (!formData.subject.trim()) nextErrors.subject = 'Subject is required.';
        if (!formData.message.trim()) nextErrors.message = 'Message is required.';

        if (Object.keys(nextErrors).length > 0) {
            setFormErrors(nextErrors);
            return;
        }

        const action = await dispatch(submitContactMessage({
            name: formData.name.trim(),
            email: formData.email.trim(),
            subject: formData.subject.trim(),
            message: formData.message.trim(),
        }));

        if (submitContactMessage.rejected.match(action)) {
            const payload = action.payload;
            if (payload && typeof payload === 'object') {
                setFormErrors({
                    name: payload.name?.[0] || '',
                    email: payload.email?.[0] || '',
                    subject: payload.subject?.[0] || '',
                    message: payload.message?.[0] || '',
                });
            }
            toast.error(payload?.message || payload?.detail || 'Failed to send your message.');
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-background-dark text-slate-800 dark:text-slate-200 selection:bg-primary pt-10 pb-16">
            <div className="max-w-6xl mx-auto px-6 ">
                {/* Unified Styled Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-3 text-primary">
                        <div className="h-[1.5px] w-8 bg-primary shadow-[0_0_8px_rgba(236,109,19,0.3)]"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Get in Touch</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-4">
                        Contact <span className="text-primary italic">Us</span>
                    </h1>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 font-bold max-w-lg">
                        {profile?.tagline || "Have a question? We're here to help you with your crunch journey."}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left: Compact Info & Map */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            {info.map((item) => (
                                <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-xl transition-all hover:border-primary/20 group">
                                    <item.icon size={16} className="text-primary mb-2 group-hover:scale-110 transition-transform" />
                                    <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{item.title}</h3>
                                    <p className="text-[12px] font-bold text-slate-900 dark:text-white break-words">{item.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Smaller Map */}
                        {profile?.map_embed_url ? (
                            <div className="relative rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 h-56 grayscale dark:invert-[0.9] dark:hue-rotate-180 hover:grayscale-0 transition-all duration-500 shadow-sm">
                                <iframe
                                    src={profile.map_embed_url}
                                    className="w-full h-full border-0"
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Location"
                                ></iframe>
                            </div>
                        ) : (
                            <div className="relative rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 h-56 grayscale dark:invert-[0.9] dark:hue-rotate-180 hover:grayscale-0 transition-all duration-500 shadow-sm">
                                <iframe
                                    src={fallbackMapUrl}
                                    className="w-full h-full border-0"
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Purnia Line Bazar Location"
                                ></iframe>
                            </div>
                        )}
                    </div>

                    {/* Right: Refined Form */}
                    <div className="bg-white h-full dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-7 shadow-sm">
                        {error && (
                            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-bold text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                                Unable to load the latest store profile. Showing fallback contact details.
                            </div>
                        )}
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Full Name"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-[12px] font-bold outline-none ring-1 ring-transparent focus:ring-primary/20 transition-all"
                                    />
                                    {formErrors.name && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.name}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-[12px] font-bold outline-none ring-1 ring-transparent focus:ring-primary/20 transition-all"
                                    />
                                    {formErrors.email && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.email}</p>}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="How can we help?"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-[12px] font-bold outline-none ring-1 ring-transparent focus:ring-primary/20 transition-all"
                                />
                                {formErrors.subject && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.subject}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
                                <textarea
                                    rows="6"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Your message..."
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-[12px] font-bold outline-none ring-1 ring-transparent focus:ring-primary/20 transition-all resize-none"
                                ></textarea>
                                {formErrors.message && <p className="text-[11px] font-bold text-red-500 ml-1">{formErrors.message}</p>}
                            </div>
                            <button
                                type="submit"
                                disabled={contactState.loading}
                                className="w-full bg-primary disabled:opacity-70 text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {contactState.loading ? 'Sending...' : 'Send Message'} <Send size={14} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

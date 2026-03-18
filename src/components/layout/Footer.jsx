import React, { useEffect } from 'react';
import { Facebook, MessageCircleMore, Instagram, Mail, MapPin, ArrowRight, Youtube, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoreProfile } from '../../redux/thunk/storeProfileThunk';

const Footer = () => {
    const dispatch = useDispatch();
    const { data: profile, loading } = useSelector((state) => state.storeProfile);

    useEffect(() => {
        if (!profile && !loading) {
            dispatch(fetchStoreProfile());
        }
    }, [dispatch, profile, loading]);

    const storeName = profile?.store_name || "Mom's Crunch";
    const storeDescription = profile?.description || 'Artisanal snacks curated for the discerning snacker. Handcrafted with love.';
    const whatsappLink = profile?.whatsapp_number ? `https://wa.me/${profile.whatsapp_number}` : null;
    const socialLinks = [
        { Icon: Facebook, href: profile?.facebook_url, label: 'Facebook' },
        { Icon: MessageCircleMore, href: whatsappLink, label: 'WhatsApp' },
        { Icon: Instagram, href: profile?.instagram_url, label: 'Instagram' },
        { Icon: Youtube, href: profile?.youtube_url, label: 'YouTube' },
        { Icon: Linkedin, href: profile?.linkedin_url, label: 'LinkedIn' },
    ].filter((item) => item.href);

    return (
        <footer className="bg-white dark:bg-[#0f172a] border-t border-slate-100 dark:border-slate-800/60 pt-20 sm:pb-10 transition-colors duration-300 pb-30">
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <div className="grid grid-cols-2 lg:grid-cols-12 gap-y-12 gap-x-8 mb-16 px-4 sm:px-0">

                    {/* Brand Section */}
                    <div className="col-span-2 lg:col-span-3 space-y-8">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            {profile?.logo ? (
                                <img
                                    src={profile.logo}
                                    alt={storeName}
                                    className="w-11 h-11 rounded-lg object-contain shadow-lg shadow-primary/20 transition-transform group-hover:scale-110"
                                />
                            ) : (
                                <>
                                    {profile?.logo_first_letter && (
                                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                                            <span className="font-black text-xl leading-none">{profile.logo_first_letter}</span>
                                        </div>
                                    )}
                                    <div>
                                        {profile?.store_name_full_html ? (
                                            <h2
                                                className="text-2xl font-black tracking-tight text-slate-900 dark:text-white"
                                                dangerouslySetInnerHTML={{ __html: profile.store_name_full_html }}
                                            />
                                        ) : (
                                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                                {storeName}
                                            </h2>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs font-semibold opacity-80">
                            {storeDescription}
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.length > 0 ? socialLinks.map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"
                                >
                                    <Icon size={18} />
                                </a>
                            )) : (
                                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                                    Social links will appear here
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1 lg:col-span-2 space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white pb-2 border-b border-primary/20 w-fit">Explore</h4>
                        <ul className="space-y-4">
                            {[
                                { label: 'Home', path: '/' },
                                { label: 'Shop', path: '/shop' },
                                { label: 'Our Story', path: '/our-story' },
                                { label: 'Contact', path: '/contact' }
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link to={link.path} className="text-[13px] font-bold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center group">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all -ml-3.5 group-hover:ml-0 overflow-hidden"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account Links */}
                    <div className="col-span-1 lg:col-span-2 space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white pb-2 border-b border-primary/20 w-fit">Account</h4>
                        <ul className="space-y-4">
                            {[
                                { label: 'My Orders', path: '/profile/orders' },
                                { label: 'Wishlist', path: '/profile/wishlist' },
                                { label: 'Addresses', path: '/profile/addresses' },
                                { label: 'Cart', path: '/profile/cart' }
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link to={link.path} className="text-[13px] font-bold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center group">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all -ml-3.5 group-hover:ml-0 overflow-hidden"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="col-span-2 sm:col-span-1 lg:col-span-2 space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white pb-2 border-b border-primary/20 w-fit">Support</h4>
                        <ul className="space-y-4">
                            <li key="Shipping Policy">
                                <a href="#" className="text-[13px] font-bold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center group">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all -ml-3.5 group-hover:ml-0 overflow-hidden"></span>
                                    Shipping Policy
                                </a>
                            </li>
                            <li key="Terms of Service">
                                <Link to="/terms-and-conditions" className="text-[13px] font-bold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center group">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all -ml-3.5 group-hover:ml-0 overflow-hidden"></span>
                                    Terms of Service
                                </Link>
                            </li>
                            <li key="Privacy Policy">
                                <a href="#" className="text-[13px] font-bold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center group">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all -ml-3.5 group-hover:ml-0 overflow-hidden"></span>
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter & App Section */}
                    <div className="col-span-2 lg:col-span-3 space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Store Contact</h4>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 font-bold mb-4">
                            Footer details are now synced from the admin store profile.
                        </p>

                        <div className="space-y-3">
                            {profile?.email ? (
                                <a
                                    href={`mailto:${profile.email}`}
                                    className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 px-4 py-4 text-slate-700 dark:text-slate-200"
                                >
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Email</p>
                                        <p className="mt-1 text-xs font-bold">{profile.email}</p>
                                    </div>
                                    <ArrowRight size={16} className="text-primary" />
                                </a>
                            ) : (
                                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 px-4 py-4 text-slate-700 dark:text-slate-200">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Email</p>
                                    <p className="mt-1 text-xs font-bold">No email added yet</p>
                                </div>
                            )}
                            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 px-4 py-4 text-slate-700 dark:text-slate-200">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Opening Hours</p>
                                <p className="mt-1 text-xs font-bold">{profile?.opening_hours || 'Add opening hours in admin'}</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col-reverse md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        © {new Date().getFullYear()} <span className="text-primary">{storeName}</span>. Handcrafted for Taste.
                    </p>
                    <div className="flex flex-col md:flex-row items-center md:gap-8 gap-2">
                        <div className="flex items-center gap-2 text-slate-400 group cursor-pointer">
                            <Mail size={14} className="group-hover:text-primary transition-colors" />
                            <span className="text-[10px] font-black tracking-[0.2em] group-hover:text-slate-600 dark:group-hover:text-white transition-colors">
                                {profile?.email || 'hello@momscrunch.com'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 group cursor-pointer">
                            <MapPin size={14} className="group-hover:text-primary transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-slate-600 dark:group-hover:text-white transition-colors">
                                {profile?.address || 'Add store address in admin'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

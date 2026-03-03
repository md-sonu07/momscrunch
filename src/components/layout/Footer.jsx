import React from 'react';
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone, Github, ArrowRight, Play, Apple } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-[#0f172a] border-t border-slate-100 dark:border-slate-800/60 pt-20 pb-10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

                    {/* Brand Section */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                                <span className="font-black text-xl leading-none">M</span>
                            </div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Mom's<span className="text-primary italic"> Crunch</span>
                            </h2>
                        </div>
                        <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs font-bold uppercase tracking-wide opacity-80">
                            Artisanal snacks curated for the discerning snacker. Handcrafted with love.
                        </p>
                        <div className="flex gap-3">
                            {[Facebook, Twitter, Instagram, Github].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all transform hover:-translate-y-1 shadow-sm">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2 space-y-6">
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
                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white pb-2 border-b border-primary/20 w-fit">Account</h4>
                        <ul className="space-y-4">
                            {[
                                { label: 'My Profile', path: '/profile' },
                                { label: 'My Orders', path: '/profile/orders' },
                                { label: 'Wishlist', path: '/profile/wishlist' },
                                { label: 'Addresses', path: '/profile/addresses' },
                                { label: 'Shopping Bag', path: '/profile/cart' }
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
                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white pb-2 border-b border-primary/20 w-fit">Support</h4>
                        <ul className="space-y-4">
                            {['Order Tracking', 'Shipping Policy', 'Terms of Service', 'Privacy Policy'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-[13px] font-bold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center group">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-all -ml-3.5 group-hover:ml-0 overflow-hidden"></span>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter & App Section */}
                    <div className="lg:col-span-3 space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Newsletter</h4>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 font-bold mb-4">Subscribe for exclusive offers and crunch updates.</p>

                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl pl-5 pr-12 py-4 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-primary transition-all shadow-sm group-hover:border-primary/40"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                <ArrowRight size={18} />
                            </button>
                        </div>

                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        © 2024 <span className="text-primary">MomsCrunch Elite</span>. Handcrafted for Taste.
                    </p>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 text-slate-400 group cursor-pointer">
                            <Mail size={14} className="group-hover:text-primary transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-slate-600 dark:group-hover:text-white transition-colors">hello@momscrunch.com</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 group cursor-pointer">
                            <MapPin size={14} className="group-hover:text-primary transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-slate-600 dark:group-hover:text-white transition-colors">Rajasthan, India</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;


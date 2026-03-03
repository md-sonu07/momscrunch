import React from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const contactData = {
    header: {
        tag: "Get in Touch",
        title: "Contact Us",
        highlight: "Us",
        subtitle: "Have a question? We're here to help you with your crunch journey."
    },
    info: [
        { id: 1, icon: Mail, title: "Email", value: "hello@momscrunch.com" },
        { id: 2, icon: Phone, title: "Call", value: "+91 98765 43210" },
        { id: 3, icon: MapPin, title: "Visit", value: "Jaipur, Rajasthan" },
        { id: 4, icon: Clock, title: "Hours", value: "10AM - 6PM" }
    ],
    map: {
        url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14234.351287661075!2d75.76864197419438!3d26.884177264859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db4487baf5f31%3A0x6b4be934c9c6464!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1709213456789!5m2!1sen!2sin"
    },
    form: {
        labels: {
            name: "Name",
            email: "Email",
            subject: "Subject",
            message: "Message"
        },
        placeholders: {
            name: "Full Name",
            email: "Email",
            subject: "How can we help?",
            message: "Your message..."
        },
        buttonText: "Send Message"
    }
};

const Contact = () => {
    const { header, info, map, form } = contactData;

    return (
        <div className="min-h-screen bg-white dark:bg-background-dark text-slate-800 dark:text-slate-200 selection:bg-primary pt-10 pb-16">
            <div className="max-w-6xl mx-auto px-6 ">
                {/* Unified Styled Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-3 text-primary">
                        <div className="h-[1.5px] w-8 bg-primary shadow-[0_0_8px_rgba(236,109,19,0.3)]"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{header.tag}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-4">
                        {header.title.split(header.highlight)[0]}
                        <span className="text-primary italic">{header.highlight}</span>
                        {header.title.split(header.highlight)[1]}
                    </h1>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 font-bold max-w-lg">
                        {header.subtitle}
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
                                    <p className="text-[12px] font-bold text-slate-900 dark:text-white truncate">{item.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Smaller Map */}
                        <div className="relative rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 h-56 grayscale dark:invert-[0.9] dark:hue-rotate-180 hover:grayscale-0 transition-all duration-500 shadow-sm">
                            <iframe
                                src={map.url}
                                className="w-full h-full border-0"
                                allowFullScreen="" loading="lazy" title="Location"
                            ></iframe>
                        </div>
                    </div>

                    {/* Right: Refined Form */}
                    <div className="bg-white h-full dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-7 shadow-sm">
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">{form.labels.name}</label>
                                    <input type="text" placeholder={form.placeholders.name} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-[12px] font-bold outline-none ring-1 ring-transparent focus:ring-primary/20 transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">{form.labels.email}</label>
                                    <input type="email" placeholder={form.placeholders.email} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-[12px] font-bold outline-none ring-1 ring-transparent focus:ring-primary/20 transition-all" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">{form.labels.subject}</label>
                                <input type="text" placeholder={form.placeholders.subject} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-[12px] font-bold outline-none ring-1 ring-transparent focus:ring-primary/20 transition-all" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">{form.labels.message}</label>
                                <textarea rows="6" placeholder={form.placeholders.message} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-[12px] font-bold outline-none ring-1 ring-transparent focus:ring-primary/20 transition-all resize-none"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-primary text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
                                {form.buttonText} <Send size={14} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

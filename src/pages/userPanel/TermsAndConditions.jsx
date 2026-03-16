import React from 'react';
import { Shield, Lock, Info, Scale, Clock } from 'lucide-react';

const TermsAndConditions = () => {
    const sections = [
        {
            icon: <Info size={20} />,
            title: "Introduction",
            content: "Welcome to MomsCrunch. These terms and conditions outline the rules and regulations for the use of our Website. By accessing this website we assume you accept these terms and conditions. Do not continue to use MomsCrunch if you do not agree to take all of the terms and conditions stated on this page."
        },
        {
            icon: <Shield size={20} />,
            title: "Intellectual Property Rights",
            content: "Other than the content you own, under these Terms, MomsCrunch and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website."
        },
        {
            icon: <Lock size={20} />,
            title: "Your Account",
            content: "If you use this site, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password."
        },
        {
            icon: <Scale size={20} />,
            title: "Refund Policy",
            content: "We focus on complete customer satisfaction. In the event, if you are displeased with the services provided, we will refund back the money, provided the reasons are genuine and proved after investigation. Please read the fine prints of each deal before buying it, it provides all the details about the services or the product you purchase."
        },
        {
            icon: <Clock size={20} />,
            title: "Modifications",
            content: "MomsCrunch reserves the right to revise these terms and conditions at any time. By using this website you are expected to review these terms and conditions on a regular basis."
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 text-primary mb-6">
                    <Shield size={32} />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4 uppercase">
                    Terms & <span className="text-primary">Conditions</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide flex items-center justify-center gap-2">
                    <Clock size={16} /> Last Updated: March 16, 2026
                </p>
            </div>

            <div className="space-y-8">
                {sections.map((section, index) => (
                    <div
                        key={index}
                        className="p-8 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 hover:border-primary/20 transition-all group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform">
                                {section.icon}
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                {section.title}
                            </h2>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            {section.content}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-16 p-8 rounded-3xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-center">
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Questions about our terms?</h3>
                <p className="text-slate-400 dark:text-slate-500 font-medium mb-8">
                    If you have any questions regarding these terms, please contact our legal team at contact@momscrunch.com
                </p>
                <a
                    href="/contact"
                    className="inline-flex items-center gap-2 font-black text-xs uppercase tracking-[0.2em] bg-primary px-8 py-4 rounded-xl hover:scale-105 active:scale-95 transition-all text-white"
                >
                    Contact Support
                </a>
            </div>
        </div>
    );
};

export default TermsAndConditions;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { forgotPassword, resetPassword } from '../../redux/thunk/authThunk';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // States: 'email', 'otp', 'reset'
    const [step, setStep] = useState('email');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const resultAction = await dispatch(forgotPassword(formData.email));
            if (forgotPassword.fulfilled.match(resultAction)) {
                toast.success("OTP sent to your email!");
                setStep('otp');
            } else {
                toast.error(resultAction.payload || "Failed to send OTP");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (formData.otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }
        setStep('reset');
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const resultAction = await dispatch(resetPassword({
                email: formData.email,
                otp: formData.otp,
                new_password: formData.newPassword
            }));

            if (resetPassword.fulfilled.match(resultAction)) {
                toast.success("Password reset successful! Please login.");
                navigate('/login');
            } else {
                toast.error(resultAction.payload || "Reset failed");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center sm:p-6 p-2 relative overflow-hidden selection:bg-primary selection:text-white pt-10 pb-34">
            {/* Background Decorative Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-3xl blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-3xl blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-[440px] z-10">
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                        {step === 'email' ? 'Forgot Password?' : step === 'otp' ? 'Verify OTP' : 'Reset Password'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
                        {step === 'email' ? 'Enter email to receive reset code' : step === 'otp' ? 'Enter the 6-digit code' : 'Choose a strong new password'}
                    </p>
                </div>

                <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-2xl p-8 md:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none">

                    {step === 'email' && (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="your@email.com"
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-xl pl-12 pr-6 py-4 text-sm font-bold outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-white"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-70"
                            >
                                {loading ? "Sending..." : "Send Reset Code"}
                            </button>
                        </form>
                    )}

                    {step === 'otp' && (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="space-y-2 text-center">
                                <p className="text-xs font-bold text-slate-500 mb-4">Code sent to: <span className="text-primary">{formData.email}</span></p>
                                <div className="flex justify-center gap-2">
                                    <input
                                        type="text"
                                        maxLength="6"
                                        required
                                        value={formData.otp}
                                        onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })}
                                        placeholder="000000"
                                        className="w-full max-w-[200px] text-center bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-xl py-4 text-2xl font-black tracking-[0.5em] outline-none transition-all placeholder:text-slate-200 dark:placeholder:text-slate-600 dark:text-primary"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
                            >
                                Verify Code
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep('email')}
                                className="w-full text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={12} /> Change Email
                            </button>
                        </form>
                    )}

                    {step === 'reset' && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-xl pl-12 pr-12 py-4 text-sm font-bold outline-none transition-all dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-xl pl-12 pr-12 py-4 text-sm font-bold outline-none transition-all dark:text-white"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-70"
                            >
                                {loading ? "Updating..." : "Update Password"}
                                <CheckCircle2 size={16} />
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center">
                        <Link to="/login" className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors flex items-center justify-center gap-2">
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

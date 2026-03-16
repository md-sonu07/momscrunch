import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Eye, EyeOff, ArrowRight, Github, Chrome, ShieldCheck, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, signup } from '../../redux/thunk/authThunk';
import { clearError } from '../../redux/slice/authSlice';

const Signup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth || {});

    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    useEffect(() => {
        dispatch(clearError());
        if (isAuthenticated) navigate(from, { replace: true });
    }, [dispatch, isAuthenticated, navigate, from]);

    const [showPassword, setShowPassword] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile_no: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.fullName || !formData.mobile_no || !formData.password) {
            toast.error("Please fill in all fields first");
            return;
        }

        try {
            const registrationData = {
                name: formData.fullName,
                email: formData.email,
                mobile_no: formData.mobile_no,
                password: formData.password
            };
            const resultAction = await dispatch(sendOtp(registrationData));
            if (sendOtp.fulfilled.match(resultAction)) {
                setIsOtpSent(true);
                setSessionId(resultAction.payload.session_id);
                toast.success("OTP sent to your email!");
            } else {
                toast.error(resultAction.payload || "Failed to send OTP");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        if (!isOtpSent) {
            toast.error("Please verify your email first!");
            return;
        }

        if (!otp) {
            toast.error("Please enter the OTP");
            return;
        }

        try {
            // Verify and register in one step
            const signupAction = await dispatch(signup({
                session_id: sessionId,
                otp: otp,
                username: formData.email,
                first_name: formData.fullName,
                password: formData.password
            }));

            if (signup.fulfilled.match(signupAction)) {
                toast.success("Account created successfully!");
                navigate(from, { replace: true });
            } else {
                toast.error(signupAction.payload || "Signup failed");
            }
        } catch (error) {
            toast.error("An error occurred during verification.");
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center sm:p-6 p-2 relative overflow-hidden selection:bg-primary selection:text-white pt-10 pb-34">
            {/* Background Decorative Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-primary/10 rounded-3xl blur-[140px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-orange-500/10 rounded-3xl blur-[140px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-[480px] z-10 transition-all duration-500">
                {/* Logo & Header */}
                <div className="text-center mb-8">

                    <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Create Account</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Join the elite crunch movement</p>
                </div>

                {/* Signup Card */}
                <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-2xl p-8 md:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    disabled={isOtpSent}
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder="Jane Doe"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-xl pl-12 pr-6 py-4 text-sm font-bold outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-white disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* Mobile Number Field */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mobile Number</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Phone size={18} />
                                </div>
                                <input
                                    type="tel"
                                    required
                                    disabled={isOtpSent}
                                    value={formData.mobile_no}
                                    onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
                                    placeholder="9876543210"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-xl pl-12 pr-6 py-4 text-sm font-bold outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-white disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    disabled={isOtpSent}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="jane@example.com"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-xl pl-12 pr-6 py-4 text-sm font-bold outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-white disabled:opacity-50"
                                />
                                {!isOtpSent && (
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-primary hover:text-white transition-all"
                                    >
                                        Send OTP
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* OTP Field (Conditionally shown) */}
                        {isOtpSent && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-500">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Verification Code</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter 6-digit OTP"
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-xl pl-12 pr-6 py-4 text-sm font-bold outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsOtpSent(false)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors text-[10px] font-bold uppercase"
                                    >
                                        Change Email
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Password Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        disabled={isOtpSent && false} // Keep enabled unless we want to lock it after OTP
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-xl px-5 py-4 text-sm font-bold outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm</label>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-xl px-5 py-4 text-sm font-bold outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <label className="flex items-center gap-3 cursor-pointer group w-fit">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    required
                                    checked={formData.acceptTerms}
                                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                                    className="peer sr-only"
                                />
                                <div className="w-5 h-5 border-2 border-slate-200 dark:border-slate-700 rounded-md group-hover:border-primary transition-all peer-checked:bg-primary peer-checked:border-primary"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-white scale-0 peer-checked:scale-100 transition-transform">
                                    <svg size="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 select-none uppercase tracking-widest leading-none pt-0.5">I agree to the <Link to="/terms-and-conditions" target="_blank" className="text-primary hover:underline">Terms & Conditions</Link></span>
                        </label>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group cursor-pointer mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? "Processing..." : isOtpSent ? "Verify & Create Account" : "Create Account"}
                            {isOtpSent ? <ShieldCheck size={16} className="group-hover:scale-110 transition-transform" /> : <UserPlus size={16} className="group-hover:scale-110 transition-transform" />}
                        </button>
                    </form>

                    {/* Footer Link */}
                    <p className="text-center mt-8 text-sm font-bold text-slate-500 dark:text-slate-400">
                        Already have an account? {' '}
                        <Link to="/login" className="text-primary hover:underline underline-offset-4 decoration-2">Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;

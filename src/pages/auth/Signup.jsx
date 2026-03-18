import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Eye, EyeOff, ArrowRight, Github, Chrome, ShieldCheck, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, signup, verifyOtp } from '../../redux/thunk/authThunk';
import { clearError } from '../../redux/slice/authSlice';

const Signup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, isAuthenticated, user } = useSelector((state) => state.auth);
    const from = location.state?.from?.pathname || "/";
    const fromProfile = location.state?.fromProfile;

    useEffect(() => {
        if (isAuthenticated && user?.is_email_verified) {
            navigate(from, { replace: true });
        } else if (isAuthenticated && !user?.is_email_verified && fromProfile) {
            setIsRegistered(true);
            setFormData(prev => ({ ...prev, email: user.email }));
            // Trigger initial OTP resend for profile users
            dispatch(sendOtp());
        }
    }, [dispatch, isAuthenticated, user, navigate, from, fromProfile]);

    const [showPassword, setShowPassword] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile_no: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });

    const handleSignup = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const signupAction = await dispatch(signup({
                name: formData.fullName,
                email: formData.email,
                mobile_no: formData.mobile_no,
                password: formData.password
            }));

            if (signup.fulfilled.match(signupAction)) {
                setIsRegistered(true);
                toast.success("Account created! Please verify your email.");
                // Automatically send the first OTP
                dispatch(sendOtp());
            } else {
                toast.error(signupAction.payload || "Signup failed");
            }
        } catch (error) {
            toast.error("An error occurred during signup.");
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) {
            toast.error("Please enter the OTP");
            return;
        }

        try {
            const verifyAction = await dispatch(verifyOtp({ otp }));
            if (verifyOtp.fulfilled.match(verifyAction)) {
                toast.success("Email verified successfully!");
                navigate(from, { replace: true });
            } else {
                toast.error(verifyAction.payload || "Verification failed");
            }
        } catch (error) {
            toast.error("An error occurred during verification.");
        }
    };

    const handleResendOtp = () => {
        dispatch(sendOtp())
            .unwrap()
            .then(() => toast.success("OTP resent to your email!"))
            .catch((err) => toast.error(err || "Failed to resend OTP"));
    };

    const handleSkip = () => {
        toast.success("Welcome! You can verify your email later from your profile.");
        navigate(from, { replace: true });
    };

    if (isRegistered) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center sm:p-6 p-2 relative overflow-hidden pt-10 pb-34 text-slate-900 dark:text-white">
                <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-primary/10 rounded-3xl blur-[140px] -z-10 animate-pulse"></div>
                <div className="w-full max-w-[480px] z-10 transition-all duration-500">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-black mb-2 tracking-tight">Verify Email</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Check your inbox for the code</p>
                    </div>

                    <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-2xl p-8 md:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none space-y-6">
                        <div className="text-center space-y-2">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">We've sent a verification code to:</p>
                            <p className="text-base font-black text-primary">{formData.email}</p>
                        </div>

                        <div className="space-y-2">
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
                                    placeholder="Enter 6-digit code"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-xl pl-12 pr-6 py-4 text-sm font-bold outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={handleVerifyOtp}
                                disabled={loading}
                                className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                            >
                                {loading ? "Verifying..." : "Verify & Continue"}
                                <ArrowRight size={16} />
                            </button>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleResendOtp}
                                    disabled={loading}
                                    className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                                >
                                    Resend Code
                                </button>
                                <button
                                    onClick={handleSkip}
                                    className="flex-1 bg-transparent border border-slate-200 dark:border-slate-700 text-slate-400 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                >
                                    Skip for Now
                                </button>
                            </div>
                        </div>

                        <p className="text-center text-xs font-bold text-slate-400">
                            Wrong email? <button onClick={() => setIsRegistered(false)} className="text-primary hover:underline">Go back</button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center sm:p-6 p-2 relative overflow-hidden selection:bg-primary selection:text-white pt-10 pb-34 text-slate-900 dark:text-white">
            {/* Background Decorative Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-primary/10 rounded-3xl blur-[140px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-orange-500/10 rounded-3xl blur-[140px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-[480px] z-10 transition-all duration-500">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-black mb-2 tracking-tight">Create Account</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Join the elite crunch movement</p>
                </div>

                {/* Signup Card */}
                <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-2xl p-8 md:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                    <form onSubmit={handleSignup} className="space-y-5">
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
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder="Jane Doe"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-xl pl-12 pr-6 py-4 text-sm font-bold outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-white"
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
                                    value={formData.mobile_no}
                                    onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
                                    placeholder="9876543210"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-xl pl-12 pr-6 py-4 text-sm font-bold outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-white"
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
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="jane@example.com"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-xl pl-12 pr-6 py-4 text-sm font-bold outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Password Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
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
                            {loading ? "Processing..." : "Create Account"}
                            <UserPlus size={16} className="group-hover:scale-110 transition-transform" />
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

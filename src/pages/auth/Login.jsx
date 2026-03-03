import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Github, Chrome } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/thunk/authThunk';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const resultAction = await dispatch(login({
                email: formData.email,
                password: formData.password
            }));

            if (login.fulfilled.match(resultAction)) {
                toast.success("Welcome back! Signing you in...", {
                    style: {
                        borderRadius: '16px',
                        background: '#0f172a',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '12px'
                    },
                });
                navigate('/');
            } else {
                toast.error(resultAction.payload || "Login failed");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-6 relative overflow-hidden selection:bg-primary selection:text-white pt-20">
            {/* Background Decorative Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-3xl blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-3xl blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-[440px] z-10">
                {/* Logo & Header */}
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Enter your details to sign in</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-2xl p-8 md:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                    placeholder="your@email.com"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-xl pl-12 pr-6 py-4 text-sm font-bold outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                                <a href="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-xl pl-12 pr-12 py-4 text-sm font-bold outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <label className="flex items-center gap-3 cursor-pointer group w-fit">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                    className="peer sr-only"
                                />
                                <div className="w-5 h-5 border-2 border-slate-200 dark:border-slate-700 rounded-md group-hover:border-primary transition-all peer-checked:bg-primary peer-checked:border-primary"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-white scale-0 peer-checked:scale-100 transition-transform">
                                    <svg size="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 select-none">Remember for 30 days</span>
                        </label>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? "Authenticating..." : "Sign In"}
                            <LogIn size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white dark:bg-[#1a130e] px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">or continue with</span>
                        </div>
                    </div>

                    {/* Social Logins */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button className="flex items-center justify-center gap-3 py-3 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group cursor-pointer">
                            <Chrome size={18} className="text-slate-600 dark:text-slate-300" />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-3 py-3 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group cursor-pointer">
                            <Github size={18} className="text-slate-600 dark:text-slate-300" />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Github</span>
                        </button>
                    </div>

                    <p className="text-center text-sm font-bold text-slate-500 dark:text-slate-400">
                        Don't have an account? {' '}
                        <Link to="/signup" className="text-primary hover:underline underline-offset-4 decoration-2">Create one now</Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Login;

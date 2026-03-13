import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { loginApi } from '../helper/api_helper';
import {
    Mail,
    Lock,
    ArrowRight,
    ShieldCheck,
    Sparkles,
    ChevronRight,
    Loader2,
    AlertCircle
} from 'lucide-react';

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validateForm = () => {
        if (!username.trim()) {
            setError('Username is required');
            return false;
        }
        if (username.trim().length < 3) {
            setError('Username must be at least 3 characters');
            return false;
        }
        if (!password) {
            setError('Password is required');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        dispatch(loginStart());

        try {
            const response = await loginApi({
                username: username.trim(),
                password: password
            });

            if (response.status) {
                const { adminData, accessToken } = response.data;

                // Store data in localStorage
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('adminData', JSON.stringify(adminData));
                localStorage.setItem('user-login-id', adminData.id);

                // Dispatch to Redux state
                dispatch(loginSuccess({
                    adminData: adminData,
                    accessToken: accessToken
                }));

                // Navigate to dashboard
                navigate('/dashboard');
            } else {
                const errorMsg = response.message || 'Login failed. Please try again.';
                setError(errorMsg);
                dispatch(loginFailure(errorMsg));
            }
        } catch (err) {
            const errorMessage = err || 'An error occurred during login. Please try again.';
            setError(errorMessage);
            dispatch(loginFailure(errorMessage));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-primary flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Premium Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-accent/[0.07] blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/[0.03] blur-[150px] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <div className="w-full max-w-[1200px] grid lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left Side: Brand Teaser */}
                <div className="hidden lg:block space-y-8 pr-12">
                    <div className="flex items-center gap-3 text-brand-accent mb-12">
                        <div className="w-12 h-px bg-brand-accent/20" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Proprietary Technology</span>
                    </div>
                    <h1 className="text-[80px] font-black text-white leading-[0.9] tracking-tighter">
                        OPPVIA <span className="text-brand-accent">ADMIN</span>
                    </h1>
                    <p className="text-white/40 text-xl font-medium leading-relaxed max-w-md">
                        The intelligent command center for Oppvia's internship ecosystem. Manage complexity with elegance.
                    </p>

                    <div className="pt-12 space-y-6">
                        {[
                            { label: 'Cloud Secured', sub: 'Enterprise-grade encryption' },
                            { label: 'AI Driven', sub: 'Smart job categorization' },
                            { label: 'Real-time', sub: 'Instant platform updates' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-6 group">
                                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-brand-accent group-hover:text-brand-primary transition-all duration-500">
                                    <ChevronRight className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">{item.label}</p>
                                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="flex justify-center lg:justify-end">
                    <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-3xl p-10 lg:p-14 rounded-[60px] border border-white/10 shadow-2xl relative group">
                        {/* Floating Icon */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-brand-accent rounded-[32px] flex items-center justify-center shadow-2xl ring-8 ring-brand-primary rotate-12 group-hover:rotate-0 transition-transform duration-700">
                            <ShieldCheck className="w-10 h-10 text-brand-primary" />
                        </div>

                        <div className="text-center mt-8 mb-12">
                            <h2 className="text-white text-3xl font-black tracking-tight mb-2">Secure Access</h2>
                            <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Enter your credentials to manage the hive</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            {/* Error Message Display */}
                            {error && (
                                <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-4">Username</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-accent transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Enter username"
                                        className="w-full bg-white/[0.05] border border-white/5 rounded-3xl py-4 pl-14 pr-6 text-white text-sm focus:bg-white/10 focus:border-brand-accent/30 transition-all focus:ring-4 focus:ring-brand-accent/5"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-4">Access Secret</label>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-accent transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="••••••••••••"
                                        className="w-full bg-white/[0.05] border border-white/5 rounded-3xl py-4 pl-14 pr-6 text-white text-sm focus:bg-white/10 focus:border-brand-accent/30 transition-all focus:ring-4 focus:ring-brand-accent/5"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-brand-accent text-brand-primary p-5 rounded-[28px] font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group/btn disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            Initialize System <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-12 text-center">
                            <button className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-brand-accent transition-colors flex items-center justify-center gap-2 mx-auto">
                                <Sparkles className="w-3 h-3" /> Recover Credentials
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

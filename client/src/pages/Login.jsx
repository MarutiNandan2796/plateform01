import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaLock, FaEnvelope, FaKey } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                const data = await login(email, password);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            } else {
                const data = await verifyOTP(email, otp);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            }
        } catch (err) {
            if (err.needsVerification) {
                setShowOTP(true);
                setError('Account not verified. A new OTP has been sent to your email.');
            } else {
                setError(err.message || err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl md:grid md:grid-cols-[1.1fr_0.9fr] animate-fade-in">
            {/* Visual Sidebar */}
            <div className="hidden border-r border-white/5 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-10 text-slate-100 md:flex md:flex-col md:justify-between relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.1),_transparent_40%)] pointer-events-none" />
                <div className="relative z-10 space-y-6">
                    <div className="inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-orange-400">
                        Secure Access
                    </div>
                    <h2 className="max-w-md text-4xl font-extrabold leading-tight tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        Welcome back to the <span className="text-gradient font-black">event floor</span>.
                    </h2>
                    <p className="max-w-md text-sm leading-6 text-slate-400">
                        Log in to manage bookings, verify OTPs, and continue where you left off.
                    </p>
                </div>
                <div className="relative z-10 grid gap-4 text-xs text-slate-400 pt-10">
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                        <strong className="text-slate-200 block mb-1">Double Protected</strong>
                        OTP verification is required for high-importance actions and registrations.
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                        <strong className="text-slate-200 block mb-1">One-Stop Management</strong>
                        Manage all event tickets, cancellations, and status requests in real-time.
                    </div>
                </div>
            </div>

            {/* Login Form Container */}
            <div className="p-8 md:p-14 flex flex-col justify-center bg-slate-900/20">
                <div className="mb-8 text-center md:text-left">
                    <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-orange-400">
                        <FaLock />
                        Sign in
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Welcome Back</h2>
                    <p className="mt-2 text-sm text-slate-400">Access your Eventora account</p>
                </div>

                {error && (
                    <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-950/20 p-4 text-center text-sm font-semibold text-red-400 animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!showOTP ? (
                        <>
                            <div>
                                <label className="mb-2.5 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Email Address</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 text-sm" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="name@domain.com"
                                        className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-12 py-3.5 text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2.5 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Password</label>
                                <div className="relative">
                                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 text-sm" />
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-12 py-3.5 text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4 text-center text-sm text-orange-400">
                                Enter the verification code sent to your email to authenticate.
                            </div>
                            <div>
                                <label className="mb-2.5 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400 text-center">Verification Code (OTP)</label>
                                <div className="relative">
                                    <FaKey className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400 text-sm" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="0 0 0 0 0 0"
                                        className="w-full rounded-2xl border border-white/10 bg-slate-950/40 py-4 pl-12 pr-4 text-center text-xl font-bold tracking-[0.5em] text-orange-400 placeholder:text-slate-700 outline-none transition focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength="6"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-4 font-bold text-slate-950 shadow-lg shadow-orange-500/20 transition duration-200 hover:scale-[1.01] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? 'Processing authentication...' : (showOTP ? 'Verify OTP & Sign In' : 'Sign In')}
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-400 md:text-left text-sm">
                    Don't have an account? <Link to="/register" className="font-bold text-orange-400 hover:text-orange-300 hover:underline transition">Create account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;

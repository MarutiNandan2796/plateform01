import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt, FaUserCircle, FaSignOutAlt, FaColumns } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-md text-white shadow-[0_10px_30px_rgba(3,7,18,0.3)]">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
                    <Link to="/" className="text-white text-2xl font-bold flex items-center gap-3 tracking-tight hover:opacity-95 transition" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-amber-400 to-cyan-300 text-slate-950 shadow-[0_0_20px_rgba(249,115,22,0.35)]">
                            <FaTicketAlt className="text-lg" />
                        </span>
                        <span className="leading-none">
                            <span className="text-gradient font-extrabold tracking-tight">Eventora</span>
                            <span className="block text-[10px] font-bold tracking-[0.4em] text-slate-400 uppercase mt-0.5">Premium bookings</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link to="/" className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-slate-300 transition duration-200 hover:border-white/20 hover:bg-white/5 hover:text-white">
                            Events
                        </Link>
                        {user ? (
                            <>
                                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/20 px-5 py-2 text-sm font-semibold text-cyan-400 transition duration-200 hover:border-cyan-400/40 hover:bg-cyan-950/40">
                                    <FaColumns className="text-xs" />
                                    Dashboard
                                </Link>
                                <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full bg-slate-800 border border-white/10 px-5 py-2 text-sm font-semibold text-slate-200 transition duration-200 hover:bg-slate-700 hover:text-white">
                                    <FaSignOutAlt className="text-xs" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-slate-300 transition duration-200 hover:border-white/20 hover:bg-white/5 hover:text-white">
                                    Login
                                </Link>
                                <Link to="/register" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-[0_4px_15px_rgba(249,115,22,0.25)] transition duration-200 hover:scale-[1.03] hover:brightness-110">
                                    <FaUserCircle className="text-base" />
                                    Join Now
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

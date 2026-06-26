import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaMoneyBillWave, FaTicketAlt, FaLock, FaArrowRight } from 'react-icons/fa';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (err) {
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setBookingLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            if (!showOTP) {
                await api.post('/bookings/send-otp');
                setShowOTP(true);
                setSuccessMsg('OTP sent to your email. Please verify to confirm booking.');
            } else {
                await api.post('/bookings', { eventId: event._id, otp });
                setSuccessMsg('Booking requested! Awaiting admin confirmation.');
                setShowOTP(false);
                // Update local seats count dynamically after booking
                setEvent({ ...event, availableSeats: event.availableSeats - 1 });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="py-20 text-center text-xl font-semibold text-slate-700">Loading...</div>;
    if (error && !event) return <div className="py-20 text-center text-xl text-red-500">{error || 'Event not found'}</div>;

    const isSoldOut = event.availableSeats <= 0;

    return (
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl animate-fade-in text-slate-100">
            {/* Immersive Image Banner */}
            <div className="relative h-[300px] overflow-hidden bg-slate-950 md:h-[420px]">
                {event.image ? (
                    <img src={event.image} alt={event.title} className="h-full w-full object-cover brightness-[0.8]" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-6xl font-black uppercase tracking-[0.4em] text-slate-700/35">
                        {event.category}
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-orange-400 backdrop-blur-md">
                    <FaTicketAlt className="text-orange-400" />
                    {event.category}
                </div>
                <div className="absolute bottom-6 left-6 right-6 max-w-4xl space-y-3">
                    <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{event.title}</h1>
                    <p className="max-w-3xl text-sm leading-6 text-slate-300 md:text-base">{event.description}</p>
                </div>
            </div>

            <div className="grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10 lg:p-12">
                {/* Left Info Panel */}
                <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/5 bg-white/5 p-5 shadow-sm">
                            <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">Date</div>
                            <div className="mt-2.5 flex items-center gap-3 text-base font-bold text-slate-200">
                                <FaCalendarAlt className="text-orange-400 text-lg" />
                                {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                        <div className="rounded-2xl border border-white/5 bg-white/5 p-5 shadow-sm">
                            <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">Location</div>
                            <div className="mt-2.5 flex items-center gap-3 text-base font-bold text-slate-200">
                                <FaMapMarkerAlt className="text-cyan-400 text-lg" />
                                {event.location}
                            </div>
                        </div>
                        <div className="rounded-2xl border border-white/5 bg-white/5 p-5 shadow-sm">
                            <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">Ticket Price</div>
                            <div className="mt-2.5 flex items-center gap-3 text-base font-bold text-slate-200">
                                <FaMoneyBillWave className="text-emerald-400 text-lg" />
                                {event.ticketPrice === 0 ? <span className="text-emerald-400">Free</span> : <span className="text-gradient">₹{event.ticketPrice}</span>}
                            </div>
                        </div>
                        <div className="rounded-2xl border border-white/5 bg-white/5 p-5 shadow-sm">
                            <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">Availability</div>
                            <div className="mt-2.5 flex items-center gap-3 text-base font-bold text-slate-200">
                                <FaChair className="text-slate-400 text-lg" />
                                <span className={event.availableSeats < 10 ? 'text-orange-400' : 'text-slate-200'}>{event.availableSeats}</span>
                                <span className="text-slate-500 font-medium">/ {event.totalSeats} seats left</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-slate-950 to-slate-900/60 p-6 shadow-md">
                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.35em] text-orange-400">
                            <FaLock className="text-orange-400" />
                            Booking details
                        </div>
                        <h3 className="mt-3 text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Secure OTP Protected Request</h3>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                            All seats are verified with a 2-step registration code. Tap once to send an OTP to your registered email address, verify the code, and submit your seat request.
                        </p>
                    </div>
                </div>

                {/* Right Checkout Sidebar */}
                <aside className="rounded-3xl border border-white/5 bg-slate-950/40 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] md:p-8 flex flex-col justify-between">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-[0.35em] text-orange-500">Book now</div>
                                <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Ticket Booking</h3>
                            </div>
                            <div className="rounded-2xl bg-orange-500/10 p-3.5 text-orange-400 shadow-sm">
                                <FaTicketAlt className="text-lg" />
                            </div>
                        </div>

                        {showOTP && (
                            <div className="space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Enter OTP to Confirm</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="0 0 0 0 0 0"
                                    className="w-full rounded-2xl border border-white/10 bg-slate-950/60 py-3.5 text-center text-lg font-bold tracking-[0.5em] text-orange-400 placeholder:text-slate-700 outline-none transition focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength="6"
                                />
                            </div>
                        )}
                    </div>

                    <div className="pt-6 space-y-4">
                        <button
                            onClick={handleBooking}
                            disabled={isSoldOut || bookingLoading || (showOTP && !otp)}
                            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold transition duration-200 ${isSoldOut || (successMsg && !showOTP)
                                ? 'cursor-not-allowed bg-slate-800 text-slate-500 border border-white/5'
                                : 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-lg shadow-orange-500/10 hover:scale-[1.01] hover:brightness-110'
                                }`}
                        >
                            {bookingLoading ? 'Processing request...' : (showOTP ? 'Confirm & Book Spot' : (successMsg && !showOTP ? 'Spot Requested' : (isSoldOut ? 'Sold Out' : 'Send Booking OTP')))}
                            {!bookingLoading && !isSoldOut && <FaArrowRight className="text-sm" />}
                        </button>

                        <div className="space-y-3">
                            {error && <p className="rounded-2xl border border-red-500/20 bg-red-950/20 p-3.5 text-center text-sm font-semibold text-red-400">{error}</p>}
                            {successMsg && <p className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-3.5 text-center text-sm font-semibold text-emerald-400 animate-pulse">{successMsg}</p>}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default EventDetail;

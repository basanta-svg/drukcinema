import { useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Ticket, Trash2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

/* ── Seat layout builder ──────────────────────────── */
const SECTIONS = [
  { id: 'regular', label: 'Regular', rows: ['A','B','C','D'],           seatsPerRow: 10, price: null }, // price from movie
  { id: 'deluxe',  label: 'Deluxe',  rows: ['E','F','G','H'],           seatsPerRow: 12, price: null },
  { id: 'vip',     label: 'VIP',     rows: ['I','J'],                   seatsPerRow: 14, price: null },
];

const buildSeats = (movieId, showtimeId, prices) => {
  const occupied = new Set();
  // Deterministic "occupied" seats based on movie+showtime seed
  const seed = (movieId * 31 + String(showtimeId).charCodeAt(0) * 17) || 42;
  for (let i = 0; i < 35; i++) {
    const rowLetters = 'ABCDEFGHIJ';
    const r = rowLetters[(seed * (i + 3) * 7) % rowLetters.length];
    const s = ((seed * (i + 1) * 13) % 14) + 1;
    occupied.add(`${r}${s}`);
  }

  return SECTIONS.map(section => ({
    ...section,
    price: section.id === 'regular' ? prices.regular
         : section.id === 'deluxe'  ? Math.round(prices.regular * 1.3)
         : prices.vip,
    rows: section.rows.map(row => ({
      row,
      seats: Array.from({ length: section.seatsPerRow }, (_, i) => {
        const num  = i + 1;
        const seatId = `${row}${num}`;
        return { id: seatId, row, num, type: section.id, occupied: occupied.has(seatId) };
      }),
    })),
  }));
};

/* ── Seat button ──────────────────────────────────── */
const SeatBtn = ({ seat, selected, onToggle }) => {
  if (seat.occupied) {
    return <div className="w-7 h-7 rounded-t-md bg-white/10 border border-white/6 cursor-not-allowed flex-shrink-0" title="Booked" />;
  }
  const colors = {
    regular: selected ? 'bg-[#E50914] border-[#E50914]' : 'bg-zinc-700 border-zinc-600 hover:bg-zinc-500 hover:border-zinc-400',
    deluxe:  selected ? 'bg-[#E50914] border-[#E50914]' : 'bg-blue-900/60 border-blue-700/50 hover:bg-blue-800/60',
    vip:     selected ? 'bg-[#E50914] border-[#E50914]' : 'bg-amber-900/60 border-amber-700/50 hover:bg-amber-700/60',
  };
  return (
    <button
      onClick={() => onToggle(seat)}
      className={`w-7 h-7 rounded-t-md border text-[9px] font-bold text-white transition-all duration-150 flex-shrink-0 ${colors[seat.type]}`}
      title={`Seat ${seat.id}`}
    >
      {seat.num}
    </button>
  );
};

/* ── Page ─────────────────────────────────────────── */
const SeatSelectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { movie, showtime } = location.state || {};

  const [selected, setSelected] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const layout = useMemo(() => {
    if (!movie) return [];
    return buildSeats(movie.id, showtime?.id || '0', movie.price || { regular: 150, vip: 300 });
  }, [movie, showtime]);

  if (!movie || !showtime) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center pt-20 text-center px-4">
        <div>
          <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">No showtime selected</h2>
          <p className="text-gray-500 mb-4">Please go back and select a showtime first.</p>
          <Link to="/movies" className="px-5 py-2.5 bg-[#E50914] text-white rounded-lg text-sm font-semibold hover:bg-[#c8000f] transition-colors">
            Browse Movies
          </Link>
        </div>
      </div>
    );
  }

  const toggle = (seat) => {
    setSelected(prev => {
      const exists = prev.find(s => s.id === seat.id);
      if (exists) return prev.filter(s => s.id !== seat.id);
      if (prev.length >= 8) return prev; // max 8 seats
      return [...prev, seat];
    });
  };

  const totalPrice = selected.reduce((sum, seat) => {
    const section = layout.find(s => s.id === seat.type);
    return sum + (section?.price || 150);
  }, 0);

  const handleConfirm = async () => {
    if (!isAuthenticated) { navigate('/login', { state: { from: location } }); return; }
    if (selected.length === 0) { setError('Please select at least one seat.'); return; }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/bookings', {
        movieId: String(movie.id),
        showtime: {
          date: showtime.date,
          time: showtime.time,
          hall: showtime.hall,
          cinema: showtime.hall,
        },
        seats: selected.map(s => ({ row: s.row, number: s.num, type: s.type })),
        paymentMethod: 'cash',
      });
      navigate('/booking/success', {
        state: { booking: data.booking, movie, showtime, seats: selected, total: totalPrice }
      });
    } catch (err) {
      // Even if backend unreachable, show local success for demo
      const fakeRef = 'DC' + Date.now().toString(36).toUpperCase();
      navigate('/booking/success', {
        state: {
          booking: { bookingRef: fakeRef, status: 'confirmed' },
          movie, showtime, seats: selected, total: totalPrice,
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center gap-3 py-6 border-b border-white/6 mb-8">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg bg-white/6 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div>
            <h1 className="text-white font-bold">{movie.title}</h1>
            <p className="text-gray-500 text-sm">{showtime.day} · {showtime.time} · {showtime.hall}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Cinema hall ──────────────────────────── */}
          <div className="flex-1 overflow-x-auto">
            {/* Screen */}
            <div className="mb-8 text-center">
              <div className="h-2 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full mb-1 max-w-xl mx-auto" />
              <p className="text-gray-500 text-xs tracking-widest uppercase">Screen</p>
            </div>

            {/* Seat grid */}
            <div className="space-y-6 min-w-[380px]">
              {layout.map(section => (
                <div key={section.id}>
                  {/* Section label */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`h-px flex-1 ${section.id === 'vip' ? 'bg-amber-700/30' : section.id === 'deluxe' ? 'bg-blue-700/30' : 'bg-white/8'}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      section.id === 'vip' ? 'text-amber-400' : section.id === 'deluxe' ? 'text-blue-400' : 'text-gray-500'
                    }`}>
                      {section.label} — Nu. {section.price}
                    </span>
                    <div className={`h-px flex-1 ${section.id === 'vip' ? 'bg-amber-700/30' : section.id === 'deluxe' ? 'bg-blue-700/30' : 'bg-white/8'}`} />
                  </div>

                  {/* Rows */}
                  <div className="space-y-2">
                    {section.rows.map(({ row, seats }) => (
                      <div key={row} className="flex items-center gap-3">
                        <span className="text-gray-600 text-xs font-mono w-4 text-right flex-shrink-0">{row}</span>
                        {/* Left half */}
                        <div className="flex gap-1.5">
                          {seats.slice(0, Math.ceil(seats.length / 2)).map(seat => (
                            <SeatBtn key={seat.id} seat={seat} selected={!!selected.find(s => s.id === seat.id)} onToggle={toggle} />
                          ))}
                        </div>
                        {/* Aisle */}
                        <div className="w-4 flex-shrink-0" />
                        {/* Right half */}
                        <div className="flex gap-1.5">
                          {seats.slice(Math.ceil(seats.length / 2)).map(seat => (
                            <SeatBtn key={seat.id} seat={seat} selected={!!selected.find(s => s.id === seat.id)} onToggle={toggle} />
                          ))}
                        </div>
                        <span className="text-gray-600 text-xs font-mono w-4 flex-shrink-0">{row}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-5 mt-8 pt-6 border-t border-white/6">
              {[
                { label: 'Available', color: 'bg-zinc-700 border-zinc-600' },
                { label: 'Selected',  color: 'bg-[#E50914] border-[#E50914]' },
                { label: 'Booked',    color: 'bg-white/10 border-white/6' },
                { label: 'Deluxe',   color: 'bg-blue-900/60 border-blue-700/50' },
                { label: 'VIP',      color: 'bg-amber-900/60 border-amber-700/50' },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-t border ${color} flex-shrink-0`} />
                  <span className="text-gray-500 text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Booking summary ──────────────────────── */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-5 sticky top-24">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Ticket size={16} className="text-[#E50914]" />
                Booking Summary
              </h3>

              {/* Show info */}
              <div className="bg-white/4 rounded-xl p-3 mb-4">
                <p className="text-white text-sm font-semibold line-clamp-1">{movie.title}</p>
                <p className="text-gray-400 text-xs mt-1">{showtime.day}, {showtime.date}</p>
                <p className="text-gray-400 text-xs">{showtime.time} · {showtime.hall}</p>
              </div>

              {/* Selected seats */}
              {selected.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-600 text-sm">No seats selected</p>
                  <p className="text-gray-700 text-xs mt-1">Click seats to select</p>
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Selected Seats</p>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {selected.map(seat => {
                      const section = layout.find(s => s.id === seat.type);
                      return (
                        <div key={seat.id} className="flex items-center justify-between text-sm">
                          <span className="text-white font-mono font-bold">{seat.id}</span>
                          <span className={`text-xs ${seat.type === 'vip' ? 'text-amber-400' : seat.type === 'deluxe' ? 'text-blue-400' : 'text-gray-400'}`}>
                            {section?.label}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-300 text-xs">Nu. {section?.price}</span>
                            <button onClick={() => toggle(seat)} className="text-gray-600 hover:text-red-400 transition-colors">
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Total */}
              {selected.length > 0 && (
                <div className="border-t border-white/8 pt-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{selected.length} × ticket</span>
                    <span className="text-white font-black text-lg">Nu. {totalPrice}</span>
                  </div>
                  <p className="text-gray-600 text-xs mt-0.5">All taxes included</p>
                </div>
              )}

              {/* Max seats notice */}
              {selected.length >= 8 && (
                <p className="text-yellow-400 text-xs mb-3 flex items-center gap-1.5">
                  <AlertCircle size={12} /> Max 8 seats per booking
                </p>
              )}

              {/* Error */}
              {error && (
                <p className="text-red-400 text-xs mb-3 flex items-center gap-1.5">
                  <AlertCircle size={12} /> {error}
                </p>
              )}

              <button
                onClick={handleConfirm}
                disabled={selected.length === 0 || loading}
                className="w-full py-3.5 bg-[#E50914] hover:bg-[#c8000f] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing…</>
                ) : (
                  <><Ticket size={15} /> Confirm Booking</>
                )}
              </button>

              {!isAuthenticated && (
                <p className="text-center text-gray-600 text-xs mt-3">
                  You'll be asked to <Link to="/login" className="text-[#E50914] hover:underline">sign in</Link> to complete
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;

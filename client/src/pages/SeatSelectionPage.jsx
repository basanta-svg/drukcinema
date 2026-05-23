import { useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Ticket, X, AlertCircle, Info } from 'lucide-react';

/* ── Seat layout config ───────────────────────────── */
const LAYOUT = [
  { id: 'regular', label: 'Regular', rows: ['A','B','C','D'],  seats: 10, price: null, color: 'zinc' },
  { id: 'deluxe',  label: 'Deluxe',  rows: ['E','F','G','H'],  seats: 12, price: null, color: 'blue' },
  { id: 'vip',     label: 'VIP',     rows: ['I','J'],          seats: 14, price: null, color: 'amber' },
];

/* Deterministic occupied seats */
const buildLayout = (movieId, showtimeId, prices) => {
  const seed    = (movieId * 31 + String(showtimeId).charCodeAt(0) * 17) || 42;
  const rowList = 'ABCDEFGHIJ';
  const occupied = new Set();
  for (let i = 0; i < 38; i++) {
    const r = rowList[(seed * (i + 3) * 7) % rowList.length];
    const s = ((seed * (i + 1) * 13) % 14) + 1;
    occupied.add(`${r}${s}`);
  }
  return LAYOUT.map(s => ({
    ...s,
    price: s.id === 'regular' ? prices.regular
         : s.id === 'deluxe'  ? Math.round(prices.regular * 1.3)
         : prices.vip,
    rows: s.rows.map(row => ({
      row,
      seats: Array.from({ length: s.seats }, (_, i) => {
        const num = i + 1;
        return { id: `${row}${num}`, row, num, type: s.id, occupied: occupied.has(`${row}${num}`) };
      }),
    })),
  }));
};

/* Seat colors by type + state */
const seatCls = (type, selected, occupied) => {
  if (occupied) return 'bg-white/6 border-white/5 cursor-not-allowed opacity-40';
  if (selected) return 'bg-[#E50914] border-[#E50914] shadow-[0_0_8px_rgba(229,9,20,0.5)] scale-110';
  const base = { regular: 'bg-zinc-800 border-zinc-700 hover:bg-zinc-600 hover:border-zinc-500',
                  deluxe:  'bg-blue-950/70 border-blue-800/50 hover:bg-blue-800/70',
                  vip:     'bg-amber-950/70 border-amber-800/50 hover:bg-amber-700/70' };
  return base[type] || base.regular;
};

const SeatSelectionPage = () => {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const { movie, showtime } = state || {};

  const [selected, setSelected] = useState([]);

  const prices = { regular: movie?.price?.regular || 150, vip: movie?.price?.vip || 300 };
  const layout  = useMemo(() => movie ? buildLayout(movie.id, showtime?.id || '0', prices) : [], [movie]);

  if (!movie || !showtime) return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center pt-20 text-center px-4">
      <div>
        <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-white text-xl font-bold mb-2">No showtime selected</h2>
        <Link to="/movies" className="px-5 py-2.5 bg-[#E50914] text-white rounded-xl text-sm font-semibold hover:bg-[#c8000f] transition-colors">
          Browse Movies
        </Link>
      </div>
    </div>
  );

  const toggle = seat => {
    if (seat.occupied) return;
    setSelected(prev => {
      const exists = prev.find(s => s.id === seat.id);
      if (exists) return prev.filter(s => s.id !== seat.id);
      if (prev.length >= 8) return prev;
      return [...prev, seat];
    });
  };

  const total = selected.reduce((sum, s) => {
    const sec = layout.find(l => l.id === s.type);
    return sum + (sec?.price || 150);
  }, 0);

  const confirm = () => {
    if (!selected.length) return;
    const fakeRef = 'DC' + Date.now().toString(36).toUpperCase();
    navigate('/booking/success', {
      state: { booking: { bookingRef: fakeRef, status: 'confirmed' }, movie, showtime, seats: selected, total }
    });
  };

  const sectionColor = id => id === 'vip' ? 'text-amber-400' : id === 'deluxe' ? 'text-blue-400' : 'text-gray-500';

  return (
    <div className="min-h-screen bg-[#141414] pt-16">

      {/* ── Header bar ──────────────────────────────── */}
      <div className="bg-[#111] border-b border-white/5 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
          <button onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg bg-white/6 hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex-shrink-0">
            <ChevronLeft size={17} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-white font-bold text-sm truncate">{movie.title}</p>
            <p className="text-gray-600 text-xs">{showtime.day} · {showtime.time} · {showtime.hall}</p>
          </div>
          {selected.length > 0 && (
            <div className="flex-shrink-0 text-right">
              <p className="text-white font-black text-sm">Nu. {total}</p>
              <p className="text-gray-600 text-xs">{selected.length} seat{selected.length>1?'s':''}</p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col xl:flex-row gap-8">

          {/* ── Cinema hall ──────────────────────────── */}
          <div className="flex-1">

            {/* Screen */}
            <div className="mb-10 text-center">
              <div className="relative max-w-lg mx-auto">
                <div className="h-2 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-[50%]" />
                <div className="h-8 bg-gradient-to-b from-white/5 to-transparent rounded-b-[50%] -mt-px mx-8" />
              </div>
              <p className="text-gray-600 text-xs tracking-[4px] uppercase mt-2">Screen</p>
            </div>

            {/* Rows */}
            <div className="overflow-x-auto">
              <div className="space-y-7 min-w-[420px] max-w-2xl mx-auto">
                {layout.map((section, si) => (
                  <div key={section.id}>
                    {/* Section divider */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`h-px flex-1 ${si===0?'bg-white/6':si===1?'bg-blue-900/30':'bg-amber-900/30'}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-[2px] ${sectionColor(section.id)}`}>
                        {section.label} · Nu. {section.price}
                      </span>
                      <div className={`h-px flex-1 ${si===0?'bg-white/6':si===1?'bg-blue-900/30':'bg-amber-900/30'}`} />
                    </div>

                    <div className="space-y-2">
                      {section.rows.map(({ row, seats }) => (
                        <div key={row} className="flex items-center gap-3">
                          <span className="text-gray-700 text-xs font-mono w-5 text-right flex-shrink-0">{row}</span>
                          {/* Left block */}
                          <div className="flex gap-1.5">
                            {seats.slice(0, Math.ceil(seats.length / 2)).map(seat => (
                              <button key={seat.id} disabled={seat.occupied} onClick={() => toggle(seat)}
                                title={seat.occupied ? 'Booked' : `Seat ${seat.id}`}
                                className={`w-7 h-6 rounded-t-md border text-[9px] font-bold transition-all duration-150 ${seatCls(seat.type, !!selected.find(s=>s.id===seat.id), seat.occupied)}`}>
                                {seat.num}
                              </button>
                            ))}
                          </div>
                          {/* Aisle */}
                          <div className="w-5 flex-shrink-0 flex items-center justify-center">
                            <div className="h-4 w-px bg-white/6" />
                          </div>
                          {/* Right block */}
                          <div className="flex gap-1.5">
                            {seats.slice(Math.ceil(seats.length / 2)).map(seat => (
                              <button key={seat.id} disabled={seat.occupied} onClick={() => toggle(seat)}
                                title={seat.occupied ? 'Booked' : `Seat ${seat.id}`}
                                className={`w-7 h-6 rounded-t-md border text-[9px] font-bold transition-all duration-150 ${seatCls(seat.type, !!selected.find(s=>s.id===seat.id), seat.occupied)}`}>
                                {seat.num}
                              </button>
                            ))}
                          </div>
                          <span className="text-gray-700 text-xs font-mono w-5 flex-shrink-0">{row}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-5 mt-10 pt-8 border-t border-white/6">
              {[
                { label: 'Available', cls: 'bg-zinc-800 border-zinc-700' },
                { label: 'Selected',  cls: 'bg-[#E50914] border-[#E50914]' },
                { label: 'Booked',    cls: 'bg-white/6 border-white/5 opacity-40' },
                { label: 'Deluxe',    cls: 'bg-blue-950/70 border-blue-800/50' },
                { label: 'VIP',       cls: 'bg-amber-950/70 border-amber-800/50' },
              ].map(({ label, cls }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-6 h-5 rounded-t border ${cls} flex-shrink-0`} />
                  <span className="text-gray-600 text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Summary panel ─────────────────────────── */}
          <div className="xl:w-72 flex-shrink-0">
            <div className="bg-[#181818] border border-white/8 rounded-2xl overflow-hidden sticky top-32">

              {/* Panel header */}
              <div className="px-5 py-4 border-b border-white/6 flex items-center gap-2">
                <Ticket size={15} className="text-[#E50914]" />
                <span className="text-white font-bold text-sm">Your Selection</span>
                {selected.length > 0 && (
                  <span className="ml-auto bg-[#E50914] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {selected.length}
                  </span>
                )}
              </div>

              {/* Movie + show info */}
              <div className="p-4 border-b border-white/6">
                <div className="flex gap-3">
                  <div className="w-12 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
                    <img src={movie.poster} alt="" className="w-full object-cover" onError={e => e.target.style.display='none'} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-tight line-clamp-2">{movie.title}</p>
                    <p className="text-gray-600 text-xs mt-1">{showtime.day} · {showtime.time}</p>
                    <p className="text-gray-700 text-xs">{showtime.hall}</p>
                  </div>
                </div>
              </div>

              {/* Seat list */}
              <div className="p-4">
                {selected.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="w-10 h-10 bg-white/4 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Info size={16} className="text-gray-600" />
                    </div>
                    <p className="text-gray-600 text-sm">No seats selected</p>
                    <p className="text-gray-700 text-xs mt-0.5">Tap seats to select (max 8)</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto scroll-container">
                    {selected.map(seat => {
                      const sec = layout.find(s => s.id === seat.type);
                      return (
                        <div key={seat.id} className="flex items-center gap-2 bg-white/4 rounded-xl px-3 py-2.5">
                          <span className={`text-xs font-bold font-mono ${sectionColor(seat.type)}`}>{seat.id}</span>
                          <span className="text-gray-600 text-xs capitalize flex-1">{seat.type}</span>
                          <span className="text-white text-xs font-semibold">Nu. {sec?.price}</span>
                          <button onClick={() => toggle(seat)} className="text-gray-700 hover:text-red-400 transition-colors ml-1">
                            <X size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Total */}
                {selected.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/6">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-500 text-sm">{selected.length} × ticket</span>
                      <span className="text-white font-black text-xl">Nu. {total}</span>
                    </div>
                    <p className="text-gray-700 text-xs text-right">Inclusive of all taxes</p>
                  </div>
                )}

                {selected.length >= 8 && (
                  <div className="flex items-center gap-2 bg-amber-950/40 border border-amber-800/40 text-amber-400 text-xs px-3 py-2 rounded-xl mt-3">
                    <AlertCircle size={12} className="flex-shrink-0" />
                    Maximum 8 seats per booking
                  </div>
                )}

                <button onClick={confirm} disabled={!selected.length}
                  className="w-full mt-4 py-3.5 bg-[#E50914] hover:bg-[#c8000f] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-[0_4px_20px_rgba(229,9,20,0.2)]">
                  <Ticket size={15} />
                  {selected.length ? `Confirm ${selected.length} Seat${selected.length>1?'s':''}` : 'Select Seats'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;

import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Ticket, Calendar, Clock, MapPin, Download, Home, Film } from 'lucide-react';

const BookingSuccessPage = () => {
  const { state } = useLocation();
  const navigate  = useNavigate();

  if (!state) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center pt-20 text-center">
        <div>
          <h2 className="text-white text-xl font-bold mb-4">No booking data found</h2>
          <Link to="/" className="px-5 py-2.5 bg-[#E50914] text-white rounded-lg font-semibold hover:bg-[#c8000f] transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const { booking, movie, showtime, seats, total } = state;

  return (
    <div className="min-h-screen bg-[#141414] pt-20 pb-16 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">

        {/* Success icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-950 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-black text-white mb-1">Booking Confirmed!</h1>
          <p className="text-gray-400 text-sm">Your tickets are ready. Enjoy the show!</p>
        </div>

        {/* Ticket card */}
        <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/8">
          {/* Top accent */}
          <div className="h-1.5 bg-gradient-to-r from-[#E50914] via-red-400 to-[#E50914]" />

          {/* Booking ref */}
          <div className="bg-[#E50914]/10 border-b border-[#E50914]/20 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket size={16} className="text-[#E50914]" />
              <span className="text-[#E50914] text-xs font-bold uppercase tracking-widest">Booking Reference</span>
            </div>
            <span className="text-white font-black font-mono text-sm tracking-wider">
              {booking?.bookingRef || 'DCXXXXXXXX'}
            </span>
          </div>

          <div className="p-6 space-y-5">
            {/* Movie info */}
            <div className="flex gap-4">
              <div className="w-16 h-24 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                <img src={movie?.poster} alt={movie?.title} className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
              </div>
              <div className="pt-1">
                <h3 className="text-white font-bold text-base leading-tight mb-1">{movie?.title}</h3>
                <div className="flex flex-wrap gap-1">
                  {movie?.genre?.slice(0,2).map(g => <span key={g} className="genre-tag">{g}</span>)}
                </div>
                <p className="text-gray-500 text-xs mt-2">{movie?.language} · {movie?.certificate} · {movie?.duration}</p>
              </div>
            </div>

            {/* Divider with holes */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#141414] rounded-full border border-white/8 -ml-8 flex-shrink-0" />
              <div className="flex-1 border-t border-dashed border-white/10" />
              <div className="w-4 h-4 bg-[#141414] rounded-full border border-white/8 -mr-8 flex-shrink-0" />
            </div>

            {/* Show details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Date</p>
                <div className="flex items-center gap-1.5 text-white text-sm font-semibold">
                  <Calendar size={13} className="text-[#E50914]" />
                  {showtime?.day}, {showtime?.date}
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Time</p>
                <div className="flex items-center gap-1.5 text-white text-sm font-semibold">
                  <Clock size={13} className="text-[#E50914]" />
                  {showtime?.time}
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Cinema</p>
                <div className="flex items-center gap-1.5 text-white text-sm font-semibold">
                  <MapPin size={13} className="text-[#E50914]" />
                  <span className="line-clamp-1">{showtime?.hall}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Total Paid</p>
                <p className="text-white text-sm font-bold">Nu. {total || 0}</p>
              </div>
            </div>

            {/* Seats */}
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Seats</p>
              <div className="flex flex-wrap gap-2">
                {seats?.map(seat => (
                  <div key={seat.id} className={`px-2.5 py-1 rounded-lg border text-xs font-bold font-mono ${
                    seat.type === 'vip'    ? 'bg-amber-900/30 border-amber-700/50 text-amber-300'
                    : seat.type === 'deluxe' ? 'bg-blue-900/30 border-blue-700/50 text-blue-300'
                    : 'bg-white/8 border-white/15 text-white'
                  }`}>
                    {seat.id}
                    <span className="text-[9px] opacity-60 ml-1 capitalize">{seat.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#141414] rounded-full border border-white/8 -ml-8 flex-shrink-0" />
              <div className="flex-1 border-t border-dashed border-white/10" />
              <div className="w-4 h-4 bg-[#141414] rounded-full border border-white/8 -mr-8 flex-shrink-0" />
            </div>

            {/* QR placeholder */}
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-xs">Show this at the cinema entrance</p>
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-12 h-12 grid grid-cols-3 gap-0.5">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className={`rounded-sm ${[0,2,4,6,8].includes(i) ? 'bg-black' : 'bg-white'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="h-1.5 bg-gradient-to-r from-[#E50914] via-red-400 to-[#E50914]" />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/6 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-xl transition-colors">
            <Download size={15} /> Download
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#E50914] hover:bg-[#c8000f] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Home size={15} /> Go Home
          </button>
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          Have a question?{' '}
          <a href="#" className="text-[#E50914] hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default BookingSuccessPage;

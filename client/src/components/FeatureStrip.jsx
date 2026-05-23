import { Ticket, LayoutGrid, Smartphone, RotateCcw } from 'lucide-react';

const features = [
  { Icon: Ticket,      title: 'Easy Booking',    desc: 'Book in under 60 seconds' },
  { Icon: LayoutGrid,  title: 'Seat Selection',   desc: 'Choose your perfect seat' },
  { Icon: Smartphone,  title: 'E-Tickets',        desc: 'Instant mobile tickets' },
  { Icon: RotateCcw,   title: 'Easy Refunds',     desc: 'Hassle-free cancellation' },
];

const FeatureStrip = () => (
  <div className="bg-[#181818] border-y border-white/6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-x divide-white/6">
        {features.map(({ Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-3 px-4 first:pl-0 group">
            <div className="w-9 h-9 flex-shrink-0 rounded-lg bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center group-hover:bg-[#E50914]/20 transition-colors">
              <Icon size={16} className="text-[#E50914]" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">{title}</p>
              <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default FeatureStrip;

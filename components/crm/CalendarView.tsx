import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Mail, User } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface CalBooking {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  status: 'accepted' | 'pending' | 'cancelled' | string;
  attendees: Array<{ email: string; name?: string }>;
}

interface CalApiResponse {
  bookings: CalBooking[];
}

type BookingTab = 'upcoming' | 'past';

// ── Status badge config ───────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  accepted:  { bg: '#22C55E18', text: '#22C55E', label: 'Accepted'  },
  pending:   { bg: '#F59E0B18', text: '#F59E0B', label: 'Pending'   },
  cancelled: { bg: '#EF444418', text: '#EF4444', label: 'Cancelled' },
};

function getStatusStyle(status: string) {
  return STATUS_COLORS[status.toLowerCase()] ?? { bg: '#55555518', text: '#555555', label: status };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const CAL_API_KEY = 'cal_live_87dc555d324f7b0d8933151a6ddc9c6a';

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    + ' · '
    + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

const Skeleton: React.FC = () => (
  <div className="divide-y divide-[#1A1A1A]">
    {[1, 2, 3].map(i => (
      <div key={i} className="px-4 py-3 space-y-1.5 animate-pulse">
        <div className="h-3 bg-[#1E1E1E] rounded w-1/2" />
        <div className="h-2.5 bg-[#1A1A1A] rounded w-3/4" />
        <div className="h-2.5 bg-[#1A1A1A] rounded w-1/3" />
      </div>
    ))}
  </div>
);

// ── Booking Card ──────────────────────────────────────────────────────────────

const BookingCard: React.FC<{ booking: CalBooking }> = ({ booking }) => {
  const attendee    = booking.attendees?.[0];
  const statusStyle = getStatusStyle(booking.status);

  return (
    <div className="flex items-start gap-2.5 px-4 py-3 hover:bg-[#1A1A1A] transition-colors">
      {/* Icon */}
      <div className="p-1.5 rounded bg-[#1E1E1E] shrink-0 mt-0.5">
        <Calendar size={12} className="text-[#8B5CF6]" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-xs font-medium text-[#F2F2F2] truncate">{booking.title}</p>
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0"
            style={{ background: statusStyle.bg, color: statusStyle.text }}
          >
            {statusStyle.label}
          </span>
        </div>

        <div className="flex items-center gap-1 mb-0.5">
          <Clock size={9} className="text-[#555] shrink-0" />
          <span className="text-[10px] text-[#909090]">{formatDateTime(booking.startTime)}</span>
        </div>

        {attendee && (
          <div className="flex items-center gap-1">
            <User size={9} className="text-[#555] shrink-0" />
            <span className="text-[10px] text-[#555] truncate">
              {attendee.name || attendee.email}
            </span>
            {attendee.name && (
              <>
                <span className="text-[#383838]">·</span>
                <Mail size={9} className="text-[#383838] shrink-0" />
                <span className="text-[10px] text-[#383838] truncate">{attendee.email}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const CalendarView: React.FC = () => {
  const [tab, setTab]           = useState<BookingTab>('upcoming');
  const [upcoming, setUpcoming] = useState<CalBooking[]>([]);
  const [past, setPast]         = useState<CalBooking[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const today     = new Date();
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const [upcomingRes, pastRes] = await Promise.all([
        fetch(
          `https://api.cal.com/v1/bookings?apiKey=${CAL_API_KEY}&dateFrom=${toDateStr(today)}&status=upcoming`,
          { headers: { 'Content-Type': 'application/json' } }
        ),
        fetch(
          `https://api.cal.com/v1/bookings?apiKey=${CAL_API_KEY}&dateTo=${toDateStr(yesterday)}&status=past`,
          { headers: { 'Content-Type': 'application/json' } }
        ),
      ]);

      if (!upcomingRes.ok || !pastRes.ok) {
        throw new Error(`Cal.com API error: ${upcomingRes.status}`);
      }

      const upcomingData: CalApiResponse = await upcomingRes.json();
      const pastData: CalApiResponse     = await pastRes.json();

      setUpcoming(upcomingData.bookings ?? []);
      setPast(pastData.bookings ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const monthYear = today.toLocaleString('default', { month: 'long', year: 'numeric' });
  const displayedBookings = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="p-5 space-y-5 overflow-y-auto h-full">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-[#F2F2F2]">Bookings</h1>
          <p className="text-xs text-[#555]">{monthYear}</p>
        </div>
        <button
          onClick={fetchBookings}
          className="text-[10px] text-[#CD3D35] hover:text-[#E85550] transition-colors font-medium"
        >
          Refresh
        </button>
      </div>

      {/* Card */}
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg overflow-hidden">

        {/* Tabs */}
        <div className="flex border-b border-[#1A1A1A]">
          {(['upcoming', 'past'] as BookingTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-medium capitalize transition-colors border-b-2 ${
                tab === t
                  ? 'text-[#F2F2F2] border-[#CD3D35]'
                  : 'text-[#555] border-transparent hover:text-[#909090]'
              }`}
            >
              {t}
              <span className={`ml-1.5 text-[9px] font-mono px-1 py-0.5 rounded ${
                tab === t ? 'bg-[#CD3D35]/15 text-[#CD3D35]' : 'bg-[#1A1A1A] text-[#383838]'
              }`}>
                {t === 'upcoming' ? upcoming.length : past.length}
              </span>
            </button>
          ))}
        </div>

        {/* Body */}
        {loading ? (
          <Skeleton />
        ) : error ? (
          <div className="px-4 py-8 text-center">
            <p className="text-xs text-red-400/70 mb-2">Failed to load bookings</p>
            <p className="text-[10px] text-[#383838] font-mono">{error}</p>
            <button
              onClick={fetchBookings}
              className="mt-3 px-3 py-1.5 text-[11px] bg-[#1A1A1A] border border-[#2A2A2A] rounded text-[#909090] hover:text-white transition-colors"
            >
              Retry
            </button>
          </div>
        ) : displayedBookings.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-xs text-[#383838]">
              {tab === 'upcoming'
                ? 'No upcoming bookings. Follow up with leads to book demos.'
                : 'No past bookings found.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#1A1A1A]">
            {displayedBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;

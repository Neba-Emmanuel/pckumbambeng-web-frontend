'use client';

import { EventPageLink, EventPageSettings } from '@/components/EventPageLink';

import { useState, useMemo } from 'react';

interface CalendarEvent extends EventPageSettings {
  id: number;
  title: string;
  event_date: string;
  location: string;
  description: string;
}

interface CalendarViewProps {
  events: CalendarEvent[];
  year: number;
  month: number;
  onMonthChange: (year: number, month: number) => void;
}

export function CalendarView({ events, year, month, onMonthChange }: CalendarViewProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  const monthName = new Date(year, month - 1).toLocaleString('en-US', { month: 'long' });

  const eventsByDay = useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {};
    events.forEach((event) => {
      const eventDate = new Date(event.event_date);
      if (eventDate.getFullYear() === year && eventDate.getMonth() + 1 === month) {
        const day = eventDate.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(event);
      }
    });
    return map;
  }, [events, year, month]);

  const selectedDayEvents = selectedDay ? eventsByDay[selectedDay] || [] : [];

  const handlePrevMonth = () => {
    if (month === 1) {
      onMonthChange(year - 1, 12);
    } else {
      onMonthChange(year, month - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (month === 12) {
      onMonthChange(year + 1, 1);
    } else {
      onMonthChange(year, month + 1);
    }
    setSelectedDay(null);
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
  const todayDate = today.getDate();

  return (
    <div>
      {/* Month/Year Header with Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Previous month"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold text-gray-900">
          {monthName} {year}
        </h2>
        <button
          onClick={handleNextMonth}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {dayNames.map((name) => (
            <div key={name} className="px-1 py-2 text-center text-xs font-medium text-gray-500 uppercase">
              {name}
            </div>
          ))}
        </div>

        {/* Day Cells */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const hasEvents = day !== null && eventsByDay[day] && eventsByDay[day].length > 0;
            const isSelected = day !== null && day === selectedDay;
            const isToday = isCurrentMonth && day === todayDate;

            return (
              <button
                key={index}
                onClick={() => day !== null && setSelectedDay(day === selectedDay ? null : day)}
                disabled={day === null}
                className={`
                  relative p-2 min-h-[44px] text-sm border-b border-r border-gray-100 transition
                  ${day === null ? 'bg-gray-50 cursor-default' : 'hover:bg-navy-50 cursor-pointer'}
                  ${isSelected ? 'bg-navy-100 ring-2 ring-navy-500 ring-inset' : ''}
                  ${isToday && !isSelected ? 'bg-yellow-50' : ''}
                `}
                aria-label={day !== null ? `${monthName} ${day}${hasEvents ? `, ${eventsByDay[day].length} event(s)` : ''}` : undefined}
              >
                {day !== null && (
                  <>
                    <span className={`${isToday ? 'font-bold text-navy-700' : 'text-gray-700'}`}>
                      {day}
                    </span>
                    {hasEvents && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-navy-600" />
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Events */}
      {selectedDay !== null && (
        <div className="mt-4">
          <h3 className="text-md font-medium text-gray-900 mb-2">
            Events on {monthName} {selectedDay}, {year}
          </h3>
          {selectedDayEvents.length === 0 ? (
            <p className="text-sm text-gray-500">No events on this day.</p>
          ) : (
            <ul className="space-y-3">
              {selectedDayEvents.map((event) => {
                const eventDate = new Date(event.event_date);
                const timeStr = eventDate.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                });
                return (
                  <li
                    key={event.id}
                    className="rounded-md border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <div className="mt-1 text-sm text-gray-600 space-y-0.5">
                      <p>🕐 {timeStr}</p>
                      <p>📍 {event.location}</p>
                    </div>
                    {event.description && (
                      <p className="mt-2 text-sm text-gray-700">{event.description}</p>
                    )}
                    <EventPageLink event={event} />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}


import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, Plus, X, Calendar, Save } from 'lucide-react';
import { Shift, User as UserType } from '../types';

interface ScheduleProps {
  shifts: Shift[];
  user: UserType;
  onAddShift: (shift: Omit<Shift, 'id' | 'status'>) => void;
  onUpdateShiftStatus?: (id: string, status: Shift['status']) => void;
}

const Schedule: React.FC<ScheduleProps> = ({ shifts, user, onAddShift, onUpdateShiftStatus }) => {
  const isAdmin = user.role === 'admin';
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Helper to get the Monday of the current week
  const getStartOfWeek = (d: Date) => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0); // Normalize time
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff));
  };

  // State for Week Navigation initialized to current week's Monday
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getStartOfWeek(new Date()));
  
  // Form State
  const [manualName, setManualName] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('22:00');
  const [endTime, setEndTime] = useState('02:00');

  // Custom Date Picker State
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date()); // Tracks the month being viewed

  // Generate 7 days based on currentWeekStart
  const calendarDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(currentWeekStart.getDate() + i);
    return d;
  });

  const handlePrevWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newDate);
  };
  
  // Group shifts by date for visualization
  const groupedShifts = shifts.reduce((acc, shift) => {
    const d = shift.date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(shift);
    return acc;
  }, {} as Record<string, Shift[]>);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !date || !startTime || !endTime) return;

    onAddShift({
      userId: `manual_${Date.now()}`, // Generate dummy ID for manual entry
      userName: manualName,
      date: date,
      startTime: startTime,
      endTime: endTime
    });

    setIsModalOpen(false);
    // Reset form
    setManualName('');
    setDate(''); 
    setIsDatePickerOpen(false);
  };

  // --- Custom Date Picker Logic ---
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePickerPrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    setPickerDate(new Date(pickerDate.getFullYear(), pickerDate.getMonth() - 1, 1));
  };

  const handlePickerNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    setPickerDate(new Date(pickerDate.getFullYear(), pickerDate.getMonth() + 1, 1));
  };

  const handleDaySelect = (day: number) => {
    // Construct YYYY-MM-DD string
    const selected = new Date(pickerDate.getFullYear(), pickerDate.getMonth(), day);
    // Adjust for timezone offset to prevent off-by-one errors when converting to string
    // Simple way: stick to local components
    const yyyy = selected.getFullYear();
    const mm = String(selected.getMonth() + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    
    setDate(`${yyyy}-${mm}-${dd}`);
    setIsDatePickerOpen(false);
  };
  // -------------------------------

  // Helper to format date for display headers
  const formatDateHeader = (dateObj: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'short' };
    return dateObj.toLocaleDateString('id-ID', options);
  };

  // Helper to check if a date is today
  const isToday = (d: Date) => {
    const today = new Date();
    return d.getDate() === today.getDate() && 
           d.getMonth() === today.getMonth() && 
           d.getFullYear() === today.getFullYear();
  };

  // Get range string for header
  const weekRangeString = `${calendarDays[0].getDate()} ${calendarDays[0].toLocaleDateString('id-ID', { month: 'short' })} - ${calendarDays[6].getDate()} ${calendarDays[6].toLocaleDateString('id-ID', { month: 'short' })}`;

  const getStatusStyle = (status: Shift['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-gray-200 text-gray-700 border-gray-300';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const getStatusLabel = (status: Shift['status']) => {
    switch (status) {
      case 'active': return 'Bertugas';
      case 'completed': return 'Selesai';
      default: return 'Terjadwal';
    }
  };

  return (
    <div className="space-y-6 pb-24 relative min-h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Jadwal Ronda</h2>
          <p className="text-xs text-gray-500 font-medium">{weekRangeString}</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={handlePrevWeek}
             className="p-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
           >
             <ChevronLeft size={20}/>
           </button>
           <button 
             onClick={handleNextWeek}
             className="p-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
           >
             <ChevronRight size={20}/>
           </button>
        </div>
      </div>

      {/* Calendar Strip (Weekly View) */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
        {calendarDays.map((dateObj, idx) => {
            const isActive = isToday(dateObj);
            const dateStr = dateObj.toISOString().split('T')[0];
            const hasShift = groupedShifts[dateStr]?.length > 0;

            return (
              <div key={idx} className={`flex flex-col items-center gap-1 p-1 rounded-lg transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                <span className="text-[10px] font-medium uppercase truncate w-full text-center">
                  {dateObj.toLocaleDateString('id-ID', { weekday: 'short' })}
                </span>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-sm font-bold shadow-sm transition-all relative ${
                    isActive ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-gray-50 text-gray-600 border border-gray-100'
                }`}>
                  {dateObj.getDate()}
                  {hasShift && !isActive && (
                    <span className="absolute bottom-1 w-1 h-1 bg-green-500 rounded-full"></span>
                  )}
                </div>
              </div>
            );
        })}
      </div>

      {/* Shifts List (Filtered by Visible Week) */}
      <div className="space-y-6 animate-fade-in">
        {calendarDays.map(dateObj => {
          const dateKey = dateObj.toISOString().split('T')[0];
          const daysShifts = groupedShifts[dateKey] || [];
          
          // Only render days that have shifts, or if it is today
          if (daysShifts.length === 0 && !isToday(dateObj)) return null;

          return (
            <div key={dateKey}>
               <h3 className={`font-semibold text-sm mb-3 border-l-4 pl-3 flex items-center gap-2 ${isToday(dateObj) ? 'text-blue-700 border-blue-500' : 'text-gray-700 border-gray-300'}`}>
                 {formatDateHeader(dateObj)}
                 {isToday(dateObj) && <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full">Hari Ini</span>}
               </h3>
               
               <div className="space-y-3">
                 {daysShifts.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-100 border-dashed rounded-xl p-4 text-center text-gray-400 text-xs italic">
                      Tidak ada jadwal ronda.
                    </div>
                 ) : (
                   daysShifts.map(shift => (
                    <div key={shift.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{shift.userName}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <Clock size={12} />
                            {shift.startTime} - {shift.endTime} WIB
                          </div>
                        </div>
                      </div>
                      
                      {/* Status Badge / Dropdown */}
                      {isAdmin && onUpdateShiftStatus ? (
                         <div className="relative">
                            <select
                              value={shift.status}
                              onChange={(e) => onUpdateShiftStatus(shift.id, e.target.value as Shift['status'])}
                              className={`appearance-none py-1.5 pl-3 pr-8 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-blue-400 transition-colors ${getStatusStyle(shift.status)}`}
                            >
                              <option value="scheduled">Terjadwal</option>
                              <option value="active">Bertugas</option>
                              <option value="completed">Selesai</option>
                            </select>
                            {/* Custom arrow for select */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
                              <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                         </div>
                      ) : (
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(shift.status)}`}>
                          {getStatusLabel(shift.status)}
                        </span>
                      )}
                    </div>
                  ))
                 )}
               </div>
            </div>
          );
        })}
        
        {/* Helper message if no shifts in the whole week */}
        {calendarDays.every(d => !groupedShifts[d.toISOString().split('T')[0]]?.length && !isToday(d)) && (
           <div className="text-center py-10">
              <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Tidak ada jadwal aktif minggu ini.</p>
           </div>
        )}
      </div>

      {/* Admin FAB */}
      {isAdmin && (
        <button 
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-24 right-6 w-14 h-14 bg-indigo-600 rounded-full shadow-xl text-white flex items-center justify-center hover:bg-indigo-700 active:scale-90 transition-transform md:bottom-10 md:right-10 z-10"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Add Shift Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50 sticky top-0 bg-white z-10">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Calendar size={18} className="text-indigo-600"/>
                Atur Jadwal Ronda
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200 text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Petugas / Warga</label>
                <div className="relative">
                  <input 
                    type="text"
                    required
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="Masukkan nama petugas..."
                    className="w-full p-3 pl-10 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                  />
                  <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Jaga</label>
                <div className="relative">
                  <input 
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 pr-10 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                  />
                  <button 
                    type="button"
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    className="absolute right-2 top-2 p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                  >
                    <Calendar size={18} />
                  </button>
                </div>

                {/* Custom Date Picker Dropdown */}
                {isDatePickerOpen && (
                   <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-20 p-3 animate-fade-in">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                         <button onClick={handlePickerPrevMonth} className="p-1 hover:bg-gray-100 rounded-full">
                           <ChevronLeft size={16} />
                         </button>
                         <span className="font-bold text-sm text-gray-800">
                           {pickerDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                         </span>
                         <button onClick={handlePickerNextMonth} className="p-1 hover:bg-gray-100 rounded-full">
                           <ChevronRight size={16} />
                         </button>
                      </div>

                      {/* Days Grid */}
                      <div className="grid grid-cols-7 gap-1 text-center mb-1">
                        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
                           <div key={d} className="text-[10px] font-bold text-gray-400 uppercase">{d}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                         {Array.from({ length: getFirstDayOfMonth(pickerDate.getFullYear(), pickerDate.getMonth()) }).map((_, i) => (
                            <div key={`empty-${i}`} className="p-2"></div>
                         ))}
                         {Array.from({ length: getDaysInMonth(pickerDate.getFullYear(), pickerDate.getMonth()) }).map((_, i) => {
                            const day = i + 1;
                            const currentD = new Date(pickerDate.getFullYear(), pickerDate.getMonth(), day);
                            const yyyy = currentD.getFullYear();
                            const mm = String(currentD.getMonth() + 1).padStart(2, '0');
                            const dd = String(day).padStart(2, '0');
                            const dateString = `${yyyy}-${mm}-${dd}`;
                            const isSelected = date === dateString;
                            const isTodayDate = isToday(currentD);

                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => handleDaySelect(day)}
                                className={`p-2 text-xs rounded-lg transition-colors ${
                                  isSelected 
                                    ? 'bg-indigo-600 text-white shadow-md' 
                                    : isTodayDate 
                                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                                      : 'hover:bg-gray-100 text-gray-700'
                                }`}
                              >
                                {day}
                              </button>
                            );
                         })}
                      </div>
                   </div>
                )}
                {/* Backdrop to close picker */}
                {isDatePickerOpen && (
                   <div 
                     className="fixed inset-0 z-10 bg-transparent" 
                     onClick={() => setIsDatePickerOpen(false)}
                   ></div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jam Mulai</label>
                  <input 
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jam Selesai</label>
                  <input 
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;

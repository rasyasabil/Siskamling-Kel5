
import React, { useState } from 'react';
import { Shield, Bell, Users, Clock, AlertTriangle, LogOut, MapPin, X, CheckCircle, Activity, User as UserIcon, Info } from 'lucide-react';
import { AppView, Report, Shift, User, AppNotification } from '../types';

interface DashboardProps {
  user: User;
  setView: (view: AppView) => void;
  recentReports: Report[];
  upcomingShift?: Shift;
  onLogout: () => void;
  onUpdateStatus: (id: string, status: Report['status']) => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, setView, recentReports, upcomingShift, onLogout, onUpdateStatus, 
  notifications, onMarkAsRead, onMarkAllAsRead 
}) => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const canManageReports = user.role === 'admin';
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'processed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleStatusChange = (status: Report['status']) => {
    if (selectedReport) {
      onUpdateStatus(selectedReport.id, status);
      setSelectedReport({ ...selectedReport, status }); // Optimistic update for modal
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8 relative">
      <header className="flex justify-between items-center relative z-20">
        <div className="flex items-center gap-3">
          <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full border border-gray-200" />
          <div>
            <h2 className="text-lg font-bold text-gray-800 leading-tight">Halo, {user.name.split(' ')[0]}</h2>
            <p className="text-xs text-gray-500 capitalize">{user.role === 'admin' ? 'Ketua RT 05' : 'Warga RT 05'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`p-2 rounded-full transition-colors relative ${isNotifOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsNotifOpen(false)}></div>
                <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden animate-fade-in origin-top-right">
                   <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-sm text-gray-700">Notifikasi</h3>
                      {unreadCount > 0 && (
                        <button onClick={onMarkAllAsRead} className="text-[10px] text-blue-600 hover:underline">
                          Tandai baca semua
                        </button>
                      )}
                   </div>
                   <div className="max-h-64 overflow-y-auto">
                     {notifications.length === 0 ? (
                       <div className="p-6 text-center text-gray-400 text-xs">Belum ada notifikasi</div>
                     ) : (
                       notifications.map(notif => (
                         <div 
                            key={notif.id} 
                            onClick={() => onMarkAsRead(notif.id)}
                            className={`p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${!notif.isRead ? 'bg-blue-50/50' : ''}`}
                         >
                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notif.isRead ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                            <div>
                               <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-gray-800' : 'font-medium text-gray-600'}`}>{notif.title}</h4>
                               <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{notif.message}</p>
                               <span className="text-[10px] text-gray-400 mt-1 block">{new Date(notif.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                         </div>
                       ))
                     )}
                   </div>
                </div>
              </>
            )}
          </div>

          <button onClick={onLogout} className="md:hidden p-2 bg-red-50 rounded-full text-red-600 hover:bg-red-100">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Quick Action Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-lg font-semibold mb-2">Ada Kejadian Mendesak?</h3>
          <p className="text-blue-100 mb-4 text-sm max-w-[80%]">
            Laporkan segera kejadian mencurigakan di lingkungan Anda.
          </p>
          <button 
            onClick={() => setView(AppView.REPORTING)}
            className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold text-sm shadow hover:bg-gray-50 transition-colors"
          >
            Buat Laporan Darurat
          </button>
        </div>
        <Shield className="absolute right-[-20px] bottom-[-40px] w-40 h-40 text-white opacity-10 rotate-12" />
      </div>

      {/* Status Highlights */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:border-blue-200 cursor-pointer" onClick={() => setView(AppView.SCHEDULE)}>
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
            <Clock className="text-green-600" size={20} />
          </div>
          <span className="text-xs text-gray-500">Jadwal Ronda</span>
          <span className="font-semibold text-gray-800 text-sm mt-1">
            {upcomingShift ? `${upcomingShift.startTime} Hari Ini` : 'Tidak ada jadwal'}
          </span>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:border-blue-200 cursor-pointer" onClick={() => setView(AppView.FORUM)}>
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
            <Users className="text-purple-600" size={20} />
          </div>
          <span className="text-xs text-gray-500">Forum Warga</span>
          <span className="font-semibold text-gray-800 text-sm mt-1">3 Diskusi Baru</span>
        </div>
      </div>

      {/* Recent Alerts Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Laporan Terkini</h3>
          <button onClick={() => setView(AppView.REPORTING)} className="text-blue-600 text-sm font-medium">Lihat Semua</button>
        </div>
        
        <div className="space-y-3">
          {recentReports.slice(0, 5).map((report) => (
            <div 
              key={report.id} 
              onClick={() => canManageReports && setSelectedReport(report)}
              className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-3 transition-colors ${canManageReports ? 'cursor-pointer hover:border-blue-300 hover:bg-blue-50/30' : ''}`}
            >
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                report.type === 'suspicious' ? 'bg-orange-100 text-orange-600' : 
                report.type === 'theft' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}>
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-gray-800 text-sm capitalize">{report.type.replace('_', ' ')}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border capitalize ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{report.description}</p>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-400">
                  <span>{new Date(report.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}, {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>•</span>
                  <span>{report.location}</span>
                </div>
              </div>
            </div>
          ))}
          {recentReports.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">Belum ada laporan terkini.</div>
          )}
        </div>
      </section>

      {/* Report Detail & Management Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-orange-500" size={20} />
                <h3 className="font-bold text-gray-800 capitalize">Detail Laporan</h3>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-1 hover:bg-gray-200 rounded-full">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                 <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${getStatusColor(selectedReport.status)}`}>
                    Status: {selectedReport.status}
                 </span>
                 <span className="text-xs text-gray-500">
                   {new Date(selectedReport.timestamp).toLocaleString()}
                 </span>
              </div>

              <h4 className="font-bold text-gray-800 text-lg mb-2 capitalize">{selectedReport.type.replace('_', ' ')}</h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
                {selectedReport.description}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-gray-500 block uppercase">Lokasi</span>
                    <span className="text-sm text-gray-800">{selectedReport.location}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <UserIcon size={18} className="text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-gray-500 block uppercase">Pelapor</span>
                    <span className="text-sm text-gray-800">{selectedReport.reporterName}</span>
                  </div>
                </div>
              </div>

              {selectedReport.imageUrl && (
                <div className="mb-6">
                  <span className="text-xs font-bold text-gray-500 block uppercase mb-2">Bukti Foto</span>
                  <img src={selectedReport.imageUrl} alt="Bukti" className="w-full h-40 object-cover rounded-xl border border-gray-200" />
                </div>
              )}

              {selectedReport.aiAnalysis && (
                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                  <span className="text-xs font-bold text-indigo-600 block uppercase mb-1">Analisis AI</span>
                  <p className="text-xs text-indigo-800">{selectedReport.aiAnalysis}</p>
                </div>
              )}
            </div>

            {/* Action Footer for Admin */}
            {canManageReports && selectedReport.status !== 'completed' && (
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                {selectedReport.status === 'pending' && (
                  <button 
                    onClick={() => handleStatusChange('processed')}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Activity size={18} />
                    Proses Laporan
                  </button>
                )}
                {selectedReport.status === 'processed' && (
                  <button 
                    onClick={() => handleStatusChange('completed')}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-green-200 hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Selesaikan Kasus
                  </button>
                )}
              </div>
            )}
            {selectedReport.status === 'completed' && (
               <div className="p-4 border-t border-gray-100 bg-green-50 text-center">
                 <p className="text-green-700 font-medium text-sm flex items-center justify-center gap-2">
                   <CheckCircle size={16} /> Laporan telah diselesaikan
                 </p>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
    
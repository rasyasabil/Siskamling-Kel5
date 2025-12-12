
import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Info, AlertCircle } from 'lucide-react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Reporting from './components/Reporting';
import Schedule from './components/Schedule';
import Forum from './components/Forum';
import Contacts from './components/Contacts';
import AiAssistant from './components/AiAssistant';
import Auth from './components/Auth';
import { AppView, Report, User, ForumPost, Comment, Shift, AppNotification } from './types';
import { MOCK_REPORTS, MOCK_SHIFTS, MOCK_POSTS, MOCK_CONTACTS, MOCK_NOTIFICATIONS } from './services/mockData';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setView] = useState<AppView>(AppView.DASHBOARD);
  
  // Data States
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [posts, setPosts] = useState<ForumPost[]>(MOCK_POSTS);
  const [shifts, setShifts] = useState<Shift[]>(MOCK_SHIFTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);

  // Toast State
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info' | 'alert'} | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Global Notification Helper
  const addNotification = (title: string, message: string, type: 'success' | 'info' | 'alert' = 'info') => {
    const newNotif: AppNotification = {
      id: `n_${Date.now()}`,
      title,
      message,
      type,
      timestamp: Date.now(),
      isRead: false
    };
    
    setNotifications(prev => [newNotif, ...prev]);
    setToast({ message, type });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };
  
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleReportSubmit = (newReportData: Omit<Report, 'id' | 'timestamp' | 'status'>) => {
    const newReport: Report = {
      ...newReportData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      status: 'pending'
    };
    setReports([newReport, ...reports]);
    addNotification('Laporan Terkirim', 'Laporan Anda berhasil dikirim ke petugas.', 'success');
    setView(AppView.DASHBOARD);
  };

  const handleUpdateReportStatus = (id: string, status: Report['status']) => {
    setReports(prevReports => 
      prevReports.map(report => 
        report.id === id ? { ...report, status } : report
      )
    );
    addNotification('Status Diperbarui', `Status laporan diubah menjadi ${status}.`, 'info');
  };

  const handleAddPost = (postData: { title: string; content: string; category: ForumPost['category'] }) => {
    if (!user) return;
    
    const newPost: ForumPost = {
      id: Math.random().toString(36).substr(2, 9),
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      category: postData.category,
      title: postData.title,
      content: postData.content,
      timestamp: Date.now(),
      likes: 0,
      isLiked: false,
      isReported: false,
      comments: []
    };

    setPosts([newPost, ...posts]);
    addNotification('Postingan Dibuat', 'Diskusi baru berhasil ditambahkan ke forum.', 'success');
  };

  // --- LOGIKA HAPUS POST ---
  const handleDeletePost = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    addNotification('Postingan Dihapus', 'Diskusi telah dihapus dari forum.', 'info');
  };

  const handleLikePost = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string, content: string) => {
    if (!user) return;

    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      authorName: user.name,
      authorAvatar: user.avatar,
      content: content,
      timestamp: Date.now()
    };

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    );
    addNotification('Komentar Ditambahkan', 'Komentar Anda telah diposting.', 'success');
  };

  const handleAddShift = (newShiftData: Omit<Shift, 'id' | 'status'>) => {
    const newShift: Shift = {
      ...newShiftData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'scheduled'
    };
    setShifts([...shifts, newShift]);
    addNotification('Jadwal Disimpan', `Jadwal ronda untuk ${newShift.userName} berhasil ditambahkan.`, 'success');
  };

  const handleUpdateShiftStatus = (id: string, status: Shift['status']) => {
    setShifts(prevShifts => 
      prevShifts.map(shift => 
        shift.id === id ? { ...shift, status } : shift
      )
    );
    addNotification('Jadwal Diperbarui', 'Status petugas berhasil diubah.', 'info');
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    addNotification(`Selamat Datang, ${loggedInUser.name.split(' ')[0]}!`, 'Anda berhasil masuk ke Siskamling Online.', 'success');
  };

  const handleLogout = () => {
    setUser(null);
    setView(AppView.DASHBOARD);
    setToast(null);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard 
          user={user}
          setView={setView} 
          recentReports={reports} 
          upcomingShift={MOCK_SHIFTS[0]} 
          onLogout={handleLogout}
          onUpdateStatus={handleUpdateReportStatus}
          notifications={notifications}
          onMarkAsRead={markNotificationAsRead}
          onMarkAllAsRead={markAllNotificationsAsRead}
        />;
      case AppView.REPORTING:
        return <Reporting 
          onSubmit={handleReportSubmit} 
          userLocation="Jl. Merpati No. 4, RT 05 (Detected)"
          onNotify={(t, m, type) => addNotification(t, m, type)}
          reports={reports}
        />;
      case AppView.SCHEDULE:
        return <Schedule 
          shifts={shifts} 
          user={user} 
          onAddShift={handleAddShift} 
          onUpdateShiftStatus={handleUpdateShiftStatus}
        />;
      case AppView.FORUM:
        return <Forum 
          posts={posts} 
          userRole={user.role} 
          onAddPost={handleAddPost} 
          onDeletePost={handleDeletePost} // Pass fungsi hapus
          onLikePost={handleLikePost}
          onAddComment={handleAddComment}
        />;
      case AppView.CONTACTS:
        return <Contacts contacts={MOCK_CONTACTS} />;
      case AppView.AI_ASSISTANT:
        return <AiAssistant />;
      default:
        return <Dashboard 
          user={user} 
          setView={setView} 
          recentReports={reports} 
          onLogout={handleLogout}
          onUpdateStatus={handleUpdateReportStatus}
          notifications={notifications}
          onMarkAsRead={markNotificationAsRead}
          onMarkAllAsRead={markAllNotificationsAsRead}
        />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-inter">
      <Navigation currentView={currentView} setView={setView} onLogout={handleLogout} />
      
      <main className="flex-1 h-full overflow-y-auto no-scrollbar relative w-full">
        <div className="p-5 max-w-2xl mx-auto h-full min-h-full">
          {renderView()}
        </div>

        {/* Global Toast Notification */}
        {toast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] animate-fade-in-down w-[90%] max-w-sm">
             <div className={`shadow-lg rounded-xl p-4 flex items-center gap-3 border ${
               toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
               toast.type === 'alert' ? 'bg-red-50 border-red-200 text-red-800' :
               'bg-blue-50 border-blue-200 text-blue-800'
             }`}>
                {toast.type === 'success' && <CheckCircle size={20} className="text-green-600 shrink-0" />}
                {toast.type === 'alert' && <AlertCircle size={20} className="text-red-600 shrink-0" />}
                {toast.type === 'info' && <Info size={20} className="text-blue-600 shrink-0" />}
                <p className="text-sm font-medium flex-1">{toast.message}</p>
                <button onClick={() => setToast(null)}><X size={16} className="opacity-50" /></button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

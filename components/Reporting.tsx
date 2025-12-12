import React, { useState } from 'react';
import { Camera, MapPin, Send, Loader2, Sparkles, AlertTriangle, Filter, History, PenTool, CheckCircle, Clock } from 'lucide-react';
import { Report } from '../types';
import { analyzeSecurityReport } from '../services/geminiService';

interface ReportingProps {
  onSubmit: (report: Omit<Report, 'id' | 'timestamp' | 'status'>) => void;
  userLocation: string;
  onNotify?: (title: string, message: string, type: 'success' | 'info' | 'alert') => void;
  reports: Report[]; // Added to receive list of reports
}

const Reporting: React.FC<ReportingProps> = ({ onSubmit, userLocation, onNotify, reports }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  
  // Create Report State
  const [type, setType] = useState<Report['type']>('suspicious');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(userLocation);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Filter State
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get AI analysis if not already done
    let finalAdvice = aiAdvice;
    if (!finalAdvice && description.length > 5) {
       finalAdvice = await analyzeSecurityReport(description, type);
    }

    onSubmit({
      type,
      description,
      location,
      reporterName: 'Warga (Anda)',
      imageUrl: file ? URL.createObjectURL(file) : undefined,
      aiAnalysis: finalAdvice || undefined
    });
    
    setIsSubmitting(false);
    // Switch to history view after submitting
    setActiveTab('history');
  };

  const handleAiCheck = async () => {
    if (!description) return;
    setIsAnalyzing(true);
    const advice = await analyzeSecurityReport(description, type);
    setAiAdvice(advice);
    setIsAnalyzing(false);
  };

  const filteredReports = reports.filter(r => {
    const statusMatch = filterStatus === 'all' || r.status === filterStatus;
    const typeMatch = filterType === 'all' || r.type === filterType;
    return statusMatch && typeMatch;
  });

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'processed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="pb-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Layanan Laporan</h2>
      </div>
      
      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'create' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <PenTool size={16} />
          Buat Laporan
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <History size={16} />
          Riwayat
        </button>
      </div>
      
      {activeTab === 'create' ? (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          {/* Incident Type */}
          <div className="grid grid-cols-2 gap-3">
            {(['suspicious', 'guest', 'theft', 'other'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`p-3 rounded-lg border text-sm font-medium capitalize transition-all ${
                  type === t
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t === 'suspicious' ? 'Mencurigakan' : 
                 t === 'guest' ? 'Tamu Asing' : 
                 t === 'theft' ? 'Pencurian' : 'Lainnya'}
              </button>
            ))}
          </div>

          {/* Description & AI Analysis */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Deskripsi Kejadian</label>
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ceritakan kronologi singkat..."
                className="w-full p-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] text-sm"
                required
              />
              {description.length > 5 && !aiAdvice && (
                <button
                  type="button"
                  onClick={handleAiCheck}
                  disabled={isAnalyzing}
                  className="absolute bottom-3 right-3 text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-indigo-100 transition-colors"
                >
                  {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  Cek Keamanan AI
                </button>
              )}
            </div>
            
            {/* AI Advice Card */}
            {aiAdvice && (
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 animate-fade-in">
                <div className="flex items-start gap-3">
                  <Sparkles className="text-indigo-600 shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wide mb-1">Analisis AI</h4>
                    <p className="text-sm text-indigo-900 leading-relaxed">{aiAdvice}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Lokasi</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 p-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button type="button" className="px-3 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50" onClick={() => setLocation("Jl. Merpati No. 4, RT 05")}>
                <MapPin size={18} />
              </button>
            </div>
          </div>

          {/* Media Upload */}
          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-700">Bukti Foto (Opsional)</label>
             <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                {file ? (
                  <div className="relative w-full h-full p-2">
                     <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                     <button 
                      type="button"
                      onClick={(e) => { e.preventDefault(); setFile(null); }}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                     >
                       X
                     </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Camera className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-xs text-gray-500">Tap untuk ambil foto</p>
                  </div>
                )}
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                />
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            Kirim Laporan
          </button>
        </form>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {/* Filters */}
          <div className="flex gap-2 mb-4">
             <div className="relative flex-1">
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full p-2.5 pl-3 pr-8 rounded-lg border border-gray-200 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu</option>
                  <option value="processed">Diproses</option>
                  <option value="completed">Selesai</option>
                </select>
                <Filter className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={14} />
             </div>
             <div className="relative flex-1">
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full p-2.5 pl-3 pr-8 rounded-lg border border-gray-200 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                >
                  <option value="all">Semua Tipe</option>
                  <option value="suspicious">Mencurigakan</option>
                  <option value="guest">Tamu Asing</option>
                  <option value="theft">Pencurian</option>
                  <option value="other">Lainnya</option>
                </select>
                <Filter className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={14} />
             </div>
          </div>

          {/* List */}
          {filteredReports.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-gray-100">
               <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                 <History className="text-gray-400" />
               </div>
               <p className="text-gray-500 text-sm">Tidak ada laporan yang ditemukan.</p>
            </div>
          ) : (
            <div className="space-y-3">
               {filteredReports.map(report => (
                 <div key={report.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                       <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(report.status)}`}>
                         {report.status}
                       </span>
                       <span className="text-[10px] text-gray-400 flex items-center gap-1">
                         <Clock size={10} />
                         {new Date(report.timestamp).toLocaleString()}
                       </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm capitalize mb-1 flex items-center gap-2">
                       <AlertTriangle size={14} className={report.type === 'suspicious' ? 'text-orange-500' : 'text-blue-500'} />
                       {report.type.replace('_', ' ')}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">{report.description}</p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 bg-gray-50 p-2 rounded-lg">
                       <MapPin size={10} />
                       {report.location}
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reporting;
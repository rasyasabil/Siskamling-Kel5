
import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Plus, Trash2, X, Send } from 'lucide-react';
import { ForumPost, UserRole } from '../types';

interface ForumProps {
  posts: ForumPost[];
  userRole: UserRole;
  onAddPost: (data: { title: string; content: string; category: ForumPost['category'] }) => void;
  onDeletePost: (postId: string) => void; // Menambahkan prop baru
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, content: string) => void;
}

const Forum: React.FC<ForumProps> = ({ posts, userRole, onAddPost, onDeletePost, onLikePost, onAddComment }) => {
  // Create Post Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<ForumPost['category']>('general');

  // Comment Modal State
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onAddPost({
      title: newTitle,
      content: newContent,
      category: newCategory
    });

    // Reset and close
    setNewTitle('');
    setNewContent('');
    setNewCategory('general');
    setIsModalOpen(false);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePostId || !commentInput.trim()) return;
    
    onAddComment(activePostId, commentInput);
    setCommentInput('');
  };

  const activePost = posts.find(p => p.id === activePostId);

  return (
    <div className="pb-24 relative min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Forum Warga</h2>
        {/* Filter button removed */}
      </div>

      <div className="space-y-4">
        {posts.map((post) => {
          return (
            <div 
              key={post.id} 
              className="rounded-xl shadow-sm border transition-all relative overflow-hidden bg-white border-gray-100"
            >
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  {post.authorAvatar ? (
                    <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full text-white flex items-center justify-center font-bold text-sm">
                      {post.authorName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{post.authorName}</p>
                    <p className="text-xs text-gray-400">{new Date(post.timestamp).toLocaleDateString()}</p>
                  </div>
                  <span className={`ml-auto px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${
                    post.category === 'announcement' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {post.category}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-800 mb-2">{post.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {post.content}
                </p>

                {/* Actions Footer */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-3">
                  <div className="flex items-center gap-4">
                    <button 
                        onClick={() => onLikePost(post.id)}
                        className={`flex items-center gap-1.5 text-sm transition-colors ${
                          post.isLiked ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-blue-600'
                        }`}
                    >
                      <ThumbsUp size={16} className={post.isLiked ? "fill-blue-100" : ""} />
                      <span>{post.likes}</span>
                    </button>
                    <button 
                        onClick={() => setActivePostId(post.id)}
                        className="flex items-center gap-1.5 text-sm transition-colors text-gray-500 hover:text-blue-600"
                    >
                      <MessageSquare size={16} />
                      <span>{post.comments.length} Komentar</span>
                    </button>
                  </div>

                  {/* Delete Button for Admin */}
                  {userRole === 'admin' && (
                    <button 
                      onClick={() => {
                        if (window.confirm('Apakah Anda yakin ingin menghapus diskusi ini?')) {
                          onDeletePost(post.id);
                        }
                      }}
                      className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
                      title="Hapus Diskusi"
                    >
                      <Trash2 size={16} />
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAB */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 rounded-full shadow-xl text-white flex items-center justify-center hover:bg-blue-700 active:scale-90 transition-transform md:bottom-10 md:right-10 z-10"
      >
        <Plus size={24} />
      </button>

      {/* Create Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-800">Buat Postingan Baru</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200 text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitPost} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Diskusi</label>
                <input 
                  type="text" 
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Lampu jalan mati..."
                  className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCategory('general')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                      newCategory === 'general' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    Umum
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCategory('security')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                      newCategory === 'security' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    Keamanan
                  </button>
                  {userRole === 'admin' && (
                    <button
                      type="button"
                      onClick={() => setNewCategory('announcement')}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                        newCategory === 'announcement' ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      Pengumuman
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Isi Pesan</label>
                <textarea 
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Tuliskan detail diskusi di sini..."
                  className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none h-32 text-sm resize-none"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Posting Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {activePostId && activePost && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center backdrop-blur-sm animate-fade-in sm:p-4">
            <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl h-[80vh] md:h-[600px] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-gray-800">Komentar</h3>
                    <button onClick={() => setActivePostId(null)} className="p-1 hover:bg-gray-200 rounded-full text-gray-500">
                        <X size={20} />
                    </button>
                </div>
                
                {/* Post Summary */}
                <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                    <p className="font-semibold text-gray-800 text-sm line-clamp-1">{activePost.title}</p>
                    <p className="text-gray-500 text-xs line-clamp-2 mt-1">{activePost.content}</p>
                </div>

                {/* Comment List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {activePost.comments.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 text-sm">Belum ada komentar. Jadilah yang pertama!</div>
                    ) : (
                        activePost.comments.map(comment => (
                            <div key={comment.id} className="flex gap-3">
                                <img src={comment.authorAvatar} alt={comment.authorName} className="w-8 h-8 rounded-full border border-gray-200" />
                                <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-xs text-gray-800">{comment.authorName}</span>
                                        <span className="text-[10px] text-gray-500">{new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Comment Input */}
                <form onSubmit={handleSubmitComment} className="p-4 border-t border-gray-100 flex gap-2 items-center bg-white">
                    <input 
                        type="text" 
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Tulis komentar..." 
                        className="flex-1 p-3 bg-white border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                    <button 
                        type="submit" 
                        disabled={!commentInput.trim()}
                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
          </div>
      )}
    </div>
  );
};

export default Forum;

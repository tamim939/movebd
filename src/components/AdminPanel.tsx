import React from 'react';
import { Plus, Trash2, Edit2, Link, Play, Save, X, PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Movie, Category, DownloadLink } from '../types';
import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';

export default function AdminPanel({ categories }: { categories: string[] }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newMovie, setNewMovie] = useState<Partial<Movie>>({
    category: categories.find(c => c !== 'All') || 'Movie',
    isPremium: false,
    adLink: '',
    downloadLinks: [{ label: 'Download Server 1', url: '' }]
  });

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "movies"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const moviesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Movie[];
      setMovies(moviesData);
    } catch (e) {
      console.error("Error fetching movies:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    if (categories.includes(newCategory.trim())) {
      alert("Category already exists");
      return;
    }

    try {
      const newList = [...categories, newCategory.trim()];
      await updateDoc(doc(db, "settings", "categories"), {
        list: newList
      }).catch(async (err) => {
        // If doc doesn't exist, set it
        if (err.code === 'not-found') {
          const { setDoc } = await import('firebase/firestore');
          await setDoc(doc(db, "settings", "categories"), { list: newList });
        }
      });
      setNewCategory('');
    } catch (e) {
      console.error("Error adding category:", e);
    }
  };

  const handleDeleteCategory = async (cat: string) => {
    if (cat === 'All') return;
    if (!window.confirm(`Delete category "${cat}"? Movies in this category won't be deleted but will be uncategorized.`)) return;

    try {
      const newList = categories.filter(c => c !== cat);
      await updateDoc(doc(db, "settings", "categories"), {
        list: newList
      });
    } catch (e) {
      console.error("Error deleting category:", e);
    }
  };

  const handleAdd = async () => {
    if (newMovie.title && newMovie.thumbnail && newMovie.adLink) {
      try {
        if (editingId) {
          await updateDoc(doc(db, "movies", editingId), {
            ...newMovie,
            updatedAt: serverTimestamp()
          });
        } else {
          await addDoc(collection(db, "movies"), {
            ...newMovie,
            createdAt: serverTimestamp()
          });
        }
        setIsAdding(false);
        setEditingId(null);
        setNewMovie({ 
          category: 'Movie', 
          isPremium: false, 
          adLink: '', 
          downloadLinks: [{ label: 'Download Server 1', url: '' }] 
        });
        fetchMovies();
      } catch (e) {
        console.error("Error saving movie:", e);
      }
    }
  };

  const handleEdit = (movie: Movie) => {
    setNewMovie({
      title: movie.title,
      thumbnail: movie.thumbnail,
      description: movie.description,
      category: movie.category,
      adLink: movie.adLink,
      isPremium: movie.isPremium,
      downloadLinks: movie.downloadLinks || [{ label: 'Download Server 1', url: '' }]
    });
    setEditingId(movie.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await deleteDoc(doc(db, "movies", id));
        fetchMovies();
      } catch (e) {
        console.error("Error deleting movie:", e);
      }
    }
  };

  const addDownloadLink = () => {
    setNewMovie({
      ...newMovie,
      downloadLinks: [...(newMovie.downloadLinks || []), { label: `Download Server ${(newMovie.downloadLinks?.length || 0) + 1}`, url: '' }]
    });
  };

  const updateDownloadLink = (index: number, field: keyof DownloadLink, value: string) => {
    const links = [...(newMovie.downloadLinks || [])];
    links[index] = { ...links[index], [field]: value };
    setNewMovie({ ...newMovie, downloadLinks: links });
  };

  const removeDownloadLink = (index: number) => {
    const links = [...(newMovie.downloadLinks || [])];
    links.splice(index, 1);
    setNewMovie({ ...newMovie, downloadLinks: links });
  };

  return (
    <div className="p-6 pb-32 min-h-screen bg-zinc-950 text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter">ADMIN <span className="text-red-600">DASHBOARD</span></h2>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Manage Content & Links</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsManagingCategories(!isManagingCategories)}
            className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-black shadow-xl active:scale-95 transition-all ${isManagingCategories ? 'bg-zinc-800 text-white' : 'bg-red-600/10 text-red-500'}`}
          >
            {isManagingCategories ? <X className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
            {isManagingCategories ? 'CLOSE' : 'CATEGORIES'}
          </button>
          <button 
            onClick={() => {
              if (isAdding) {
                setEditingId(null);
                setNewMovie({ 
                  category: categories.find(c => c !== 'All') || 'Movie', 
                  isPremium: false, 
                  adLink: '', 
                  downloadLinks: [{ label: 'Download Server 1', url: '' }] 
                });
              }
              setIsAdding(!isAdding);
              setIsManagingCategories(false);
            }}
            className="flex items-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-sm font-black shadow-xl shadow-red-900/40 active:scale-95 transition-all"
          >
            {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {isAdding ? 'CANCEL' : 'ADD CONTENT'}
          </button>
        </div>
      </div>

      {isManagingCategories && (
        <div className="mb-8 space-y-6 rounded-[32px] bg-zinc-900/50 p-8 border border-white/5 shadow-2xl backdrop-blur-xl">
           <h3 className="text-sm font-black text-red-600 uppercase tracking-widest">Manage Categories</h3>
           
           <div className="flex gap-2">
             <input 
               type="text" 
               placeholder="New Category Name..."
               className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
               value={newCategory}
               onChange={e => setNewCategory(e.target.value)}
             />
             <button 
               onClick={handleAddCategory}
               className="rounded-xl bg-red-600 px-6 py-3 text-xs font-black uppercase"
             >
               Add
             </button>
           </div>

           <div className="flex flex-wrap gap-2 mt-4">
             {categories.map(cat => (
               <div key={cat} className="flex items-center gap-2 rounded-full bg-zinc-800 px-4 py-2 border border-white/5 group">
                 <span className="text-[10px] font-black uppercase text-zinc-400">{cat}</span>
                 {cat !== 'All' && (
                   <button 
                     onClick={() => handleDeleteCategory(cat)}
                     className="text-zinc-600 hover:text-red-500 transition-colors"
                   >
                     <X className="h-3 w-3" />
                   </button>
                 )}
               </div>
             ))}
           </div>
        </div>
      )}

      {isAdding && (
        <div className="mb-8 space-y-6 rounded-[32px] bg-zinc-900/50 p-8 border border-white/5 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2 ml-1">Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Karuppu (2026) Movie"
                  className="w-full rounded-2xl bg-zinc-800 px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600 border border-white/5"
                  value={newMovie.title || ''}
                  onChange={e => setNewMovie({...newMovie, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2 ml-1">Thumbnail Image URL</label>
                <input 
                  type="text" 
                  placeholder="https://..."
                  className="w-full rounded-2xl bg-zinc-800 px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600 border border-white/5"
                  value={newMovie.thumbnail || ''}
                  onChange={e => setNewMovie({...newMovie, thumbnail: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2 ml-1">Short Description</label>
                <textarea 
                  placeholder="Write a brief intro..."
                  className="w-full rounded-2xl bg-zinc-800 px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600 border border-white/5 min-h-[100px]"
                  value={newMovie.description || ''}
                  onChange={e => setNewMovie({...newMovie, description: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2 ml-1">Category</label>
                <select 
                  className="w-full rounded-2xl bg-zinc-800 px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600 border border-white/5"
                  value={newMovie.category}
                  onChange={e => setNewMovie({...newMovie, category: e.target.value})}
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2 ml-1">Redirect/Ad Link (10s Timer)</label>
                <div className="relative">
                  <Link className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="https://tvprobd.vercel.app"
                    className="w-full rounded-2xl bg-zinc-800 py-4 pr-5 pl-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600 border border-white/5"
                    value={newMovie.adLink || ''}
                    onChange={e => setNewMovie({...newMovie, adLink: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-800/50 border border-white/5">
                <input 
                  type="checkbox" 
                  id="isPremium"
                  checked={newMovie.isPremium}
                  onChange={e => setNewMovie({...newMovie, isPremium: e.target.checked})}
                  className="h-5 w-5 rounded-lg accent-red-600"
                />
                <label htmlFor="isPremium" className="text-xs font-bold text-white uppercase tracking-tight">VIP Content Only</label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-black text-zinc-500 uppercase ml-1">Target Download Links</label>
              <button 
                onClick={addDownloadLink}
                className="text-[10px] font-black text-red-500 flex items-center gap-1 hover:text-red-400"
              >
                <PlusCircle className="h-3 w-3" /> ADD ANOTHER LINK
              </button>
            </div>
            {newMovie.downloadLinks?.map((link, index) => (
              <div key={index} className="flex gap-3 items-start bg-black/20 p-4 rounded-2xl border border-white/5">
                <div className="flex-1 space-y-2">
                   <input 
                    type="text" 
                    placeholder="Link Label (e.g. Download 720p)"
                    className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-xs text-white focus:outline-none"
                    value={link.label}
                    onChange={e => updateDownloadLink(index, 'label', e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder="Target URL (e.g. Mega Link)"
                    className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-xs text-white focus:outline-none"
                    value={link.url}
                    onChange={e => updateDownloadLink(index, 'url', e.target.value)}
                  />
                </div>
                {index > 0 && (
                  <button 
                    onClick={() => removeDownloadLink(index)}
                    className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button 
            onClick={handleAdd}
            className="w-full rounded-2xl bg-red-600 py-4 text-sm font-black shadow-2xl shadow-red-900/40 hover:bg-red-500 transition-all active:scale-[0.98]"
          >
            {editingId ? 'UPDATE CONTENT' : 'PUBLISH CONTENT'}
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex py-20 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 px-1">Recent Posts ({movies.length})</h3>
          {movies.map(movie => (
            <div key={movie.id} className="group flex items-center gap-4 rounded-3xl bg-zinc-900/50 p-3 border border-white/5 hover:bg-zinc-900 transition-all">
              <div className="relative h-20 w-20 shrink-0">
                <img src={movie.thumbnail} alt="" className="h-full w-full rounded-2xl object-cover" />
                {movie.isPremium && <div className="absolute top-1 left-1 bg-yellow-500 text-[8px] font-black text-black px-1.5 rounded-md">VIP</div>}
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="line-clamp-1 font-bold text-white text-sm">{movie.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-zinc-500 font-black uppercase px-2 py-0.5 rounded-lg bg-zinc-800">{movie.category}</span>
                  <span className="text-[10px] text-zinc-400 font-medium truncate max-w-[100px]">{movie.adLink}</span>
                </div>
              </div>
              <div className="flex gap-2 pr-2">
                <button 
                  onClick={() => handleEdit(movie)}
                  className="rounded-xl bg-zinc-800 p-3 text-white hover:bg-white hover:text-black transition-all"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(movie.id)}
                  className="rounded-xl bg-red-600/10 p-3 text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {movies.length === 0 && (
            <div className="py-20 text-center rounded-[32px] border-2 border-dashed border-white/5">
               <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No content found</p>
               <button onClick={() => setIsAdding(true)} className="mt-4 text-red-500 text-xs font-black">Add your first post</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

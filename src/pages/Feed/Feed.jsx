import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { getAllPosts, createPost } from "../../services/posts";
import { getSuggestions, followUnfollow } from "../../services/auth";
import Navbar from "../../components/Navbar";
import PostCard from "../../components/PostCard";
import { Home, Sparkles, Users, Bookmark, Globe, Image as ImageIcon, Smile, Send, Check, Search, UserPlus } from "lucide-react";

export default function Feed() {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [posting, setPosting] = useState(false);
  const [followLoading, setFollowLoading] = useState({});
  const fileRef = useRef();

  const userName = user?.user?.name || user?.name || "User";
  const userPhoto = user?.user?.photo || user?.photo || null;

  async function fetchFeed() {
    const res = await getAllPosts();
    if (res?.data?.posts) setPosts(res.data.posts);
    setLoading(false);
  }

  async function fetchSuggestions() {
    const res = await getSuggestions();
    if (res?.data?.suggestions) setSuggestions(res.data.suggestions);
  }

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      await fetchFeed();
      if (mounted) await fetchSuggestions();
    }
    loadData();
    return () => { mounted = false; };
  }, []);

  async function handlePost() {
    if (!content.trim() && !image) return;
    setPosting(true);
    const fd = new FormData();
    fd.append("body", content);
    if (image) fd.append("image", image);
    await createPost(fd);
    setContent("");
    setImage(null);
    await fetchFeed();
    setPosting(false);
  }

  async function handleFollow(userId) {
    setFollowLoading(p => ({ ...p, [userId]: true }));
    await followUnfollow(userId);
    await fetchSuggestions();
    setFollowLoading(p => ({ ...p, [userId]: false }));
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[var(--color-gray-900)] dark:!bg-[#0B1120] transition-colors">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">

        <div className="col-span-3 hidden lg:flex flex-col gap-2">
          {[
            [<Home size={20} />, "Feed", "/feed"],
            [<Sparkles size={20} />, "My Posts", "/profile"],
            [<Users size={20} />, "Community", "/feed"],
            [<Bookmark size={20} />, "Saved", "/profile"]
          ].map(([icon, label, path]) => (
            <a key={label} href={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
                ${label === "Feed" ? "bg-blue-50 text-blue-700 dark:bg-gray-700 dark:text-white font-semibold" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-white shadow-sm"}`}>
              {icon} <span>{label}</span>
            </a>
          ))}
        </div>

        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={userPhoto || `https://ui-avatars.com/api/?name=${userName}&background=1a237e&color=fff`}
                className="w-10 h-10 rounded-full object-cover"
                alt={userName}
              />
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{userName}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  <Globe size={12} /><span>Public</span><span>▾</span>
                </div>
              </div>
            </div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={`What's on your mind, ${userName}?`}
              className="w-full resize-none border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-transparent outline-none focus:border-blue-400 dark:text-white transition"
              rows={3}
            />
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 mt-3">
              <div className="flex items-center gap-4">
                <button onClick={() => fileRef.current.click()}
                  className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                  <ImageIcon size={18} className="text-green-500" /> Photo/video
                </button>
                <button className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition">
                  <Smile size={18} className="text-yellow-500" /> Feeling/activity
                </button>
                {image && <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1"><Check size={14} /> {image.name}</span>}
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => setImage(e.target.files[0])} />
              </div>
              <button onClick={handlePost} disabled={posting || (!content.trim() && !image)}
                className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-blue-800 hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-1.5">
                {posting ? "Posting..." : <><span>Post</span><Send size={16} /></>}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-400 dark:text-gray-500">Loading feed...</div>
          ) : posts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center text-gray-400 dark:text-gray-500 shadow-sm transition-colors">
              No posts yet. Be the first one to publish!
            </div>
          ) : (
            posts.map(p => <PostCard key={p._id} post={p} onUpdate={fetchFeed} />)
          )}
        </div>

        <div className="col-span-3 hidden lg:block">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <Users size={18} className="text-blue-600 dark:text-blue-400" /> Suggested Friends
              </p>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">
                {suggestions.length}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 mb-4 transition-colors">
              <Search size={16} className="text-gray-400" />
              <input className="bg-transparent text-sm outline-none flex-1 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" placeholder="Search friends..." />
            </div>

            <div className="flex flex-col gap-4">
              {suggestions.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">No suggestions yet</p>
              ) : (
                suggestions.map(s => (
                  <div key={s._id} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={s.photo || `https://ui-avatars.com/api/?name=${s.name}&background=1a237e&color=fff`}
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                          alt={s.name}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{s.name}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">@{s.username || s.name}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFollow(s._id)}
                        disabled={followLoading[s._id]}
                        className="flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-xl transition disabled:opacity-50 shrink-0">
                        {followLoading[s._id] ? "..." : <><UserPlus size={14} /> Follow</>}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 pl-12 text-xs text-gray-400">
                      <span>{s.followersCount || 0} followers</span>
                      {s.mutualFollowersCount > 0 && (
                        <span>· {s.mutualFollowersCount} mutual</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {suggestions.length > 0 && (
              <button className="w-full mt-4 text-sm text-blue-600 hover:underline text-center">
                View more
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
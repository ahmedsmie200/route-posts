import { useEffect, useRef, useState } from "react";
import { getMyProfile, getUserPosts, uploadProfilePhoto } from "../../services/auth";
import Navbar from "../../components/Navbar";
import PostCard from "../../components/PostCard";
import { Camera, Mail, User, FileText, Bookmark } from "lucide-react";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts"); 
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const photoRef = useRef();

  async function fetchPosts(userId) {
    const res = await getUserPosts(userId);
    if (res?.data?.posts) setPosts(res.data.posts);
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("photo", file);
    const res = await uploadProfilePhoto(fd);
    if (res?.data?.user) setProfile(res.data.user);
    setUploading(false);
  }

  useEffect(() => {
    let mounted = true;
    async function initProfile() {
      const res = await getMyProfile();
      if (res?.data?.user && mounted) {
        setProfile(res.data.user);
        const postsRes = await getUserPosts(res.data.user._id);
        if (postsRes?.data?.posts && mounted) setPosts(postsRes.data.posts);
      }
      if (mounted) setLoading(false);
    }
    initProfile();
    return () => { mounted = false; };
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0B1120] transition-colors">
      <Navbar />
      <div className="flex justify-center items-center h-64 text-gray-400 dark:text-gray-500">Loading profile...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0B1120] transition-colors">
      <Navbar />

      <div className="w-full h-48 bg-gradient-to-r from-blue-900 to-blue-500 dark:from-blue-950 dark:to-blue-800 transition-colors" />

      <div className="max-w-4xl mx-auto px-4 -mt-16 pb-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6 transition-colors">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="relative">
              <img
                src={profile?.photo || `https://ui-avatars.com/api/?name=${profile?.name}&background=1a237e&color=fff&size=128`}
                alt={profile?.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md transition-colors"
              />
              <button
                onClick={() => photoRef.current.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-800 dark:bg-blue-600 text-white rounded-full flex items-center justify-center text-xs shadow hover:bg-blue-700 dark:hover:bg-blue-500 transition">
                {uploading ? "..." : <Camera size={14} />}
              </button>
              <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{profile?.name}</h1>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-3">@{profile?.username}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                <Mail size={14} /><span>{profile?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <User size={14} /><span>Active on A-book</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[
                ["FOLLOWERS", profile?.followersCount || 0],
                ["FOLLOWING", profile?.followingCount || 0],
                ["BOOKMARKS", profile?.bookmarksCount || 0],
              ].map(([label, val]) => (
                <div key={label} className="text-center bg-gray-50 dark:bg-gray-900/50 rounded-xl px-4 py-3 transition-colors">
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{val}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <span className="inline-flex items-center gap-1.5 text-sm text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              <User size={14} /> A-book member
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold tracking-widest mb-1">MY POSTS</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{posts.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold tracking-widest mb-1">SAVED POSTS</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{profile?.bookmarksCount || 0}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4 transition-colors">
          <div className="flex">
            {[["posts", <><FileText size={16} /> My Posts</>], ["saved", <><Bookmark size={16} /> Saved</>]].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition rounded-2xl
                  ${activeTab === key ? "text-blue-800 dark:text-blue-400 border-b-2 border-blue-800 dark:border-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
                {label}
                {key === "posts" && <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">{posts.length}</span>}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "posts" && (
          <div className="flex flex-col gap-4">
            {posts.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center text-gray-400 dark:text-gray-500 shadow-sm transition-colors">
                You have not posted yet.
              </div>
            ) : (
              posts.map(p => <PostCard key={p._id} post={p} onUpdate={() => fetchPosts(profile._id)} />)
            )}
          </div>
        )}

        {activeTab === "saved" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center text-gray-400 dark:text-gray-500 shadow-sm transition-colors">
            Saved posts coming soon...
          </div>
        )}
      </div>
    </div>
  );
}
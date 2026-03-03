import { useState } from "react";
import { toggleLike } from "../services/posts";
import { Globe, ThumbsUp, Repeat, MessageSquare, MoreHorizontal, Bookmark, Edit, Trash2 } from "lucide-react";

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function PostCard({ post, onUpdate }) {
  const [loadingLike, setLoadingLike] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user?._id || user?._id;

  const isLiked = post.likes?.includes(userId);

  async function handleLike() {
    setLoadingLike(true);
    await toggleLike(post._id);
    onUpdate();
    setLoadingLike(false);
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <img
            src={post.user?.photo || `https://ui-avatars.com/api/?name=${post.user?.name}&background=1a237e&color=fff`}
            alt={post.user?.name}
            className="w-11 h-11 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{post.user?.name}</p>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span>@{post.user?.username}</span>
              <span>·</span>
              <span>{timeAgo(post.createdAt)}</span>
              <span>·</span>
              <span><Globe size={12} className="inline mr-1" />Public</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setOptionsOpen(!optionsOpen)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <MoreHorizontal size={20} />
          </button>

          {optionsOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-700 py-1.5 z-10 transition-colors">
              <button
                onClick={() => setOptionsOpen(false)}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <Bookmark size={16} className="text-gray-500" />
                <span>Save post</span>
              </button>
              <button
                onClick={() => setOptionsOpen(false)}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <Edit size={16} className="text-gray-500" />
                <span>Edit post</span>
              </button>
              <div className="h-px bg-gray-50 dark:bg-gray-700 my-1"></div>
              <button
                onClick={() => setOptionsOpen(false)}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 transition">
                <Trash2 size={16} className="text-red-500 hover:text-red-600" />
                <span>Delete post</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {post.body && <p className="px-5 pb-3 text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{post.body}</p>}

      {post.image && (
        <img src={post.image} alt="post" className="w-full object-cover max-h-[500px]" />
      )}

      <div className="flex items-center justify-between px-5 py-2.5 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 transition">
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <ThumbsUp size={10} className="fill-current" />
          </span>
          <span>{post.likesCount || post.likes?.length || 0} likes</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Repeat size={12} className="text-gray-400" /> {post.sharesCount || 0} shares
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare size={12} className="text-gray-400" /> {post.commentsCount || 0} comments
          </span>
          <span className="text-blue-600 font-semibold cursor-pointer hover:underline ml-1">View details</span>
        </div>
      </div>

      <div className="flex items-center px-2 py-1 gap-1 relative z-0">
        <button onClick={handleLike} disabled={loadingLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition
            ${isLiked ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
          <ThumbsUp size={18} className={isLiked ? "fill-current" : ""} /> Like
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
          <MessageSquare size={18} /> Comment
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
          <Repeat size={18} /> Share
        </button>
      </div>
    </div>
  );
}
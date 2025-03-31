import React, { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom";
import './style.css';
import { useContext } from "react";
import AuthContext from "./context/authContext";  // Import the context
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";  // Import icons

const formatViews = (num) => {
      if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(1) + "B"; // Billions
      } else if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1) + "M"; // Millions
      } else if (num >= 1_000) {
        return (num / 1_000).toFixed(1) + "K"; // Thousands
      }
      return num; // Less than 1K, show full number
};
const timeAgo = (dateString) => {
      const now = new Date();
      const uploadDate = new Date(dateString);
      const secondsAgo = Math.floor((now - uploadDate) / 1000);
    
      if (secondsAgo < 60) {
        return `${secondsAgo} seconds ago`;
      } else if (secondsAgo < 3600) {
        return `${Math.floor(secondsAgo / 60)} minutes ago`;
      } else if (secondsAgo < 86400) {
        return `${Math.floor(secondsAgo / 3600)} hours ago`;
      } else if (secondsAgo < 2592000) {
        return `${Math.floor(secondsAgo / 86400)} days ago`;
      } else if (secondsAgo < 31536000) {
        return `${Math.floor(secondsAgo / 2592000)} months ago`;
      } else {
        return `${Math.floor(secondsAgo / 31536000)} years ago`;
      }
};


function VedioPlayer() {
  const {videoId}=useParams();
  const { user } = useContext(AuthContext);  // Get the logged-in user
  console.log(user);

  // Fetching from dummy JSON
    const [video, setVideo] = useState([]);
    
    const [likes, setLikes] = useState(false);
    const [dislikes, setDislikes] = useState(false);

    const [hasLiked, setHasLiked] = useState(false);
    const [hasDisliked, setHasDisliked] = useState(false);

    const [newComment, setNewComment] = useState(""); 
    const [editingComment, setEditingComment] = useState(null); 
    const [newCommentText, setNewCommentText] = useState(""); 

    const [suggestedVideos, setSuggestedVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Fetch the current video
      fetch(`http://localhost:5000/api/videos/${videoId}`)
          .then((res) => res.json())
          .then((data) => { 
              setVideo(data);
              setLikes(data.likes);
              setDislikes(data.dislikes);
              setLoading(false);
          })
          .catch((err) => {
              console.error("Error fetching video:", err);
              setLoading(false);
          });

      // Fetch all videos and remove the currently playing one
      fetch("http://localhost:5000/api/videos")
          .then((res) => res.json())
          .then((data) => {
              setSuggestedVideos(data.filter(v => v.videoId !== videoId)); // Exclude current video
          })
          .catch((err) => console.error("Error fetching suggested videos:", err));
      
  }, [videoId]);

  // ➡️ Add comment
  const handleAddComment = async () => {
    if (!newComment || !user) {
      alert("You must be logged in to add a comment.");
      return;
  }
  console.log("User object:", user);  // ✅ Check the user object before sending the request
    try {
      const res = await fetch(
        `http://localhost:5000/api/videos/${videoId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            userId: user.id,     // Use the ID from AuthContext
            userName:user.name,
            text: newComment 
        })
    });
    if (res.ok) {
        setNewComment(""); 
        
        // 💡 Refresh the current page to see the new comment
        window.location.reload();
        alert("Comment Added Successfully");
    } else {
        console.error("Failed to add comment");
    }
    } catch (error) {
        console.error("Failed to add comment:", error);
    }
};

// ➡️ Edit comment
const handleEdit = async (commentId, newText) => {
    try {
        const res = await fetch(
            `http://localhost:5000/api/videos/${videoId}/comments/${commentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: newText })
        });

        if (res.ok) {
            setNewComment(""); 
            
            // 💡 Refresh the current page to see the  comment
            window.location.reload();
        }
    } catch (error) {
        console.error("Failed to edit comment:", error);
    }
};

// ➡️ Delete comment
const handleDelete = async (commentId) => {
    try {
        const res = await fetch(
            `http://localhost:5000/api/videos/${videoId}/comments/${commentId}`, {
            method: "DELETE"
        });

        if (res.ok) {
            
            // 💡 Refresh the current page to see the delete comment
            window.location.reload();
        }
    } catch (error) {
        console.error("Failed to delete comment:", error);
    }
};
 // ➡️ Handle Like
 const handleLike = async () => {
    if (!user) {
        alert("You must be logged in to like the video.");
        return;
    }
    if (hasLiked) {
        // Remove like
        setLikes((prev)=>prev-1);
        setHasLiked(false);
        return;
    } 
    else 
    {  

        // Remove dislike if previously disliked
        if (hasDisliked) {
            setDislikes((prev) => prev - 1);
            setHasDisliked(false);
        }
    
        try {
            const res = await fetch(`http://localhost:5000/api/videos/${videoId}/like`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id })
            }); 
            if (res.ok) {
                console.log("Called");
                const data = await res.json();
                setLikes(data.likes);
                setHasLiked(true);
                setDislikes(data.dislikes);
            }
        } catch (error) {
            console.error("Failed to like video:", error);
        }
    }
};

// ➡️ Handle Dislike
const handleDislike = async () => {
    if (!user) {
        alert("You must be logged in to dislike the video.");
        return;
    }
    if (hasDisliked) {
        // Remove dislike
        setDislikes((prev) => prev - 1);
        setHasDisliked(false);
    } else {
        // Add dislike
        setHasDisliked(true);

        // Remove like if previously liked
        if (hasLiked) {
            setLikes((prev) => prev - 1);
            setHasLiked(false);
        }
    
        try {
            const res = await fetch(`http://localhost:5000/api/videos/${videoId}/dislike`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id })
            });

            if (res.ok) {
                const data = await res.json();
                setLikes(data.likes);
                setDislikes(data.dislikes);
            }
        } catch (error) {
            console.error("Failed to dislike video:", error);
        }
    }
};

  if (loading) return <p>Loading...</p>;
  if (!video) return <p>Video not found</p>;
    return (
        <div className='container'>
            <div className="video-player-container">
                <div className="vedio-frame">
                <iframe
                    width="100%"
                    height="400"
                    src={`${video.videoUrl}?autoplay=1&rel=0&modestbranding=1`}
                    title={video.title}
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                    frameBorder={0}
                ></iframe>
                </div>

                {/* Like and Dislike Buttons */}
                <div className="likes-dislikes">
                <button 
                    onClick={handleLike} 
                    className={`like-btn ${hasLiked ? "has-liked" : ""}`}
                >
                    <FaThumbsUp size={20} /> {formatViews(likes)}
                </button>
                <button 
                    onClick={handleDislike} 
                    className={`dislike-btn ${hasDisliked ? "has-disliked" : ""}`}
                >
                <FaThumbsDown size={20} /> {formatViews(dislikes)}
    </button>
</div>



                {/* Vedio Details*/}
                <div className="video-details">
                    <h2>{video.title}</h2>
                    <p className="channel-name">{video.uploader}</p>
                    <p>{formatViews(video.views)} views • {timeAgo(video.uploadDate)}</p>
                    <p className="description">{video.description}</p>
                </div>

                {/* Add Comment */}
                <h3>Comments</h3>
                <div>
                        <input 
                            type="text" 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment"
                        />
                        <button className='add-cmt' onClick={handleAddComment}>Add</button>
                </div>
                
                {/* Comment Section  */}
                <div className="comment-section">
                <ul>
                     {video.comments.map((c) => (
                            <li key={c.commentId}>
                                {editingComment === c.commentId ? (
                                    <div>
                                        <input
                                            value={newCommentText}
                                            onChange={(e) => setNewCommentText(e.target.value)}
                                        />
                                        <button onClick={() => handleEdit(c.commentId, newCommentText)}>Save</button>
                                        <button onClick={() => setEditingComment(null)}>Cancel</button>
                                    </div>
                                ) : (
                                    <div>
                                       
                                        <p>{c.text} - {c.userName}</p>
                                        <button onClick={() => {
                                            setEditingComment(c.commentId);
                                            setNewCommentText(c.text);
                                        }}>Edit</button>
                                        <button onClick={() => handleDelete(c.commentId)}>Delete</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
             </div>
             <div className="suggested-videos">
                <h3 className='suggested-video-header'>Suggested Videos</h3>
                {suggestedVideos.map((suggested) => (
                    <Link to={`/watch/${suggested.videoId}`} key={suggested.videoId} className="suggested-video-card">
                    <img src={suggested.thumbnailUrl} alt={suggested.title} />
                    <div className="info">
                        <h4>{suggested.title}</h4>
                        <p>{suggested.uploader}</p>
                    </div>
                    </Link>
                ))}
            </div>

        </div>
        
    )
}
export default VedioPlayer;

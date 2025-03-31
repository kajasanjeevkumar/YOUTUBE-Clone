import React, { useState, useEffect, useContext } from "react";
import AuthContext from "./context/authContext"; // To get the logged-in user
import "./style.css";
import { Link } from "react-router-dom";

const ProfilePage = () => {
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
    const { user } = useContext(AuthContext); 
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newVideo, setNewVideo] = useState({
        title: "",
        description: "",
        category: "",
        thumbnailUrl: "",
        videoUrl: ""
    });
    const [editingVideoId, setEditingVideoId] = useState(null);
    const [editForm, setEditForm] = useState({});

    // Fetch current user's videos
    useEffect(() => {
        if (user) {
            fetch(`http://localhost:5000/api/profile/${user.id}`)
                .then((res) => res.json())
                .then((data) => {
                    setVideos(data);
                    setLoading(false);
                })
                .catch((err) => console.error("Error fetching user videos:", err));
        }
    }, [user]);


    // ➡️ Handle Edit Video
    const handleEditVideo = (e,video) => {
        e.preventDefault();         // Prevent <Link> navigation
            e.stopPropagation();        // Stop event bubbling
        setEditingVideoId(video._id);
        setEditForm(video);
    };

    // ➡️ Save Edited Video
    const handleSaveEdit = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/profile/${editingVideoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm)
            });

            if (res.ok) {
                const updatedVideo = await res.json();
                setVideos((prev) =>
                    prev.map((v) => (v._id === updatedVideo._id ? updatedVideo : v))
                );
                setEditingVideoId(null);
            }
        } catch (error) {
            console.error("Failed to edit video:", error);
        }
    };

    // ➡️ Cancel Edit
    const handleCancelEdit = () => {
        setEditingVideoId(null);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="profile-container">
            <header className="profile-header">
                <h1>{user?.name}'s Profile</h1>
            </header>

            {/* Display User's Videos */}
            <div className="video-grid">
                {videos.length === 0 ? (
                    <p>No videos uploaded yet.</p>
                ) : (
                    videos.map((video) => (
                        <div className='video-card' key={video.videoId}>
                            {editingVideoId === video._id ? (
                                <div className="profile-inp">
                                    <input 
                                        type="text"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    />
                                    <textarea 
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    />
                                    <input 
                                        type="text"
                                        value={editForm.thumbnailUrl}
                                        onChange={(e) => setEditForm({ ...editForm, thumbnailUrl: e.target.value })}
                                    />
                                    <input 
                                        type="text"
                                        value={editForm.videoUrl}
                                        onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })}
                                    />
                                    <button className="edit-btn" onClick={handleSaveEdit}>Save</button>
                                    <button className="edit-btn" onClick={handleCancelEdit}>Cancel</button>
                                </div>
                            ) : (
                                <Link to={`/watch/${video.videoId}`}  className='video-card'>
                                <img src={video.thumbnailUrl} alt={video.title} className='thumbnail' style={{ width: "100%", height: "175px", objectFit: "cover", borderRadius: "8px" }} />
                                <div className='video-info'>
                                  <h4 className='title'>{video.title}</h4>
                                  <p className='channel'>{video.uploader}</p>
                                  <p className='views'>
                                {formatViews(video.views)} views • {timeAgo(video.uploadDate)}
                              </p>
                              <button className="edit-btn" onClick={(e) => handleEditVideo(e,video)}>Edit</button>
                                </div>
                                </Link>
                                
                            )}
                    </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProfilePage;

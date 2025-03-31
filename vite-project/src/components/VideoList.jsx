import React from 'react'
import { Link } from "react-router-dom";
function VideoList({videos}) {
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
  return (
    <>
        <div className='video-grid'>
        {
          videos.length===0?<h1>No videos with this Search and Category</h1>:
          videos.map((video)=>(
            <Link to={`/watch/${video.videoId}`} key={video.videoId} className='video-card'>
              <img src={video.thumbnailUrl} alt={video.title} className='thumbnail' style={{ width: "100%", height: "175px", objectFit: "cover", borderRadius: "8px" }} />
              <div className='video-info'>
                <h4 className='title'>{video.title}</h4>
                <p className='channel'>{video.uploader}</p>
                <p className='views'>
              {formatViews(video.views)} views • {timeAgo(video.uploadDate)}
            </p>
              </div>
            </Link>
          ))
        }
      </div>
    </>
  )
}

export default VideoList;

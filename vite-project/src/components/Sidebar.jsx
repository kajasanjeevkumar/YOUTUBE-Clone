import React from "react";
import { FaHome, FaHistory, FaPlay, FaThumbsUp,FaGamepad,FaNewspaper } from "react-icons/fa";
import { MdSubscriptions, MdOutlineWatchLater, MdOutlineExplore, MdOutlineShoppingBag,MdLiveTv, MdMusicNote, MdSportsSoccer } from "react-icons/md";
import { SiYoutubeshorts } from "react-icons/si";
import './style.css';
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      {/* Main Navigation */}
      <nav className="sidebar-menu">
        <Link to="/" className="home">
        <div className="menu-item active">
          <FaHome />
          <span>Home</span>
        </div>
        </Link>
        <div className="menu-item">
          <SiYoutubeshorts />
          <span>Shorts</span>
        </div>
        <div className="menu-item">
          <MdSubscriptions />
          <span>Subscriptions</span>
        </div>
      </nav>

      <hr />

      {/* You Section */}
      <div className="sidebar-menu">
        <div className="menu-item">
          <FaHistory />
          <span>History</span>
        </div>
        <div className="menu-item">
          <FaPlay />
          <span>Playlists</span>
        </div>
        <div className="menu-item">
          <MdOutlineWatchLater />
          <span>Watch Later</span>
        </div>
        <div className="menu-item">
          <FaThumbsUp />
          <span>Liked Videos</span>
        </div>
      </div>

      <hr />

      {/* Explore Section */}
      <div className="sidebar-menu">
        <div className="menu-item">
          <MdOutlineExplore />
          <span>Trending</span>
        </div>
        <div className="menu-item">
          <MdOutlineShoppingBag />
          <span>Shopping</span>
        </div>
        <div className="menu-item">
          <MdMusicNote />
          <span>Music</span>
        </div>
        <div className="menu-item">
          <MdLiveTv />
          <span>Live</span>
        </div>
        <div className="menu-item">
          <FaGamepad />
          <span>Gaming</span>
        </div>
        <div className="menu-item">
          <FaNewspaper />
          <span>News</span>
        </div>
        <div className="menu-item">
          <MdSportsSoccer />
          <span>Sports</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

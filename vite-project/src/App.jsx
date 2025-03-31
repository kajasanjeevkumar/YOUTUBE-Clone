import React, { useEffect, useState } from "react"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import VideoList from "./components/VideoList"
import CategoryFilter from "./components/CategoryFilter"
import VedioPlayer from "./components/VedioPlayer"
import Login from "./components/pages/Login"
import Signup from "./components/pages/SignUp"
import ProfilePage from "./components/Profile"
import { AuthProvider } from "./components/context/authContext"
import { BrowserRouter, Route, Routes } from "react-router-dom"
function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery,setSearchQuery]=useState("");
  const [videos,setVideos]=useState([]);
  //Fetch videos from backened
  useEffect(()=>{
    fetch("http://localhost:5000/api/videos") // Backend API
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((err) => console.error("Error fetching videos:", err));
  },[])
  
  // First, filter all videos based on search query
  const searchedVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Then, filter by category from the search results
  const filteredVideos =
    selectedCategory === "All"
      ? searchedVideos
      : searchedVideos.filter((video) => video.category === selectedCategory);

  return (
    <>
    <AuthProvider>
      <BrowserRouter>
        <Header onSearch={setSearchQuery}></Header>
        <Sidebar></Sidebar>
        <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        <Routes>
          <Route path="/" element={<VideoList videos={filteredVideos}/>}/>
          <Route path="/watch/:videoId" element={<VedioPlayer/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </>
  )
}

export default App

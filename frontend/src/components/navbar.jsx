import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";
import logo from "../img/logo.png";
import SearchIcon from "../img/search.png"; // ตรวจสอบว่าคุณมีรูปภาพนี้ในโปรเจกต์
import SearchSlidePanel from "./search";

function Navbar() {
  const { currentUser, logout } = useAuth();
  const { setShowLoginModal, setShowRegisterModal } = useModal();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSubmenu, setShowSubmenu] = useState(false);

  // States และ functions สำหรับการค้นหา
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const togglePanel = () => setIsPanelOpen(!isPanelOpen);

  useEffect(() => {
    if (location.pathname === "/" || location.pathname.startsWith("/song/")) {
      // เงื่อนไขเพื่อแสดง submenu
      setShowSubmenu(true);
    } else {
      // ซ่อน submenu เมื่อไม่อยู่ในหน้า Home
      setShowSubmenu(false);
    }
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // รหัสที่คุณต้องการให้รันหลังจาก delay
      fetch(
        `http://localhost:5000/search?query=${encodeURIComponent(searchQuery)}`
      )
        .then((response) => response.json())
        .then((data) => setSearchResults(data))
        .catch((error) => console.log(error));
    }, 650); // milliseconds

    return () => clearTimeout(timer); // ทำการ cleanup เมื่อ component ถูก unmount
  }, [searchQuery]); // ทำงานทุกครั้งที่ searchQuery เปลี่ยนแปลง

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/"); // Navigate back to home/guest page on logout
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const scrollToGenre = (genreId) => {
    const genreSection = document.getElementById(genreId);
    if (genreSection) {
      const yOffset = -105; // Adjust this value based on your needs, e.g., navbar height
      const yPosition =
        genreSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: yPosition, behavior: "smooth" });
    }
  };

  const handleSongClick = (songId) => {
    // เปลี่ยนจากการให้ user_id เป็น 0 สำหรับ Guest ให้เป็นการใช้ user_id จาก currentUser หากผู้ใช้ได้ล็อกอินแล้ว
    // ถ้าไม่มีผู้ใช้ล็อกอิน (currentUser เป็น null) ให้ user_id = 0
    const userId = currentUser ? currentUser.user_id : 0;

    const payload = {
      song_id: songId,
      user_id: userId, // ใช้ userId ที่ได้จากการตรวจสอบด้านบน
    };

    fetch("http://localhost:5000/log_play", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Play logged:", data);
        navigate(`/song/${songId}`); // Navigate to the song details page
      })
      .catch((error) => console.error("Error logging play:", error));
  };

  return (
    <div className="fixed-navbar">
      <div className="menu">
        <div className="flex">
          <div className="flex">
            <img
              className="w-[45px] hover:w-[50px] transition-all cursor-pointer"
              src={logo}
              alt="Lysics Logo"
              onClick={() => navigate("/")}
            />
            {currentUser && (
              <div className="flex items-center ml-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  placeholder="ค้นหาชื่อเพลง หรือศิลปิน..."
                />
                <img
                  className="mx-1 h-[25px] hover:h-[28px] cursor-pointer transition-all"
                  src={SearchIcon}
                  alt="Search"
                  onClick={togglePanel}
                />
              </div>
            )}
          </div>
        </div>
        {!currentUser ? (
          <div className="flex">
            <button className="btn" onClick={() => setShowLoginModal(true)}>
              เข้าสู่ระบบ
            </button>
            <button className="btn" onClick={() => setShowRegisterModal(true)}>
              สมัครสมาชิก
            </button>
          </div>
        ) : (
          <div className="flex">
            <div className="ml-8 flex">
              <button className="btn" onClick={() => navigate("/")}>
                หน้าแรก
              </button>
              {currentUser && currentUser.role === "admin" && (
                <button className="btn" onClick={() => navigate("/admin")}>
                  แอดมิน
                </button>
              )}
            </div>
            <button className="btn" onClick={handleLogout}>
              ออกจากระบบ
            </button>
          </div>
        )}
      </div>
      {showSubmenu && (
        <div className={`submenu space-x-[64px] ${showSubmenu ? "show" : ""}`}>
          {/* Submenu items */}
          {!location.pathname.startsWith("/song/") && (
            <>
              <button
                className="submenu-btn"
                onClick={() => scrollToGenre("ร็อค")}
              >
                ร็อค
              </button>
              <button
                className="submenu-btn"
                onClick={() => scrollToGenre("ป็อป")}
              >
                ป็อป
              </button>
              <button
                className="submenu-btn"
                onClick={() => scrollToGenre("แร็พ")}
              >
                แร็พ
              </button>
              <button
                className="submenu-btn"
                onClick={() => scrollToGenre("สตริง")}
              >
                สตริง
              </button>
              <button
                className="submenu-btn"
                onClick={() => scrollToGenre("R&B")}
              >
                R&B
              </button>
              <button
                className="submenu-btn"
                onClick={() => scrollToGenre("คลาสสิก")}
              >
                คลาสสิก
              </button>
              <button
                className="submenu-btn"
                onClick={() => scrollToGenre("แจ๊ส")}
              >
                แจ๊ส
              </button>
              <button
                className="submenu-btn"
                onClick={() => scrollToGenre("บูลล์")}
              >
                บูลล์
              </button>
            </>
          )}
        </div>
      )}
      <SearchSlidePanel
        isOpen={isPanelOpen}
        closePanel={togglePanel}
        searchResults={searchResults}
        onSongClick={handleSongClick}
      />
    </div>
  );
}

export default Navbar;

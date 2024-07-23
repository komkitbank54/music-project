import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./css/songinfo.css";

//Import Icon
import { MdOutlineRecommend, MdLyrics } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { HiMiniMusicalNote } from "react-icons/hi2";

function SongDetail() {
  const { currentUser } = useAuth();
  const { songId } = useParams(); // This retrieves the songId from the URL
  const [songDetails, setSongDetails] = useState(null);
  const [recommendedSongs, setRecommendedSongs] = useState([]);

  // Nevigate ระหว่างหน้า
  const navigate = useNavigate();

  // ดึงข้อมูลรายละเอียดเพลง
  useEffect(() => {
    fetch(`http://localhost:5000/songs/${songId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setSongDetails(data))
      .catch((error) => console.error("Error fetching song details:", error));
  }, [songId]);

  // แสดงข้อมูลจาก API recommend
  useEffect(() => {
    const user_id = currentUser?.user_id;
    fetch(`http://localhost:5000/recommendations/${user_id}`)
      .then((response) => response.json())
      .then((songIds) => {
        const fetchSongsDetails = async () => {
          const songs = await Promise.all(
            songIds.map((id) =>
              fetch(`http://localhost:5000/songs/${id}`).then((response) =>
                response.json()
              )
            )
          );
          setRecommendedSongs(songs);
        };

        fetchSongsDetails();
      })
      .catch((error) =>
        console.error("Error fetching recommended songs:", error)
      );
  }, [currentUser]);

  if (!songDetails) {
    return <div>Loading song details...</div>;
  }

  // ดึงโค้ดข้างหลังยูทูป
  const youtubeVideoID = songDetails.yt_link?.split("v=")[1];

  const handleSongClick = (songId) => {
    // เปลี่ยนจากการให้ user_id เป็น 0 สำหรับ Guest ให้เป็นการใช้ user_id จาก currentUser หากผู้ใช้ได้ล็อกอินแล้ว
    // ถ้าไม่มีผู้ใช้ล็อกอิน (currentUser เป็น null) ให้ user_id = 0
    const userId = currentUser ? currentUser.user_id : 0;

    const payload = {
      song_id: songId,
      user_id: userId,
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
        navigate(`/song/${songId}`);
      })
      .catch((error) => console.error("Error logging play:", error));
  };

  return (
    <div className="w-[auto] mt-[160px] space-y-[40px] mb-[80px]">
      <div className="flex justify-center">
        <div className="detail-container">
          <div className="detail-row">
            <div className="detail-column">
              {songDetails.artist_pic && (
                <img
                  src={`http://localhost:5000/images/${songDetails.artist_pic}`}
                  alt="Artist"
                  className="detail-image"
                />
              )}
            </div>
            <div className=" m-10">
              <h2 className="text-[36px] font-bold">{songDetails.title}</h2>
              <p className="text-[20px] flex">
                <FaUserAlt className="box-s-icon" />
                ศิลปิน: {songDetails.artist_name}
              </p>
              <p className="text-[20px] flex border-b-[1px] border-black">
                <HiMiniMusicalNote className="box-s-icon" />
                แนวเพลง: {songDetails.genre}
              </p>
              <p className="mt-2 text-[14px]">{songDetails.article}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="iframe-container">
        {youtubeVideoID && (
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${youtubeVideoID}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
      </div>
      <div className="flex justify-center">
        <div className="detail-box">
          <h2 className="flex justify-start items-center text-[30px] font-bold">
            <MdLyrics className="box-icon" />
            เนื้อเพลง
          </h2>
          <pre>
            <label className="text-[18px] mt-[30px] leading-[40px]">{songDetails.lyric}</label>
          </pre>
        </div>
      </div>
      {currentUser ? (
      <div className="flex justify-center">
        <div className="song-box box-white">
          <h2 className="flex justify-start items-center text-[30px] font-bold">
            <MdOutlineRecommend className="box-icon" />
            เพลงแนะนำสำหรับคุณ
          </h2>
          <div className="scroll-container mt-4">
            {recommendedSongs.map((song, index) => (
              <div
                key={index}
                className="song-card flex justify-start space-x-4"
                onClick={() => handleSongClick(song.song_id)}
              >
                <img
                  src={`http://localhost:5000/images/${song.artist_pic}`}
                  alt={`${song.artist_name}`}
                  className="artist-image"
                />
                <div>
                  <p className="song-title">{song.title}</p>
                  <p className="artist-name">{song.artist_name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default SongDetail;

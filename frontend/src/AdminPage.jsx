// ./src/AdminPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

// Import Components
import AddSong from "./components/add-song";
import EditSong from "./components/edit-song";
import DeleteSong from "./components/delete-song";
import DashboardOverview from "./components/dashboard";

// Import Image
import { AiFillDelete } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { PiMusicNotesPlusFill } from "react-icons/pi";
import { MdEditSquare } from "react-icons/md";

function AdminPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [songs, setSongs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [songsPerPage] = useState(8);
  const [editModalShow, setEditModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [currentSong, setCurrentSong] = useState({});
  const [expandedLyricId, setExpandedLyricId] = useState(null);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleShowModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  // เรียกข้อมูลจากตาราง songs จาก API
  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    // Filter songs based on search query
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(lowercasedQuery) ||
        song.artist_name.toLowerCase().includes(lowercasedQuery) ||
        song.genre.toLowerCase().includes(lowercasedQuery) ||
        song.album.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredSongs(filtered);
  }, [songs, searchQuery]);

  const fetchSongs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/songs");
      setSongs(response.data);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  // Edit
  const handleEdit = (event, song) => {
    event.stopPropagation();
    setCurrentSong(song);
    setEditModalShow(true);
  };

  // Delete
  const handleDelete = (event, songId) => {
    event.stopPropagation();
    setCurrentSong({ song_id: songId });
    setDeleteModalShow(true);
  };

  //
  const toggleLyricDisplay = (id) => {
    if (expandedLyricId === id) {
      setExpandedLyricId(null); // ถ้าคลิกที่ row เดิม, ซ่อนเนื้อเพลง
    } else {
      setExpandedLyricId(id); // แสดงเนื้อเพลงเต็มรูปแบบ
    }
  };

  // CSS Bars
  const barsItems = [];
  for (let i = 0; i < 19; i++) {
    // คำนวณความสูงแบบไล่ระดับ
    // สร้างค่า delay แบบสุ่มระหว่าง 1 ถึง 10 วินาที
    const randomDelay = `${Math.random() * 9 + 1}s`; // 0.0s ถึง 9.0s + 1 ทำให้เป็น 1.0s ถึง 10.0s

    barsItems.push(
      <div
        key={i}
        className="bars__item"
        style={{ animationDelay: randomDelay }}
      ></div>
    );
  }

  // Pagination logic
  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = filteredSongs.slice(indexOfFirstSong, indexOfLastSong);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchSongs(pageNumber);
  };

  // Determine the total number of pages
  const totalPages = Math.ceil(songs.length / songsPerPage);

  // Calculate the range of pages to display
  let startPage = currentPage - 2;
  let endPage = currentPage + 2;

  if (startPage < 1) {
    startPage = 1;
    endPage = Math.min(4, totalPages); // Ensure we don't go beyond the total pages
  } else if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, totalPages - 3); // Ensure we always show 5 pages, if possible
  }

  return (
    <div className="my-[120px]">
      <DashboardOverview
        totalSongs={songs.length}
        totalArtists={/* ข้อมูลจำลองหรือดึงจาก API */ 100}
        totalAccounts={/* ข้อมูลจำลองหรือดึงจาก API */ 500}
        pageViews={/* ข้อมูลจำลองหรือดึงจาก API */ 1500}
      />
      <div className="bars">{barsItems}</div>
      <div className="line"></div>
      <div className="t">
        <div className="p-4 w-auto flex justify-center bg-[#aad2ff] rounded-t-[10px]">
          <div className="input-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder=" "
              className="input-field"
            />
            <label htmlFor="duration" className="input-label">
              ค้นหาเพลง...
            </label>
          </div>
          <FaSearch className="ml-2 table-icon" />
        </div>
        <div className="tHead">
          <div className="tRow py-1">
            <div className="tCell">นักร้อง</div>
            <div className="tCell">ชื่อเพลง</div>
            <div className="tCell">ประเภท</div>
            <div className="tCell">อัลบั้ม</div>
            <div className="tCell">เนื้อเพลง</div>
            <div className="tCell">บทความ</div>
            <div className="tCell flex justify-center">
              <button onClick={handleShowModal}>
                <PiMusicNotesPlusFill className="table-icon" />
              </button>
            </div>
          </div>
        </div>
        <div className="tBody">
          {currentSongs.reverse().map((song) => (
            <div
              className="tRow"
              key={song.song_id}
              onClick={() => toggleLyricDisplay(song.song_id)}
            >
              <div className="tCell">
                <div className="flex justify-center">
                  <img
                    src={`http://localhost:5000/images/${song.artist_pic}`}
                    alt={`${song.artist_name}`}
                    className="artist-image"
                  />
                  </div>
                  {song.artist_name}
              </div>
              <div className="tCell">{song.title}</div>
              <div className="tCell">{song.genre}</div>
              <div className="tCell">{song.album}</div>
              <div className="tCell" style={{ whiteSpace: "pre-wrap" }}>
                {expandedLyricId === song.song_id
                  ? song.lyric
                  : `${song.lyric.substring(0, 50)}...`}
              </div>
              <div className="tCell">
                {expandedLyricId === song.song_id
                  ? song.article
                  : `${song.article.substring(0, 50)}...`}
              </div>
              <div className="tCell flex justify-center space-x-1">
                <button onClick={(event) => handleEdit(event, song)}>
                  <MdEditSquare className="table-icon" />
                </button>
                <button onClick={(event) => handleDelete(event, song.song_id)}>
                  <AiFillDelete className="table-icon" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AddSong
        show={showAddModal}
        onClose={handleCloseAddModal}
        reload={fetchSongs}
      />
      <EditSong
        show={editModalShow}
        onClose={() => setEditModalShow(false)}
        songData={currentSong}
        fetchSongs={fetchSongs}
      />
      <DeleteSong
        show={deleteModalShow}
        onClose={() => setDeleteModalShow(false)}
        songId={currentSong.song_id}
        fetchSongs={fetchSongs}
      />

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        {startPage > 1 && (
          <button
            onClick={() => paginate(1)}
            className="transition-all px-4 py-2 mx-1 rounded-md bg-gray-200"
          >
            1
          </button>
        )}
        {startPage > 2 && <span className="px-4 py-2 mx-1">...</span>}
        {Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        ).map((page) => (
          <button
            key={page}
            onClick={() => paginate(page)}
            className={`transition-all px-4 py-2 mx-1 rounded-md ${
              currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {page}
          </button>
        ))}
        {endPage < totalPages - 1 && (
          <span className="px-4 py-2 mx-1">...</span>
        )}
        {endPage < totalPages && (
          <button
            onClick={() => paginate(totalPages)}
            className="transition-all px-4 py-2 mx-1 rounded-md bg-gray-200"
          >
            {totalPages}
          </button>
        )}
      </div>
    </div>
  );
}

export default AdminPage;

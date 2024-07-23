// ./components/delete-song.jsx
import React from "react";
import axios from "axios";

function DeleteSong({ show, onClose, songId, fetchSongs }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/songs/${songId}`);
      fetchSongs();
      onClose();
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="overlay">
      <div className="modal">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2 className="font-bold text-[20px]">ยืนยันลบเพลง</h2>
        <div className="mt-4">
            <p className="text-[16px]">คุณยืนยันที่จะ<label className="text-red-500">ลบเพลง</label>ใช่หรือไม่</p>
            <p className="text-[14px] text-red-500">*เพลงที่ลบจะไม่สามารถกู้คืนได้</p>
        </div>
        <div className="flex absolute right-2 bottom-0">
          <button className="btn red" onClick={handleDelete}>
            ลบ
          </button>
          <button className="" onClick={onClose}>
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteSong;

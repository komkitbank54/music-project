import React, { useState, useEffect } from "react";
import axios from "axios";

// Import CSS
import "../css/modal.css";
import "../css/tab.css";
import "../css/input.css";

function AddSong({ onClose, show, reload }) {
  const [newSong, setNewSong] = useState({
    title: "",
    artist_id: "",
    release_date: "",
    genre: "",
    tags: "",
    duration: "",
    album: "",
    yt_link: "",
    lyric: "",
    article: "",
  });
  const [newArtist, setNewArtist] = useState({
    name: "",
    bio: "",
    artist_pic: "",
  });
  const [artists, setArtists] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await axios.get("http://localhost:5000/artists");
      setArtists(response.data);
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  };

  const handleSongChange = (e) => {
    setNewSong({ ...newSong, [e.target.name]: e.target.value });
  };

  const handleArtistChange = (e) => {
    setNewArtist({ ...newArtist, [e.target.name]: e.target.value });
  };

  const handleSongSubmit = async (e) => {
    e.preventDefault();
    const songDataWithTags = { ...newSong, tags }; // รวม tags ไปกับข้อมูลเพลง

    try {
      const response = await axios.post(
        "http://localhost:5000/songs",
        songDataWithTags
      );
      console.log(response.data);
      setNewSong({
        title: "",
        artist_id: "",
        release_date: "",
        genre: "",
        tags: "",
        duration: "",
        album: "",
        yt_link: "",
        lyric: "",
        article: "",
      });
      reload();
      onClose();
    } catch (error) {
      console.error("Error adding song:", error);
    }
  };

  const handleArtistSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newArtist.name);
    formData.append("bio", newArtist.bio);
    // สมมติว่า `artistPic` เป็น state ที่จัดการกับไฟล์รูปภาพที่เลือก
    formData.append("artist_pic", newArtist.artistPic);

    try {
      const response = await axios.post(
        "http://localhost:5000/artists",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      setNewArtist({
        name: "",
        bio: "",
        artist_pic: "",
      });
      fetchArtists();
      onClose();
    } catch (error) {
      console.error("Error adding artist:", error);
    }
  };

  const [activeTab, setActiveTab] = useState("addSong");

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const handleGenerateArticle = async () => {
    setIsLoading(true); // Start loading
    try {
      if (!newSong.title || !newSong.lyric) {
        console.error("Title and lyrics are required.");
        setIsLoading(false); // Stop loading in case of error
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/generate-article",
        {
          title: newSong.title,
          lyric: newSong.lyric,
        }
      );

      if (response.data.choices && response.data.choices.length > 0) {
        setNewSong({
          ...newSong,
          article: response.data.choices[0].message.content,
        });
      } else {
        console.error("Invalid response format:", response.data);
      }
    } catch (error) {
      console.error("Error generating article:", error);
    } finally {
      setIsLoading(false); // Stop loading once the process is complete or fails
    }
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลง state เมื่อมีการเลือกหรือยกเลิกเลือก checkbox
  const handleTagChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      // เพิ่ม tag เข้าไปใน array
      setTags([...tags, value]);
    } else {
      // ลบ tag ออกจาก array
      setTags(tags.filter((tag) => tag !== value));
    }
  };

  const [isClosing, setIsClosing] = useState(false);
  const handleCloseStart = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 120);
  };

  if (!show && !isClosing) {
    return null;
  }

  return (
    <div className="overlay">
      <div className={`modal-add ${isClosing ? "modal-closing" : ""}`}>
        <span className="close" onClick={handleCloseStart}>
          &times;
        </span>
        <div className="tabs">
          <button
            className={activeTab === "addSong" ? "active" : ""}
            onClick={() => switchTab("addSong")}
          >
            Add Song
          </button>
          <button
            className={activeTab === "addArtist" ? "active" : ""}
            onClick={() => switchTab("addArtist")}
          >
            Add Artist
          </button>
        </div>
        {activeTab === "addSong" && (
          <form
            onSubmit={handleSongSubmit}
            className="form-container pt-4 pb-8 px-2"
          >
            <div className="form-column space-y-5">
              <div className="input-container">
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={newSong.title}
                  onChange={handleSongChange}
                  className="input-field"
                  placeholder=" "
                />
                <label htmlFor="title" className="input-label">
                  Title
                </label>
              </div>
              <div className="select-container">
                <select
                  name="artist_id"
                  id="artist_id"
                  value={newSong.artist_id}
                  onChange={handleSongChange}
                  className="select-field"
                  required // ทำให้เป็น required เพื่อใช้กับ :valid
                >
                  <option value="" disabled></option>
                  {artists.map((artist) => (
                    <option key={artist.artist_id} value={artist.artist_id}>
                      {artist.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="artist_id" className="select-label">
                  Artist
                </label>
              </div>
              <div className="input-container">
                <input
                  type="date"
                  name="release_date"
                  id="release_date"
                  value={newSong.release_date}
                  onChange={handleSongChange}
                  className="input-field"
                  placeholder=" "
                />
                <label htmlFor="release_date" className="input-label">
                  Release Date
                </label>
              </div>
              <div className="select-container">
                <select
                  name="genre"
                  id="genre"
                  value={newSong.genre}
                  onChange={handleSongChange}
                  className="select-field"
                  required // ทำให้เป็น required เพื่อใช้กับ :valid
                >
                  <option value="" disabled></option>
                  <option value="ป็อป">ป็อป</option>
                  <option value="สตริง">สตริง</option>
                  <option value="แร็พ">แร็พ</option>
                  <option value="R&B">R&B</option>
                  <option value="คลาสสิก">คลาสสิก</option>
                  <option value="แจ๊ส">แจ๊ส</option>
                  <option value="ร็อค">ร็อค</option>
                  <option value="บลูส์">บลูส์</option>
                  <option value="อิเล็กทรอนิก">อิเล็กทรอนิก</option>
                </select>
                <label htmlFor="genre" className="select-label">
                  Genre
                </label>
              </div>
              <div className="input-container">
                <input
                  type="number"
                  name="duration"
                  id="duration"
                  value={newSong.duration}
                  onChange={handleSongChange}
                  className="input-field"
                  placeholder=" "
                />
                <label htmlFor="duration" className="input-label">
                  Duration (in seconds)
                </label>
              </div>
              <div className="input-container">
                <input
                  type="text"
                  name="album"
                  id="album"
                  value={newSong.album}
                  onChange={handleSongChange}
                  className="input-field"
                  placeholder=" "
                />
                <label htmlFor="album" className="input-label">
                  Album
                </label>
              </div>
              <div className="input-container">
                <input
                  type="text"
                  name="yt_link"
                  id="yt_link"
                  value={newSong.yt_link}
                  onChange={handleSongChange}
                  className="input-field"
                  placeholder=" "
                />
                <label htmlFor="yt_link" className="input-label">
                  Youtube Link
                </label>
              </div>
              <button className="absolute right-4 bottom-3 btn" type="submit">
                Add Song
              </button>
            </div>
            <div className="form-column">
              <div className="tags-section">
                <label>Tags:</label>
                <div className="checkbox-container">
                  {[
                    "T-Pop",
                    "K-Pop",
                    "J-Pop",
                    "สากล",
                    "เพลงรัก",
                    "เพลงเศร้า",
                    "มีความสุข",
                    "ละคร",
                    "การ์ตูน",
                    "ลูกทุ่ง",
                    "เพื่อชีวิต",
                    "สกา/เร็กเก้",
                  ].map((tag, index) => (
                    <div key={index} className="checkbox-container ">
                      <input
                        type="checkbox"
                        id={tag}
                        value={tag}
                        checked={tags.includes(tag)}
                        onChange={handleTagChange}
                        className="custom-checkbox"
                      />
                      <label htmlFor={tag}>{tag}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-column">
              <div className="input-container">
                <textarea
                  name="lyric"
                  id="lyric"
                  value={newSong.lyric}
                  onChange={handleSongChange}
                  className="input-field"
                  placeholder=" "
                ></textarea>
                <label htmlFor="lyric" className="textarea-label">
                  Lyrics
                </label>
              </div>
            </div>
            <div className="form-column">
              <div className="input-container">
                {isLoading ? (
                  <div>
                    <textarea
                      name="article"
                      id="article"
                      value="Loading..."
                      onChange={handleSongChange}
                      className="input-field"
                      placeholder="Loading..."
                      disabled
                    ></textarea>
                    <label htmlFor="article" className="textarea-label">
                      Article
                    </label>
                  </div>
                ) : (
                  <div>
                    <textarea
                      name="article"
                      id="article"
                      value={newSong.article}
                      onChange={handleSongChange}
                      className="input-field"
                      placeholder=" "
                    ></textarea>
                    <label htmlFor="article" className="textarea-label">
                      Article
                    </label>
                  </div>
                )}
              </div>
              <button
                className=""
                type="button"
                onClick={handleGenerateArticle}
                disabled={isLoading} // Disable the button while loading
              >
                {isLoading ? "Generating..." : "Generate Article"}
              </button>
            </div>
          </form>
        )}
        {activeTab === "addArtist" && (
          <form
            onSubmit={handleArtistSubmit}
            className="form-container pt-4 pb-8 px-2"
          >
            <div className="form-column space-y-5">
              <div className="input-container">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={newArtist.name}
                  onChange={handleArtistChange}
                  className="input-field"
                  placeholder=" "
                />
                <label htmlFor="name" className="input-label">
                  Artist Name
                </label>
              </div>
              <input
                type="file"
                name="artist_pic"
                onChange={(e) =>
                  setNewArtist({
                    ...newArtist,
                    artistPic: e.target.files[0],
                  })
                }
              />
            </div>
            <div className="form-column">
              <div className="input-container">
                <textarea
                  name="bio"
                  id="bio"
                  value={newArtist.bio}
                  onChange={handleArtistChange}
                  className="input-field"
                  placeholder=" "
                ></textarea>
                <label htmlFor="bio" className="textarea-label">
                  Artist Bio
                </label>
              </div>
            </div>
            {/* Assume there's an input for artist_pic if needed */}
            <button className="absolute right-2 bottom-0 btn" type="submit">
              Add Artist
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddSong;

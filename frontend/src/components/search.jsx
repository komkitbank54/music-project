import React from "react";
import "../css/search.css"; // ต้องสร้างไฟล์ CSS นี้เพื่อให้มีการเลื่อนและสไตล์

const SearchSlidePanel = ({
    isOpen,
    closePanel,
    searchResults,
    onSongClick,
}) => {
    return (
        <div className={`search-panel ${isOpen ? "open" : ""}`}>
            <button className="close-btn" onClick={closePanel}>
                ×
            </button>
            <div className="search-results space-y-3">
                {searchResults.map((song, index) => (
                    <div
                        key={index}
                        className="song-card"
                        onClick={() => onSongClick(song.song_id)}
                    >
                        <h3 className="">
                            <img
                                src={`http://localhost:5000/images/${song.artist_pic}`}
                                alt={`${song.artist_name}`}
                                className="artist-image"
                            />
                        </h3>
                        <div>
                            <p className="song-title">{song.title}</p>
                            <p className="artist-name">{song.artist_name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchSlidePanel;

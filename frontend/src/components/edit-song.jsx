import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Import CSS
import '../css/modal.css';
import '../css/tab.css';
import '../css/input.css';

function EditSong({ show, onClose, songData, fetchSongs }) {
    const [song, setSong] = useState(songData);
    const [artists, setArtists] = useState([]);
    const existingTags = songData.tags ? songData.tags.split(',') : [];
    const [tags, setTags] = useState(existingTags);

    useEffect(() => {
        setSong(songData);
        const fetchArtists = async () => {
            try {
                const response = await axios.get('http://localhost:5000/artists');
                setArtists(response.data);
            } catch (error) {
                console.error('Error fetching artists:', error);
            }
        };
        const updatedTags = songData.tags ? songData.tags.split(',') : [];
        setTags(updatedTags);
        setSong(songData);

        fetchArtists();
    }, [songData]);

    const handleChange = (e) => {
        setSong({ ...song, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            ...song,
            tags: tags // ส่งไปเป็น array โดยตรงหาก API รองรับการรับค่าเป็น JSON array
        };
        try {
            await axios.put(`http://localhost:5000/songs/${song.song_id}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            fetchSongs();
            onClose();
        } catch (error) {
            console.error('Error updating song:', error);
        }
    };
    
    

    const handleTagChange = (event) => {
        const { value, checked } = event.target;
        const updatedTags = checked 
            ? [...tags, value] 
            : tags.filter(tag => tag !== value);
        setTags(updatedTags);
    };

    if (!show) {
        return null;
    }

    return (
        <div className="overlay">
            <div className="modal-edit">
                <span className="close" onClick={onClose}>&times;</span>
                <div className='tab'>
                    <button className='active'>
                        Edit Song
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="form-container pt-4 pb-8 px-2">
                    <div className="form-column space-y-5">
                        {/* Adjusted inputs to include labels and structure similar to AddSong */}
                        <div className="input-container">
                            <input 
                                type="text"
                                name="title"
                                id="title"
                                value={song.title}
                                onChange={handleChange}
                                className="input-field"
                                placeholder=" "
                            />
                            <label htmlFor="title" className="input-label">Title</label>
                        </div>
                        <div className="select-container">
                            <select
                                name="artist_id"
                                id="artist_id"
                                value={song.artist_id}
                                onChange={handleChange}
                                className="select-field"
                                required
                            >
                                <option value="" disabled>Select Artist</option>
                                {artists.map((artist) => (
                                    <option key={artist.artist_id} value={artist.artist_id}>
                                        {artist.name}
                                    </option>
                                ))}
                            </select>
                            <label htmlFor="artist_id" className="select-label">Artist</label>
                        </div>
                        <div className="input-container">
                            <input 
                                type="date"
                                name="release_date"
                                id="release_date"
                                value={song.release_date}
                                onChange={handleChange}
                                className="input-field"
                                placeholder=" "
                            />
                            <label htmlFor="release_date" className="input-label">Release Date</label>
                        </div>
                        <div className="input-container">
                            <input 
                                type="text"
                                name="genre"
                                id="genre"
                                value={song.genre}
                                onChange={handleChange}
                                className="input-field"
                                placeholder=" "
                            />
                            <label htmlFor="genre" className="input-label">Genre</label>
                        </div>
                        <div className="input-container">
                            <input 
                                type="number"
                                name="duration"
                                id="duration"
                                value={song.duration}
                                onChange={handleChange}
                                className="input-field"
                                placeholder=" "
                            />
                            <label htmlFor="duration" className="input-label">Duration (in seconds)</label>
                        </div>
                        <div className="input-container">
                            <input 
                                type="text"
                                name="album"
                                id="album"
                                value={song.album}
                                onChange={handleChange}
                                className="input-field"
                                placeholder=" "
                            />
                            <label htmlFor="album" className="input-label">Album</label>
                        </div>
                        <div className="input-container">
                            <input 
                                type="text"
                                name="yt_link"
                                id="yt_link"
                                value={song.yt_link}
                                onChange={handleChange}
                                className="input-field"
                                placeholder=" "
                            />
                            <label htmlFor="yt_link" className="input-label">Youtube Link</label>
                        </div>
                    </div>
                    <div className='form-column'>
                    <div className="tags-section">
                        <h3>Tags:</h3>
                        {["T-Pop", "K-Pop", "J-Pop","สากล", "เพลงรัก", "เพลงเศร้า", "ละคร", "การ์ตูน", "ลูกทุ่ง", "เพื่อชีวิต", "สกา/เร็กเก้"].map(tag => (
                            <div key={tag} className="checkbox-container">
                                <input
                                    type="checkbox"
                                    id={tag}
                                    name="tags"
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
                    <div className="form-column">
                        <div className="input-container">
                            <textarea
                                name="lyric"
                                id="lyric"
                                value={song.lyric}
                                onChange={handleChange}
                                className="input-field"
                                placeholder=" "
                            ></textarea>
                            <label htmlFor="lyric" className="textarea-label">Lyrics</label>
                        </div>
                    </div>
                    <div className="form-column">
                        <div className="input-container">
                            <textarea
                                name="article"
                                id="article"
                                value={song.article}
                                onChange={handleChange}
                                className="input-field"
                                placeholder=" "
                            ></textarea>
                            <label htmlFor="article" className="textarea-label">Article</label>
                        </div>
                        <button type="button" onClick={handleSubmit} className="btn absolute right-2 bottom-0">Update Song</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditSong;

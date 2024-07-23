import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useModal } from "./context/ModalContext";

// Import Icon
import MusicBar from "./img/music-bar.png";
import { BiMusic, BiSolidLike } from "react-icons/bi";
import { CgMusic } from "react-icons/cg";
import { AiFillFire } from "react-icons/ai";
import { PiMusicNotesFill } from "react-icons/pi";

function MainPage() {
    const { currentUser } = useAuth();
    const [songsByGenre, setSongsByGenre] = useState({});
    const [topSongs, setTopSongs] = useState([]);
    const { setShowLoginModal, setShowRegisterModal } = useModal();

    // Nevigate ระหว่างหน้า
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/top_songs")
            .then((response) => response.json())
            .then((data) => {
                setTopSongs(data);
            })
            .catch((error) =>
                console.error("Error fetching top songs:", error)
            );
    }, []);

    useEffect(() => {
        fetch("http://localhost:5000/songs")
            .then((response) => response.json())
            .then((data) => {
                const genreGroups = data.reduce((acc, song) => {
                    const { genre } = song;
                    if (!acc[genre]) {
                        acc[genre] = [];
                    }
                    acc[genre].push(song);
                    return acc;
                }, {});

                // สร้างฟังก์ชันเพื่อสุ่มอาร์เรย์
                const shuffleArray = (arr) =>
                    arr.sort(() => Math.random() - 0.5);

                // วนลูปผ่านแต่ละกลุ่ม genre และสุ่มอาร์เรย์ของเพลง
                const shuffledGenreGroups = Object.keys(genreGroups).reduce(
                    (acc, genre) => {
                        acc[genre] = shuffleArray(genreGroups[genre]);
                        return acc;
                    },
                    {}
                );

                setSongsByGenre(shuffledGenreGroups);
            })
            .catch((error) => console.log(error));
    }, []); // ดึงข้อมูลเพลงจาก API และจัดกลุ่มตาม genre โดยมีการสุ่มเรียงลำดับเพลงในแต่ละกลุ่ม

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

    // Function to handle song navigation and logging
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
                navigate(`/song/${songId}`);
            })
            .catch((error) => console.error("Error logging play:", error));
    };

    // ฟังก์ชันสำหรับแสดงเพลงตาม genre ของผู้ใช้
    const getUserGenreSongs = () => {
        if (currentUser && (currentUser.genre || currentUser.tags)) {
            // แยก genre และ tags ที่ผู้ใช้สนใจเป็น arrays
            const userGenres = currentUser.genre
                ? currentUser.genre.split(",")
                : [];
            const userTags = currentUser.tags
                ? currentUser.tags.split(",")
                : [];

            // กรองเพลงตาม genre
            let filteredSongsByGenre = [];
            if (userGenres.length) {
                filteredSongsByGenre = userGenres.reduce((acc, genre) => {
                    if (songsByGenre[genre]) {
                        acc = [...acc, ...songsByGenre[genre]];
                    }
                    return acc;
                }, []);
            } else {
                // ถ้าไม่มี genre ที่ผู้ใช้สนใจ ให้ใช้เพลงทั้งหมด
                filteredSongsByGenre = Object.values(songsByGenre).flat();
            }

            // กรองเพลงต่อไปตาม tags
            const filteredSongsByTags = filteredSongsByGenre.filter((song) => {
                if (!song.tags) return false;
                const songTags = song.tags.split(",");
                return userTags.some((tag) => songTags.includes(tag));
            });

            return userTags.length ? filteredSongsByTags : filteredSongsByGenre;
        }
        return [];
    };

    const userGenreSongs = getUserGenreSongs();

    return (
        <div className="mb-[80px]">
            <div className="w-[auto] pt-[120px]">
                <div className="guest ">
                    <header
                        header
                        className="text-[30px] font-bold flex justify-center"
                    >
                        <BiMusic />
                        <label className="mx-8">เนื้อเพลงออนไลน์</label>
                        <CgMusic />
                    </header>
                    <div className="text-[22px] my-4">
                        <p>
                            เว็บไซต์รวบรวมเนื้อเพลงจากศิลปินต่างๆมาให้คนที่มีดนตรีในจิตใจ
                        </p>
                        <p>
                            สนับสนุนผลงานของศิลปินนั้นๆในช่องทางที่ถูกต้องตามลิขสิทธิ์
                        </p>
                        <p>
                            เพื่อเป็นการให้กำลังใจให้แก่ศิลปินที่ชื่นชอบและสนับสนุนศิลปิน
                        </p>
                    </div>
                    <div className="music-bar-container">
                        <img
                            className="music-bar"
                            src={MusicBar}
                            alt="music-bar"
                        />
                    </div>
                    <div className="bars mt-[80px]">{barsItems}</div>
                    <div className="line"></div>
                </div>
            </div>
            {currentUser ? (
                <div className="flex justify-center">
                    <div
                        className={`song-box ${
                            currentUser ? "search-results-song-box" : ""
                        }`}
                    >
                        <h2 className="flex justify-start items-center">
                            <BiSolidLike className="box-icon" />
                            <label className="text-[30px] font-bold">
                                แนวเพลงที่คุณชอบ ({currentUser.genre})
                            </label>
                        </h2>
                        <div className="scroll-container mt-4">
                            {userGenreSongs.map((song, index) => (
                                <div
                                    key={index}
                                    className="song-card flex items-center space-x-4"
                                    onClick={() =>
                                        handleSongClick(song.song_id)
                                    }
                                >
                                    <h3>
                                        <img
                                            src={`http://localhost:5000/images/${song.artist_pic}`}
                                            alt={`${song.artist_name}`}
                                            className="artist-image"
                                            loading="lazy"
                                        />
                                    </h3>
                                    <div>
                                        <p className="song-title">
                                            {song.title}
                                        </p>
                                        <p className="artist-name">
                                            {song.artist_name}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center mt-[10px]">
                    <p>
                        กรุณา{" "}
                        <button
                            className="text-blue-500"
                            onClick={() => setShowLoginModal(true)}
                        >
                            เข้าสู่ระบบ
                        </button>{" "}
                        หรือ{" "}
                        <button
                            className="text-blue-500"
                            onClick={() => setShowRegisterModal(true)}
                        >
                            สมัครสมาชิก
                        </button>{" "}
                        เพื่อค้นหาเพลง
                    </p>
                </div>
            )}
            <div className="flex justify-center">
                <div className="song-box">
                    <h2 className="flex justify-start items-center text-[30px] font-bold">
                        <AiFillFire className="box-icon" />
                        เนื้อเพลงยอดฮิต
                    </h2>
                    <div className="scroll-container mt-4">
                        {topSongs.map((song, index) => (
                            <div
                                key={index}
                                className="song-card flex items-center space-x-4"
                                onClick={() => handleSongClick(song.song_id)}
                            >
                                <h3 className="flex">
                                    <label className="font-bold text-[30px] mx-1">
                                        {index + 1}{" "}
                                    </label>
                                    <img
                                        src={`http://localhost:5000/images/${song.artist_pic}`}
                                        alt={`${song.artist_name}`}
                                        className="artist-image"
                                        loading="lazy"
                                    />
                                </h3>
                                <div>
                                    <p className="song-title">{song.title}</p>
                                    <p className="artist-name">
                                        {song.artist_name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {Object.entries(songsByGenre).map(([genre, songs]) => (
                <div className="flex justify-center">
                    <div key={genre} id={genre} className="song-box">
                        <h2 className="flex justify-start items-center text-[30px] font-bold">
                            <PiMusicNotesFill className="box-icon" />
                            เพลง {genre}
                        </h2>
                        <div className="scroll-container mt-4">
                            {songs.map((song, index) => (
                                <div
                                    key={index}
                                    className="song-card flex items-center space-x-4"
                                    onClick={() =>
                                        handleSongClick(song.song_id)
                                    }
                                >
                                    <h3>
                                        <img
                                            src={`http://localhost:5000/images/${song.artist_pic}`}
                                            alt={`${song.artist_name}`}
                                            className="artist-image"
                                            loading="lazy"
                                        />
                                    </h3>
                                    <div>
                                        <p className="song-title">
                                            {song.title}
                                        </p>
                                        <p className="artist-name">
                                            {song.artist_name}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MainPage;

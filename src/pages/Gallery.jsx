import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { galleryImages } from '../data';
import profileImg from '../assets/profile_coco.webp';
import frameImg from '../assets/frame.webp';
import './Gallery.css';
import Footer from '../components/Footer';

export default function Gallery() {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isFlipped, setIsFlipped] = useState(false);

    const dDay = useMemo(() => {
        const today = new Date();
        const birthDate = new Date('2023-04-07'); // 코코 생일
        const diffTime = Math.abs(today - birthDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }, []);

    return (
        <div className='gallery-container'>
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.aside
                        className='sidebar'
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 320, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                        <div className='profile-card'>
                            {/* 프로필 이미지 뒤집기 효과 */}
                            <div
                                className={`profile-img-container ${isFlipped ? 'flipped' : ''}`}
                                onClick={() => setIsFlipped(!isFlipped)}
                            >
                                <div className='flipper'>
                                    <div className='front'>
                                        <img src={profileImg} alt='코코 프로필' />
                                    </div>
                                    <div className='back'>
                                        <div className='back-content'>까꿍! 🐹</div>
                                    </div>
                                </div>
                            </div>

                            <div className='profile-info'>
                                <h2>🐹 코코</h2>
                                <p className='desc'>"안뇽하세요, 코코입니다."</p>
                                <ul className='stats'>
                                    <li>🎂 23.04.07</li>
                                    <li className='d-day'>함께한 지 D+{dDay}일</li>
                                    <li>✨ 골든햄스터/도브 장모종</li>
                                </ul>
                            </div>
                            <button className='back-btn' onClick={() => navigate('/home')}>
                                🏠 홈으로 가기
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            <main className='content-wrapper'>
                <header className='gallery-header'>
                    <button
                        className='toggle-btn'
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        title={isSidebarOpen ? '프로필 접기' : '프로필 펼치기'}
                    >
                        {isSidebarOpen ? '◀' : '▶'}
                    </button>
                    <h1>📸 코코의 추억 갤러리</h1>
                </header>

                <div className='photo-grid'>
                    {galleryImages.map((img) => (
                        <motion.div
                            key={img.id}
                            className='photo-item'
                            whileHover={{ scale: 1.05 }}
                            onClick={() => navigate(`/gallery/${img.id}`)}
                        >
                            <img src={frameImg} alt='frame' className='frame-overlay' />
                            <img src={img.src} alt={img.title} className='photo-img' />
                        </motion.div>
                    ))}
                </div>

                <Footer />
            </main>
        </div>
    );
}

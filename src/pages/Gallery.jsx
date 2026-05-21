import { useState, useMemo, useEffect } from 'react';
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

    const getIsMobile = () => window.innerWidth <= 768;

    const [isMobile, setIsMobile] = useState(getIsMobile);
    const [isSidebarOpen, setSidebarOpen] = useState(!getIsMobile());
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;

            setIsMobile(mobile);

            if (!mobile) {
                setSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const togetherDays = useMemo(() => {
        const birthDate = new Date('2023-04-07');
        const goodbyeDate = new Date('2026-02-26');

        const diffTime = goodbyeDate - birthDate;

        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }, []);

    const sidebarVariants = {
        open: {
            width: isMobile ? '100vw' : 320,
            opacity: 1,
            x: 0,
        },
        closed: {
            width: 0,
            opacity: 0,
            x: isMobile ? -50 : 0,
        },
    };

    return (
        <div className='gallery-container'>
            <AnimatePresence mode='wait'>
                {isSidebarOpen && (
                    <motion.aside
                        className='sidebar'
                        initial='closed'
                        animate='open'
                        exit='closed'
                        variants={sidebarVariants}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                    >
                        {isMobile && (
                            <button className='mobile-close-btn' onClick={() => setSidebarOpen(false)}>
                                ✖
                            </button>
                        )}

                        <div className='profile-card'>
                            <button
                                type='button'
                                className={`profile-img-container ${isFlipped ? 'flipped' : ''}`}
                                onClick={() => setIsFlipped(!isFlipped)}
                            >
                                <div className='flipper'>
                                    <div className='front'>
                                        <img src={profileImg} alt='코코 프로필' />
                                    </div>

                                    <div className='back'>
                                        <div className='back-content'>보고 싶어 🐹</div>
                                    </div>
                                </div>
                            </button>

                            <div className='profile-info'>
                                <h2>🐹 코코</h2>

                                <p className='desc'>"안뇽하세요, 코코입니다."</p>

                                <ul className='stats'>
                                    <li>🎂 2023.04.07</li>

                                    <li className='d-day'>함께한 시간 {togetherDays}일</li>

                                    <li>🌙 2023.04.07 - 2026.02.26</li>

                                    <li>✨ 골든햄스터 / 도브 장모종</li>
                                </ul>
                            </div>

                            <div className='sidebar-buttons'>
                                <button className='back-btn' onClick={() => navigate('/home')}>
                                    🏠 홈으로 가기
                                </button>

                                {isMobile && (
                                    <button className='close-gallery-btn' onClick={() => setSidebarOpen(false)}>
                                        📸 갤러리 보러가기
                                    </button>
                                )}
                            </div>
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
                        {!isSidebarOpen || !isMobile ? (isSidebarOpen ? '◀' : '▶') : '▶'}
                    </button>

                    <h1>📸 코코의 추억 갤러리</h1>
                </header>

                <div className='photo-grid'>
                    {galleryImages.map((img) => (
                        <motion.div
                            key={img.id}
                            className='photo-item'
                            whileHover={!isMobile ? { scale: 1.05 } : {}}
                            onClick={() => navigate(`/gallery/${img.id}`)}
                        >
                            <img src={frameImg} alt='frame' className='frame-overlay' />

                            <img src={img.src} alt={img.title} className='photo-img' loading='lazy' />
                        </motion.div>
                    ))}
                </div>

                <Footer />
            </main>
        </div>
    );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import gameCocoImg from '../assets/hamster_main.webp';
import thumb1 from '../assets/hamster_main.webp';
import thumbLock from '../assets/key_ball.webp';
import './GameLobby.css';

export default function GameLobby() {
    const navigate = useNavigate();

    const [description, setDescription] = useState('안녕! 나는 게임 마스터 코코야. 🐹<br/>할 게임을 골라봐!');
    const [popup, setPopup] = useState({
        show: false,
        title: '',
        message: '',
        type: '',
        onConfirm: null,
    });

    const games = [
        {
            id: 1,
            title: '달려라 코코!',
            img: thumb1,
            desc: '장애물을 피해서 해바라기씨를 모으는<br/>신나는 러닝 게임이야!',
            active: true,
            link: '/game/run-coco',
        },
        {
            id: 2,
            title: '준비중...',
            img: thumbLock,
            desc: '아직 공사 중이야!<br/>조금만 기다려줘~ 🚧',
            active: false,
        },
        {
            id: 3,
            title: '준비중...',
            img: thumbLock,
            desc: '더 재미있는 게임을<br/>준비하고 있어! 💤',
            active: false,
        },
    ];

    const handleCardClick = (game) => {
        if (game.active) {
            setPopup({
                show: true,
                title: '🎮 게임 시작',
                message: `[${game.title}]<br/>게임을 시작할까요?`,
                type: 'confirm',
                onConfirm: () => navigate(game.link),
            });
        } else {
            setPopup({
                show: true,
                title: '🚧 공사중',
                message: '아직 열심히 준비 중인 게임이에요!<br/>조금만 기다려주세요!',
                type: 'info',
                onConfirm: null,
            });
        }
    };

    const closePopup = () => {
        setPopup({ ...popup, show: false });
    };

    return (
        <div className='game-lobby-container'>
            <nav className='lobby-nav'>
                <button onClick={() => navigate('/home')}>🏠 홈으로 가기</button>
            </nav>
            <div className='mascot-area'>
                <div className='speech-bubble-game'>
                    <p dangerouslySetInnerHTML={{ __html: description }} />
                </div>
                <motion.img
                    src={gameCocoImg}
                    alt='Game Master Coco'
                    className='mascot-img'
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            <div className='game-card-list'>
                {games.map((game) => (
                    <motion.div
                        key={game.id}
                        className={`game-card ${!game.active ? 'locked' : ''}`}
                        whileHover={{ scale: 1.05, y: -10 }}
                        onMouseEnter={() => setDescription(game.desc)}
                        onMouseLeave={() => setDescription('안녕! 나는 게임 마스터 코코야. 🐹<br/>할 게임을 골라봐!')}
                        onClick={() => handleCardClick(game)}
                    >
                        <div className='card-image'>
                            <img src={game.img} alt={game.title} />
                            {!game.active && <div className='lock-overlay'>🔒</div>}
                        </div>
                        <div className='card-title'>{game.title}</div>
                    </motion.div>
                ))}
            </div>

            <Footer className='fixed-bottom' />
            <AnimatePresence>
                {popup.show && (
                    <div className='modal-overlay' onClick={closePopup}>
                        <motion.div
                            className='custom-modal'
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3>{popup.title}</h3>
                            <p dangerouslySetInnerHTML={{ __html: popup.message }} />

                            <div className='modal-buttons'>
                                {popup.type === 'confirm' ? (
                                    <>
                                        <button className='cancel-btn' onClick={closePopup}>
                                            아니오
                                        </button>
                                        <button className='confirm-btn' onClick={popup.onConfirm}>
                                            네, 할래요!
                                        </button>
                                    </>
                                ) : (
                                    <button className='confirm-btn' onClick={closePopup}>
                                        알겠어요!
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import hamsterImg from '../assets/hamster_main.webp';
import './MainHome.css';
import Footer from '../components/Footer';

export default function MainHome() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);

    const next = () => setStep((prev) => Math.min(prev + 1, 2));

    return (
        <div className='main-room'>
            <div className='content-area'>
                <div className='bubble-zone'>
                    <AnimatePresence mode='wait'>
                        {step === 1 && (
                            <motion.div
                                key='hello'
                                className='speech-bubble'
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={next}
                            >
                                나는 코코야 🐹
                                <br />내 방에 온 걸 환영해!
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key='menu'
                                className='action-buttons'
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <button onClick={() => navigate('/game')} className='menu-btn game'>
                                    🎮 코코랑 게임할래?
                                </button>
                                <button onClick={() => navigate('/gallery')} className='menu-btn gallery'>
                                    📸 코코 사진 볼래?
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <img src={hamsterImg} alt='Coco' className='hamster-wiggle hamster' onClick={next} />
                <Footer className='fixed-bottom' />
            </div>
        </div>
    );
}

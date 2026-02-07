import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import keyBallImg from '../assets/key_ball.webp';
import './Intro.css';

const BALL_COUNT = 30;

export default function Intro() {
    const navigate = useNavigate();
    const [skipChecked, setSkipChecked] = useState(false);
    const [balls] = useState(() => {
        return Array.from({ length: BALL_COUNT }).map((_, i) => ({
            id: i,
            isKey: i === 7,
            x: Math.random() * 100,
            duration: Math.random() * 3 + 4,
            delay: Math.random() * 5,
            size: Math.random() * 60 + 80,
            color: `hsla(${Math.random() * 360}, 80%, 75%, 0.8)`,
            sway: Math.random() * 100 - 50,
        }));
    });

    useEffect(() => {
        if (localStorage.getItem('skipIntro') === 'true') {
            navigate('/home');
        }
    }, [navigate]);

    const handleEnter = () => {
        if (skipChecked) {
            localStorage.setItem('skipIntro', 'true');
        }
        navigate('/home');
    };

    return (
        <div className='intro-container'>
            <div className='skip-option'>
                <label>
                    <input type='checkbox' checked={skipChecked} onChange={(e) => setSkipChecked(e.target.checked)} />
                    <span>다음부터 바로 코코의 방으로 가기</span>
                </label>
            </div>

            {balls.map((ball) => (
                <motion.div
                    key={ball.id}
                    className='ball'
                    initial={{ y: '-20vh', x: 0, opacity: 0 }}
                    animate={{
                        y: '120vh',
                        opacity: [0, 1, 1, 0],
                        x: [0, ball.sway, -ball.sway, 0],
                    }}
                    transition={{
                        duration: ball.duration,
                        repeat: Infinity,
                        delay: ball.delay,
                        ease: 'linear',
                    }}
                    style={{
                        left: `${ball.x}%`,
                        width: ball.size,
                        height: ball.size,
                        backgroundColor: ball.isKey ? 'rgba(255,255,255,0.4)' : ball.color,
                        cursor: ball.isKey ? 'pointer' : 'default',
                        zIndex: ball.isKey ? 10 : 1,
                        border: '2px solid rgba(255,255,255,0.6)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    }}
                    onClick={ball.isKey ? handleEnter : undefined}
                >
                    {ball.isKey && <img src={keyBallImg} alt='key ball' className='key-ball-img' draggable={false} />}
                </motion.div>
            ))}

            <div className='hint-text'>열쇠가 들어있는 공을 찾아 눌러주세요!</div>
        </div>
    );
}

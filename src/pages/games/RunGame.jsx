import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import cocoRunImg from '../../assets/coco_run.gif';
import obstacleImg from '../../assets/obstacle.webp';
import './RunGame.css';

export default function RunGame() {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);

    const [isJumping, setIsJumping] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isGameStarted, setIsGameStarted] = useState(false);

    const cocoRef = useRef(null);
    const obstacleRef = useRef(null);
    const scoreInterval = useRef(null);

    useEffect(() => {
        const checkMobile = () => {
            const userAgent = navigator.userAgent;
            const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
            if (mobileRegex.test(userAgent)) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };
        checkMobile();
    }, []);

    const handleGameOver = () => {
        setIsGameOver(true);
        setIsGameStarted(false);
        if (scoreInterval.current) clearInterval(scoreInterval.current);
    };

    const jump = useCallback(() => {
        if (!isJumping && !isGameOver && isGameStarted) {
            setIsJumping(true);
            setTimeout(() => {
                setIsJumping(false);
            }, 500);
        }
    }, [isJumping, isGameOver, isGameStarted]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                jump();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [jump]);

    const startGame = () => {
        setIsGameStarted(true);
        setIsGameOver(false);
        setScore(0);

        if (scoreInterval.current) clearInterval(scoreInterval.current);

        scoreInterval.current = setInterval(() => {
            setScore((prev) => prev + 1);
        }, 100);
    };

    useEffect(() => {
        let collisionCheck;

        if (isGameStarted && !isGameOver) {
            collisionCheck = setInterval(() => {
                const coco = cocoRef.current;
                const obstacle = obstacleRef.current;

                if (coco && obstacle) {
                    const cocoRect = coco.getBoundingClientRect();
                    const obstacleRect = obstacle.getBoundingClientRect();

                    if (
                        cocoRect.right > obstacleRect.left + 20 &&
                        cocoRect.left < obstacleRect.right - 20 &&
                        cocoRect.bottom > obstacleRect.top + 20
                    ) {
                        handleGameOver();
                    }
                }
            }, 10);
        }

        return () => clearInterval(collisionCheck);
    }, [isGameStarted, isGameOver]);

    useEffect(() => {
        return () => {
            if (scoreInterval.current) clearInterval(scoreInterval.current);
        };
    }, []);

    return (
        <div className='game-screen' onClick={jump}>
            {isMobile && (
                <div className='rotate-warning'>
                    <div className='phone-icon'>📱🔄</div>
                    <p>
                        화면을 가로로 돌려주세요!
                        <br />더 넓은 화면에서 즐길 수 있어요.
                    </p>
                </div>
            )}

            <div className='score-board'>점수: {score}</div>

            <button
                className='exit-btn'
                onClick={(e) => {
                    e.stopPropagation();
                    navigate('/game');
                }}
            >
                나가기
            </button>

            {!isGameStarted && (
                <div className='start-screen'>
                    {isGameOver ? (
                        <>
                            <h2>💥 쿵! 부딪혔어요</h2>
                            <p className='final-score'>최종 점수: {score}점</p>
                        </>
                    ) : (
                        <>
                            <h2>🐹 달려라 코코!</h2>
                            <p>
                                화면을 클릭하거나
                                <br />
                                스페이스바를 눌러 점프하세요!
                            </p>
                        </>
                    )}

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            startGame();
                        }}
                    >
                        {isGameOver ? '다시 도전하기' : '게임 시작'}
                    </button>
                </div>
            )}

            <div ref={cocoRef} className={`coco-character ${isJumping ? 'jump' : ''}`}>
                <img src={cocoRunImg} alt='Coco' />
            </div>

            <div ref={obstacleRef} className={`obstacle ${isGameStarted ? 'moving' : ''}`}>
                <img src={obstacleImg} alt='Obstacle' />
            </div>

            <div className='ground'></div>
        </div>
    );
}

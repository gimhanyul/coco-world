import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import cocoRunImg from '../../assets/coco_run.gif';
import obstacleImg from '../../assets/obstacle.webp';
import './RunGame.css';

export default function RunGame() {
    const navigate = useNavigate();

    const [isJumping, setIsJumping] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isGameStarted, setIsGameStarted] = useState(false);

    const cocoRef = useRef(null);
    const obstacleRef = useRef(null);
    const scoreInterval = useRef(null);

    // ★ [수정] handleGameOver를 가장 먼저 정의합니다! (위치 이동됨)
    const handleGameOver = () => {
        setIsGameOver(true);
        setIsGameStarted(false);
        if (scoreInterval.current) clearInterval(scoreInterval.current);
    };

    // 1. 점프 기능
    const jump = () => {
        if (!isJumping && !isGameOver && isGameStarted) {
            setIsJumping(true);
            setTimeout(() => {
                setIsJumping(false);
            }, 500);
        }
    };

    // 2. 게임 시작
    const startGame = () => {
        setIsGameStarted(true);
        setIsGameOver(false);
        setScore(0);

        if (scoreInterval.current) clearInterval(scoreInterval.current);

        scoreInterval.current = setInterval(() => {
            setScore((prev) => prev + 1);
        }, 100);
    };

    // 3. 충돌 감지 (이제 handleGameOver를 위에서 만들었기 때문에 에러가 안 납니다)
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
                        // 여기서 위에서 만든 함수를 호출
                        handleGameOver();
                    }
                }
            }, 10);
        }

        return () => clearInterval(collisionCheck);
    }, [isGameStarted, isGameOver]);

    // 컴포넌트가 사라질 때(나가기) 타이머 정리
    useEffect(() => {
        return () => {
            if (scoreInterval.current) clearInterval(scoreInterval.current);
        };
    }, []);

    return (
        <div className='game-screen' onClick={jump}>
            {/* ... (아래 JSX 코드는 그대로 유지) ... */}
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

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { galleryImages } from '../data';
import Footer from '../components/Footer';
import './GalleryDetail.css';

import { db } from '../firebase';
import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    updateDoc,
    doc,
    increment,
    serverTimestamp,
} from 'firebase/firestore';

export default function GalleryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const photo = galleryImages.find((item) => item.id === parseInt(id));
    const [comments, setComments] = useState([]);
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'comments'), where('imageId', '==', id));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newComments = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setComments(newComments);
        });
        return () => unsubscribe();
    }, [id]);

    const handleAddComment = async () => {
        if (!inputText.trim()) return;
        await addDoc(collection(db, 'comments'), {
            imageId: id,
            user: '익명 햄찌',
            text: inputText,
            likes: 0,
            createdAt: serverTimestamp(),
        });

        setInputText('');
    };

    const handleLike = async (commentId) => {
        const commentRef = doc(db, 'comments', commentId);
        await updateDoc(commentRef, {
            likes: increment(1),
        });
    };
    const sortedComments = [...comments].sort((a, b) => b.likes - a.likes);

    if (!photo) return <div>사진을 찾을 수 없어요!</div>;

    return (
        <div className='detail-container'>
            <nav className='detail-nav'>
                <button onClick={() => navigate('/gallery')}>🔙 갤러리로 돌아가기</button>
            </nav>

            <div className='detail-content'>
                <section className='left-section'>
                    <div className='image-frame'>
                        <img src={photo.src} alt={photo.title} />
                    </div>

                    <div className='info-text'>
                        <h2>{photo.title}</h2>
                        <span className='date'>{photo.date}</span>
                        <p className='description'>{photo.desc}</p>
                    </div>
                </section>
                <section className='right-section'>
                    <div className='comment-header'>
                        <h3>💬 햄스터 톡 ({comments.length})</h3>
                        <span className='sort-info'>🔥 인기순 정렬됨</span>
                    </div>

                    <ul className='comment-list'>
                        {sortedComments.map((c) => (
                            <li key={c.id} className='comment-item'>
                                <div className='comment-main'>
                                    <strong>{c.user}</strong>
                                    <p>{c.text}</p>
                                </div>
                                <button className='like-btn' onClick={() => handleLike(c.id)} title='좋아요 누르기'>
                                    ❤️ {c.likes}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className='comment-input'>
                        <input
                            type='text'
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder='예쁜 댓글을 남겨주세요!'
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                        />
                        <button onClick={handleAddComment}>등록</button>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
}

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Intro from './pages/Intro';
import MainHome from './pages/MainHome';
import Gallery from './pages/Gallery';
import GalleryDetail from './pages/GalleryDetail';
import GameLobby from './pages/GameLobby';
import RunGame from './pages/games/RunGame';

function Layout() {
    return (
        <>
            <Routes>
                <Route path='/' element={<Intro />} />
                <Route path='/home' element={<MainHome />} />
                <Route path='/gallery' element={<Gallery />} />
                <Route path='/gallery/:id' element={<GalleryDetail />} />
                <Route path='/game' element={<GameLobby />} />
                <Route path='/game/run-coco' element={<RunGame />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
    );
}

export default App;

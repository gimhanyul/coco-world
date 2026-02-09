import './Footer.css';

export default function Footer({ className }) {
    const currentYear = new Date().getFullYear();
    return (
        <footer className={`global-footer ${className || ''}`}>
            {currentYear} © Coco World Made with 🧡 by <b>익명 햄찌</b>
        </footer>
    );
}

import './Footer.css';

export default function Footer({ className }) {
    return <footer className={`global-footer ${className || ''}`}>© Coco World</footer>;
}

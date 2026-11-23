import { useState } from "react";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <>
            <header className="topbar">
                <a href="#" className="brand">
                    <span className="brand-heart">♥</span> our little universe
                </a>

                {/* Tambahkan class "open" saat menuOpen === true */}
                <nav className={`navlinks ${menuOpen ? "open" : ""}`}>
                    <a href="#story" onClick={() => setMenuOpen(false)}>Our Story</a>
                    <a href="#letters" onClick={() => setMenuOpen(false)}>Open When</a>
                    <a href="#gallery" onClick={() => setMenuOpen(false)}>Gallery</a>
                    <a href="#bucket" onClick={() => setMenuOpen(false)}>Bucket List</a>
                </nav>

                <div className="nav-actions">
                    <a href="/admin" className="nav-pill">
                        Our timeline <span>↗</span>
                    </a>

                    {/* Tombol Hamburger Mobile */}
                    <button
                        type="button"
                        className="hamburger-btn"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>
                </div>
            </header>
        </>
    )
}
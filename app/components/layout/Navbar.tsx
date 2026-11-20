export default function Navbar() {
    return (
        <>
            <nav className="topbar">
                <a className="brand" href="#">
                    <span className="brand-heart">♥</span> our little universe
                </a>
                <div className="navlinks">
                    <a href="#story">Our Story</a>
                    <a href="#letters">Open When</a>
                    <a href="#gallery">Gallery</a>
                    <a href="#bucket">Bucket List</a>
                </div>
                <a className="nav-pill hover:bg-[#ead0cb]" href="#anniversary">
                    Our timeline <span>↗</span>
                </a>
            </nav>
        </>
    )
}
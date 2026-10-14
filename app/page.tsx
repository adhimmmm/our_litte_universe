"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Story = { title: string; date: string; text: string };
type Letter = { title: string; message: string };
type Memory = { title: string; image: string; caption: string };
type Wish = { text: string; done: boolean };
type SiteData = {
  names: string;
  startDate: string;
  note: string;
  stories: Story[];
  letters: Letter[];
  memories: Memory[];
  wishes: Wish[];
};

const KEY = "olu-site-data-v1";
const defaults: SiteData = {
  names: "Kamu & Aku",
  startDate: "2024-02-14",
  note: "Di antara miliaran manusia, semesta selalu punya cara untuk mempertemukan kita.",
  stories: [
    {
      title: "Awal dari kita",
      date: "14 Februari 2024",
      text: "Satu pertemuan sederhana yang perlahan menjadi cerita paling berarti.",
    },
    {
      title: "Hal-hal kecil",
      date: "Hari-hari setelahnya",
      text: "Pesan singkat, tawa kecil, dan waktu bersama yang selalu ingin diulang.",
    },
  ],
  letters: [
    {
      title: "Buka saat kamu lelah",
      message:
        "Istirahat dulu, ya. Kamu tidak harus menyelesaikan semuanya hari ini. Aku bangga sama kamu, selalu.",
    },
    {
      title: "Buka saat kamu merindukanku",
      message:
        "Anggap surat ini sebagai pelukan kecil dariku. Semoga jarak terasa sedikit lebih dekat.",
    },
    {
      title: "Buka saat kamu bahagia",
      message:
        "Aku suka melihatmu bahagia. Semoga ada banyak alasan baru untuk tersenyum setiap hari.",
    },
  ],
  memories: [],
  wishes: [
    { text: "Melihat matahari terbit bersama", done: false },
    { text: "Mencoba tempat makan yang belum pernah dikunjungi", done: false },
    { text: "Membuat album foto perjalanan kita", done: false },
  ],
};

function readData(): SiteData {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
}

function daysTogether(date: string) {
  const start = new Date(`${date}T00:00:00`);

  if (Number.isNaN(start.getTime())) {
    return 0;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.max(
    0,
    Math.floor((today.getTime() - start.getTime()) / 86400000),
  );
}

export default function HomePage() {
  const [data, setData] = useState<SiteData>(defaults);
  const [ready, setReady] = useState(false);
  const [openLetter, setOpenLetter] = useState<Letter | null>(null);

  useEffect(() => {
    setData(readData());
    setReady(true);
    const sync = () => setData(readData());
    window.addEventListener("storage", sync);
    window.addEventListener("olu-update", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("olu-update", sync);
    };
  }, []);

  const completed = data.wishes.filter((w) => w.done).length;

  return (
    <main>
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
        <a className="nav-pill" href="#anniversary">
          Our timeline <span>↗</span>
        </a>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-line" /> A LITTLE PLACE FOR US{" "}
            <span className="eyebrow-line" />
          </div>
          <h1>
            In this universe,
            <br />
            <em>it’s always you.</em>
          </h1>
          <p className="hero-text">{data.note}</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#story">
              Jelajahi cerita kita <span>↗</span>
            </a>
            <a className="text-link" href="#letters">
              Ada surat untukmu <span>♡</span>
            </a>
          </div>
          <div className="hero-footnote">
            <span className="tiny-heart">♥</span> dibuat dengan cinta, untuk
            kita saja
          </div>
        </div>
        <div className="hero-art">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-sun" />
          <div className="hero-photo">
            <div className="sunset-sky" />
            <div className="sunset-sun" />
            <div className="mountain mountain-back" />
            <div className="mountain mountain-front" />
            <div className="couple couple-left" />
            <div className="couple couple-right" />
            <span className="photo-label">you, me & our little world</span>
          </div>
          <div className="floating-note note-top">
            <span>✳</span> my favorite person
          </div>
          <div className="floating-note note-bottom">
            <span>♡</span> every day, still you
          </div>
          <span className="sparkle sparkle-a">✦</span>
          <span className="sparkle sparkle-b">✧</span>
        </div>
      </section>

      <section className="love-counter" id="anniversary">
        <div>
          <span className="section-kicker">A LOVE THAT KEEPS GROWING</span>
          <h2>
            Sudah sejauh ini, <em>bersama.</em>
          </h2>
        </div>
        <div className="counter-number">
          <strong>
            {ready ? daysTogether(data.startDate) : "—"}
          </strong>
          <span>hari dan masih terus bertambah ♡</span>
        </div>
        <div className="counter-date">
          <span>SEJAK HARI ITU</span>
          <strong>
            {new Date(`${data.startDate}T00:00:00`).toLocaleDateString(
              "id-ID",
              { day: "numeric", month: "long", year: "numeric" },
            )}
          </strong>
        </div>
      </section>

      <section className="section story-section" id="story">
        <div className="section-heading">
          <div>
            <span className="section-kicker">CHAPTERS OF US</span>
            <h2>
              Our little <em>story.</em>
            </h2>
          </div>
          <p>
            Setiap cerita punya awal. Ini adalah cerita favorit kita—yang masih
            terus ditulis.
          </p>
        </div>
        <div className="story-grid">
          {data.stories.map((story, i) => (
            <article className="story-card" key={`${story.title}-${i}`}>
              <span className="story-index">0{i + 1}</span>
              <span className="story-date">{story.date}</span>
              <h3>{story.title}</h3>
              <p>{story.text}</p>
              <span className="card-heart">♡</span>
            </article>
          ))}
        </div>
      </section>

      <section className="letters-section" id="letters">
        <div className="letters-intro">
          <span className="section-kicker">FOR THE DAYS YOU NEED ME</span>
          <h2>
            Open when
            <br />
            <em>you need a little love.</em>
          </h2>
          <p>
            Untuk hari-hari ketika aku tidak bisa berada tepat di sampingmu,
            semoga kata-kata ini bisa menemanimu.
          </p>
        </div>
        <div className="letter-list">
          {data.letters.map((letter, i) => (
            <button
              className="letter-row"
              key={`${letter.title}-${i}`}
              onClick={() => setOpenLetter(letter)}
            >
              <span className="letter-icon">✉</span>
              <span>{letter.title}</span>
              <span className="letter-arrow">↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="section gallery-section" id="gallery">
        <div className="section-heading">
          <div>
            <span className="section-kicker">LITTLE MOMENTS, FOREVER</span>
            <h2>
              Our <em>gallery.</em>
            </h2>
          </div>
          <p>
            Potongan kecil dari hari-hari yang ingin kita simpan lebih lama.
          </p>
        </div>
        {data.memories.length ? (
          <div className="memory-grid">
            {data.memories.map((memory, i) => (
              <figure className="memory-card" key={`${memory.title}-${i}`}>
                <img src={memory.image} alt={memory.title} />
                <figcaption>
                  <strong>{memory.title}</strong>
                  <span>{memory.caption}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="gallery-empty">
            <div className="empty-icon">♡</div>
            <h3>Ruang untuk kenangan kita</h3>
            <p>
              Foto yang kamu tambahkan melalui dashboard akan muncul di sini.
            </p>
            <Link href="/admin" className="text-link">
              Tambahkan kenangan <span>↗</span>
            </Link>
          </div>
        )}
      </section>

      <section className="bucket-section" id="bucket">
        <div className="bucket-inner">
          <div>
            <span className="section-kicker">SOMEDAY, WITH YOU</span>
            <h2>
              Things we want
              <br />
              to do <em>together.</em>
            </h2>
            <p>
              Daftar kecil untuk mimpi-mimpi besar yang ingin kita wujudkan
              berdua.
            </p>
            <div className="bucket-progress">
              <span>
                {completed} dari {data.wishes.length} mimpi terwujud
              </span>
              <div className="progress-track">
                <div
                  style={{
                    width: `${data.wishes.length ? (completed / data.wishes.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="wish-list">
            {data.wishes.map((wish, i) => (
              <div
                className={`wish-row ${wish.done ? "wish-done" : ""}`}
                key={`${wish.text}-${i}`}
              >
                <span className="wish-check">{wish.done ? "✓" : "♡"}</span>
                <span>{wish.text}</span>
                <span className="wish-number">0{i + 1}</span>
              </div>
            ))}
            <Link href="/admin" className="wish-manage">
              Tambah mimpi baru <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <a className="brand" href="#">
          <span className="brand-heart">♥</span> our little universe
        </a>
        <p>
          A tiny universe, made for two. <span>♡</span>
        </p>
        <span className="footer-stars">✦ &nbsp; ✧ &nbsp; ✦</span>
      </footer>

      {openLetter && (
        <div className="modal-backdrop" onClick={() => setOpenLetter(null)}>
          <div className="letter-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setOpenLetter(null)}
              aria-label="Tutup"
            >
              ×
            </button>
            <span className="section-kicker">A LITTLE NOTE FOR YOU</span>
            <span className="modal-heart">♡</span>
            <h2>{openLetter.title}</h2>
            <p>{openLetter.message}</p>
            <span className="modal-sign">with all my love, always.</span>
          </div>
        </div>
      )}
    </main>
  );
}

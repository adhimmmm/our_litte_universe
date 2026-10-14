"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

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
  ],
  letters: [
    {
      title: "Buka saat kamu lelah",
      message:
        "Istirahat dulu, ya. Kamu tidak harus menyelesaikan semuanya hari ini. Aku bangga sama kamu, selalu.",
    },
  ],
  memories: [],
  wishes: [
    { text: "Melihat matahari terbit bersama", done: false },
    { text: "Mencoba tempat makan yang belum pernah dikunjungi", done: false },
  ],
};

export default function AdminPage() {
  const supabase = createClient();
  const router = useRouter();

  const [data, setData] = useState<SiteData>(defaults);
  const [active, setActive] = useState("overview");
  const [saved, setSaved] = useState(false);
  const [story, setStory] = useState<Story>({ title: "", date: "", text: "" });
  const [letter, setLetter] = useState<Letter>({ title: "", message: "" });
  const [wish, setWish] = useState("");
  const [memoryTitle, setMemoryTitle] = useState("");
  const [memoryCaption, setMemoryCaption] = useState("");
  const [memoryImage, setMemoryImage] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setData({ ...defaults, ...JSON.parse(raw) });
    } catch {}
  }, []);

  function persist(next: SiteData) {
    setData(next);
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("olu-update"));
    setSaved(true);
    setNotice("Perubahan tersimpan di browser ini.");
    window.setTimeout(() => setSaved(false), 2400);
  }

  function addStory(e: FormEvent) {
    e.preventDefault();
    if (!story.title.trim() || !story.text.trim()) return;
    persist({ ...data, stories: [...data.stories, story] });
    setStory({ title: "", date: "", text: "" });
  }
  function addLetter(e: FormEvent) {
    e.preventDefault();
    if (!letter.title.trim() || !letter.message.trim()) return;
    persist({ ...data, letters: [...data.letters, letter] });
    setLetter({ title: "", message: "" });
  }
  function addWish(e: FormEvent) {
    e.preventDefault();
    if (!wish.trim()) return;
    persist({
      ...data,
      wishes: [...data.wishes, { text: wish.trim(), done: false }],
    });
    setWish("");
  }
  function uploadPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setNotice("Pilih file gambar.");
      return;
    }
    if (file.size > 1_000_000) {
      setNotice(
        "Untuk demo lokal, pilih gambar di bawah 1 MB. Upload online akan kita buat lewat Supabase.",
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const memory = {
        title: memoryTitle.trim() || file.name.replace(/\.[^.]+$/, ""),
        image: String(reader.result),
        caption: memoryCaption.trim(),
      };
      persist({ ...data, memories: [...data.memories, memory] });
      setMemoryTitle("");
      setMemoryCaption("");
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  }
  function removeAt<T>(
    key: "stories" | "letters" | "memories" | "wishes",
    index: number,
  ) {
    const next = [...(data[key] as T[])];
    next.splice(index, 1);
    persist({ ...data, [key]: next });
  }

  const nav = [
    { id: "overview", label: "Ringkasan", icon: "◫" },
    { id: "settings", label: "Pengaturan", icon: "⚙" },
    { id: "stories", label: "Our Story", icon: "♡" },
    { id: "letters", label: "Open When", icon: "✉" },
    { id: "gallery", label: "Our Gallery", icon: "▧" },
    { id: "wishes", label: "Bucket List", icon: "✧" },
  ];

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/" className="admin-brand">
          <span className="brand-heart">♥</span>
          <span>
            our little
            <br />
            <strong>universe</strong>
          </span>
        </Link>
        <div className="sidebar-caption">WORKSPACE</div>
        <nav className="admin-nav">
          {nav.map((item) => (
            <button
              key={item.id}
              className={active === item.id ? "active" : ""}
              onClick={() => setActive(item.id)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">

          <button
            type="button"
            className="sidebar-logout"
            onClick={async () => {
              const { error } = await supabase.auth.signOut();

              if (error) {
                setNotice("Logout gagal. Silakan coba lagi.");
                return;
              }

              router.replace("/login");
              router.refresh();
            }}
          >
            <span aria-hidden="true">↪</span>
            Logout
          </button>

        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="section-kicker">YOUR PRIVATE CORNER</span>
            <h1>
              Dashboard <em>workspace.</em>
            </h1>
          </div>
          <Link className="button button-dark" href="/">
            Lihat homepage ↗
          </Link>
        </header>
        {notice && (
          <div className={`notice ${saved ? "notice-success" : ""}`}>
            {notice}
            <button onClick={() => setNotice("")}>×</button>
          </div>
        )}
        {active === "overview" && (
          <section>
            <div className="welcome-panel">
              <div>
                <span className="section-kicker">
                  A LITTLE SPACE, JUST FOR YOU
                </span>
                <h2>
                  Kelola cerita <em>kalian.</em>
                </h2>
                <p>
                  Semua kenangan yang kamu tambahkan akan ditampilkan di
                  homepage pada browser ini.
                </p>
              </div>
              <span className="welcome-art">♡</span>
            </div>
            <div className="admin-stats">
              <div>
                <span>CHAPTERS</span>
                <strong>{data.stories.length}</strong>
                <small>Our Story</small>
              </div>
              <div>
                <span>LOVE NOTES</span>
                <strong>{data.letters.length}</strong>
                <small>Open When</small>
              </div>
              <div>
                <span>MEMORIES</span>
                <strong>{data.memories.length}</strong>
                <small>Our Gallery</small>
              </div>
              <div>
                <span>WISHES</span>
                <strong>{data.wishes.length}</strong>
                <small>Bucket List</small>
              </div>
            </div>
            <div className="admin-card">
              <div className="admin-card-heading">
                <div>
                  <span className="section-kicker">QUICK START</span>
                  <h3>Mulai mengisi semesta kecilmu</h3>
                </div>
              </div>
              <div className="quick-grid">
                {nav.slice(1).map((n) => (
                  <button key={n.id} onClick={() => setActive(n.id)}>
                    <span>{n.icon}</span>
                    <strong>{n.label}</strong>
                    <small>Kelola konten ↗</small>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
        {active === "settings" && (
          <section className="admin-card">
            <div className="admin-card-heading">
              <div>
                <span className="section-kicker">MAKE IT YOURS</span>
                <h3>Pengaturan semesta</h3>
                <p>Personalisasi homepage kalian.</p>
              </div>
            </div>
            <form
              className="admin-form"
              onSubmit={(e) => {
                e.preventDefault();
                persist(data);
              }}
            >
              <label>
                Nama pasangan
                <input
                  value={data.names}
                  onChange={(e) => setData({ ...data, names: e.target.value })}
                  placeholder="Kamu & Aku"
                />
              </label>
              <label>
                Tanggal jadian
                <input
                  type="date"
                  value={data.startDate}
                  onChange={(e) =>
                    setData({ ...data, startDate: e.target.value })
                  }
                />
              </label>
              <label className="full-field">
                Pesan utama homepage
                <textarea
                  value={data.note}
                  onChange={(e) => setData({ ...data, note: e.target.value })}
                  rows={3}
                />
              </label>
              <button className="button button-dark" type="submit">
                Simpan pengaturan ♡
              </button>
            </form>
          </section>
        )}
        {active === "stories" && (
          <section className="admin-card">
            <div className="admin-card-heading">
              <div>
                <span className="section-kicker">CHAPTERS OF US</span>
                <h3>Our Story</h3>
                <p>Tambahkan momen penting dalam perjalanan kalian.</p>
              </div>
            </div>
            <form className="admin-form" onSubmit={addStory}>
              <label>
                Judul cerita
                <input
                  value={story.title}
                  onChange={(e) =>
                    setStory({ ...story, title: e.target.value })
                  }
                  required
                  placeholder="Awal dari kita"
                />
              </label>
              <label>
                Tanggal / label
                <input
                  value={story.date}
                  onChange={(e) => setStory({ ...story, date: e.target.value })}
                  placeholder="14 Februari 2024"
                />
              </label>
              <label className="full-field">
                Cerita
                <textarea
                  value={story.text}
                  onChange={(e) => setStory({ ...story, text: e.target.value })}
                  rows={4}
                  required
                  placeholder="Tuliskan kenangan kalian..."
                />
              </label>
              <button className="button button-dark">Tambah cerita +</button>
            </form>
            <div className="manage-list">
              {data.stories.map((s, i) => (
                <div key={`${s.title}-${i}`}>
                  <span>
                    <strong>{s.title}</strong>
                    <small>{s.date}</small>
                  </span>
                  <button onClick={() => removeAt<Story>("stories", i)}>
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
        {active === "letters" && (
          <section className="admin-card">
            <div className="admin-card-heading">
              <div>
                <span className="section-kicker">FOR THE DAYS YOU NEED ME</span>
                <h3>Open When</h3>
                <p>Siapkan surat yang bisa dibuka pada momen tertentu.</p>
              </div>
            </div>
            <form className="admin-form" onSubmit={addLetter}>
              <label>
                Judul surat
                <input
                  value={letter.title}
                  onChange={(e) =>
                    setLetter({ ...letter, title: e.target.value })
                  }
                  required
                  placeholder="Buka saat kamu rindu"
                />
              </label>
              <label className="full-field">
                Isi surat
                <textarea
                  value={letter.message}
                  onChange={(e) =>
                    setLetter({ ...letter, message: e.target.value })
                  }
                  rows={4}
                  required
                  placeholder="Tulis pesan dari hati..."
                />
              </label>
              <button className="button button-dark">Tambah surat +</button>
            </form>
            <div className="manage-list">
              {data.letters.map((l, i) => (
                <div key={`${l.title}-${i}`}>
                  <span>
                    <strong>{l.title}</strong>
                    <small>{l.message}</small>
                  </span>
                  <button onClick={() => removeAt<Letter>("letters", i)}>
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
        {active === "gallery" && (
          <section className="admin-card">
            <div className="admin-card-heading">
              <div>
                <span className="section-kicker">LITTLE MOMENTS, FOREVER</span>
                <h3>Our Gallery</h3>
                <p>
                  Unggah gambar untuk kenangan kalian. Mode ini masih lokal dan
                  gambar maksimal 1 MB.
                </p>
              </div>
            </div>
            <form
              className="admin-form"
              onSubmit={(e) => {
                e.preventDefault();
                document.getElementById("photo-input")?.click();
              }}
            >
              <label>
                Judul foto
                <input
                  value={memoryTitle}
                  onChange={(e) => setMemoryTitle(e.target.value)}
                  placeholder="Hari pertama liburan"
                />
              </label>
              <label>
                Caption
                <input
                  value={memoryCaption}
                  onChange={(e) => setMemoryCaption(e.target.value)}
                  placeholder="Satu hari yang hangat..."
                />
              </label>
              <label className="full-field upload-field">
                Pilih foto
                <input
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  onChange={uploadPhoto}
                />
              </label>
            </form>
            <div className="admin-photo-grid">
              {data.memories.map((m, i) => (
                <div className="admin-photo" key={`${m.title}-${i}`}>
                  <img src={m.image} alt={m.title} />
                  <div>
                    <strong>{m.title}</strong>
                    <button onClick={() => removeAt<Memory>("memories", i)}>
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {active === "wishes" && (
          <section className="admin-card">
            <div className="admin-card-heading">
              <div>
                <span className="section-kicker">SOMEDAY, WITH YOU</span>
                <h3>Bucket List</h3>
                <p>Catat hal-hal yang ingin kalian lakukan bersama.</p>
              </div>
            </div>
            <form className="admin-form" onSubmit={addWish}>
              <label className="full-field">
                Keinginan baru
                <input
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  required
                  placeholder="Misalnya, melihat aurora bersama..."
                />
              </label>
              <button className="button button-dark">Tambah keinginan +</button>
            </form>
            <div className="manage-list">
              {data.wishes.map((w, i) => (
                <div key={`${w.text}-${i}`}>
                  <label className="wish-admin">
                    <input
                      type="checkbox"
                      checked={w.done}
                      onChange={(e) =>
                        persist({
                          ...data,
                          wishes: data.wishes.map((x, j) =>
                            j === i ? { ...x, done: e.target.checked } : x,
                          ),
                        })
                      }
                    />
                    <span>
                      <strong>{w.text}</strong>
                      <small>
                        {w.done ? "Sudah terwujud ♡" : "Masih jadi impian"}
                      </small>
                    </span>
                  </label>
                  <button onClick={() => removeAt<Wish>("wishes", i)}>
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
        <footer className="admin-footer">
          Made with love <span>♥</span> · Our Little Universe
        </footer>
      </main>
    </div>
  );
}

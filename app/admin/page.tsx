"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChangeEvent, SubmitEvent, useEffect, useState } from "react";

type Story = { id?: string; title: string; date: string; text: string };
type Letter = { id?: string; title: string; message: string };
type Wish = { id?: string; text: string; done: boolean };
type Memory = { id?: string; title: string; image: string; caption: string };

type SiteData = {
  names: string;
  startDate: string;
  note: string;
  stories: Story[];
  letters: Letter[];
  memories: Memory[];
  wishes: Wish[];
};


export default function AdminPage() {
  const supabase = createClient();
  const router = useRouter();

  const [data, setData] = useState<SiteData>({
    names: "",
    startDate: "",
    note: "",
    stories: [],
    letters: [],
    memories: [],
    wishes: [],
  });
  const [active, setActive] = useState("overview");
  const [saved, setSaved] = useState(false);
  const [story, setStory] = useState<Story>({ title: "", date: "", text: "" });
  const [letter, setLetter] = useState<Letter>({ title: "", message: "" });
  const [wish, setWish] = useState("");
  const [memoryTitle, setMemoryTitle] = useState("");
  const [memoryCaption, setMemoryCaption] = useState("");
  const [memoryImage, setMemoryImage] = useState("");
  const [notice, setNotice] = useState("");


  // FUNGSI UNTUK SIDEBAR PENGATURAN
  useEffect(() => {
    async function loadSettings() {
      const { data: settings, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        setNotice("Gagal memuat pengaturan dari database.");
        console.error("Gagal memuat pengaturan:", error);
        return;
      }

      if (settings) {
        setData((current) => ({
          ...current,
          names: settings.name,
          startDate: settings.start_date,
          note: settings.note,
        }));
      }
    }

    loadSettings();
  }, []);

  async function persist(next: SiteData) {
    setData(next);
    setSaved(false);
    setNotice("");

    const { error } = await supabase
      .from("site_settings")
      .upsert({
        id: 1,
        names: next.names,
        start_date: next.startDate,
        note: next.note,
        updated_at: new Date().toISOString(),
      },
        { onConflict: "id" }
      );

    if (error) {
      setNotice("Gagal menyimpan pengaturan ke database.");
      console.error("Gagal menyimpan pengaturan:", error);
      return;
    }

    setSaved(true);
    setNotice("Perubahan berhasil disimpan.");
    window.setTimeout(() => setSaved(false), 2000);
  }

  // FUNGSI UNTUK SIDEBAR STORY
  useEffect(() => {
    async function loadStories() {
      const { data: stories, error } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        setNotice("Gagal memuat Our Story dari database.");
        console.error("Gagal memuat cerita:", error);
        return;
      }

      setData((current) => ({
        ...current,
        stories: stories ?? [],
      }));
    }
    loadStories();
  }, []);

  // Fungsi untuk menambahkan cerita baru ke database
  async function addStory(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!story.title.trim() || !story.text.trim()) return;

    const { data: newStory, error } = await supabase
      .from("stories")
      .insert({
        title: story.title.trim(),
        date: story.date.trim(),
        text: story.text.trim(),
      })
      .select("id, title, date, text")
      .single();

    if (error) {
      setNotice("Gagal menambahkan cerita ke database.");
      console.error("Gagal menambahkan cerita:", error);
      return;
    }

    setData((current) => ({
      ...current,
      stories: [...current.stories, newStory],
    }));

    setStory({ title: "", date: "", text: "" });
    setSaved(true);
    setNotice("Cerita berhasil ditambahkan.");


    window.setTimeout(() => setSaved(false), 2000);
  }

  // Fungsi untuk menghapus cerita dari database
  async function removeStory(story: Story) {
    if (!story.id) {
      setNotice("ID cerita tidak ditemukan. Muat ulang halaman.");
      return;
    }

    const { error } = await supabase
      .from("stories")
      .delete()
      .eq("id", story.id);

    if (error) {
      setNotice("Gagal menghapus cerita dari database.");
      console.error("Gagal menghapus cerita:", error);
      return;
    }

    setData((current) => ({
      ...current,
      stories: current.stories.filter((s) => s.id !== story.id),
    }));

    setSaved(true);
    setNotice("Cerita berhasil dihapus.");
    window.setTimeout(() => setSaved(false), 2000);
  }

  // FUNGSI UNTUK SIDEBAR LETTER
  useEffect(() => {
    async function loadLetters() {
      const { data: letters, error } = await supabase
        .from("letters")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        setNotice("Gagal memuat surat dari database.");
        console.error("Gagal memuat surat:", error);
        return;
      }

      setData((current) => ({
        ...current,
        letters: letters ?? [],
      }));
    }
    loadLetters();
  }, []);

  // Fungsi untuk menambahkan surat baru ke database
  async function addLetter(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!letter.title.trim() || !letter.message.trim()) return;

    const { data: newLetter, error } = await supabase
      .from("letters")
      .insert({
        title: letter.title.trim(),
        message: letter.message.trim(),
      })
      .select("id, title, message")
      .single();

    if (error) {
      setNotice("Gagal menyimpan surat ke database");
      console.error("Gagal menyimpan surat ke database:", error);
      return;
    }

    setData((current) => ({
      ...current,
      letters: [...current.letters, newLetter],
    }));

    setLetter({ title: "", message: "" });
    setSaved(true);
    setNotice("Surat berhasil disimpan ke database.");

    window.setTimeout(() => setSaved(false), 2000);
  }

  // Fungsi untuk mengahapus surat dari database
  async function removeLetter(letter: Letter) {
    if (!letter.id) {
      setNotice("ID surat tidak ditemukan. Muat ulang halaman.");
      return;
    }

    const { error } = await supabase
      .from("letters")
      .delete()
      .eq("id", letter.id);

    if (error) {
      setNotice("Gagal menghapus surat dari database.");
      console.error("Gagal menghapus surat dari database:", error);
      return;
    }

    setData((current) => ({
      ...current,
      letters: current.letters.filter((l) => l.id !== letter.id),
    }));

    setSaved(true);
    setNotice("Surat berhasil dihapus dari database.");
    window.setTimeout(() => setSaved(false), 2000);
  }

  // FUNGSI UNTUK SIDEBAR WISH
  useEffect(() => {
    async function loadwishes() {
      const { data: wishes, error } = await supabase
        .from("wishes")
        .select("id, text, done")
        .order("created_at", { ascending: true });

      if (error) {
        setNotice("Gagal memuat Bucket List dari database.");
        console.error("Gagal memuat wish:", error);
        return;
      }

      setData((current) => ({
        ...current,
        wishes: wishes ?? [],
      }));
    }
    loadwishes();
  }, []);

  // Fungsi untuk menambahkan wish baru ke database
  async function addWish(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!wish.trim()) return;

    const { data: newWish, error } = await supabase
      .from("wishes")
      .insert({
        text: wish.trim(),
        done: false,
      })
      .select("id, text, done")
      .single();

    if (error) {
      setNotice("Gagal menyimpan wish ke database.");
      console.error("Gagal menyimpan wish ke database:", error);
      return;
    }

    setData((current) => ({
      ...current,
      wishes: [...current.wishes, newWish],
    }));

    setWish("");
    setSaved(true);
    setNotice("Wish berhasil disimpan ke database.");
    window.setTimeout(() => setSaved(false), 2000);
  }

  // Fungsi untuk checkbox wish done
  async function toggleWish(wish: Wish) {

    if (!wish.id) {
      setNotice("ID wish tidak ditemukan. Muat ulang halaman.");
      return;
    }

    const nextDone = !wish.done;

    const { error } = await supabase
      .from("wishes")
      .update({
        done: nextDone,
      })
      .eq("id", wish.id);

    if (error) {
      setNotice("Gagal memperbarui status wish.");
      console.error("Gagal memperbarui status wish:", error);
      return;
    }

    setData((current) => ({
      ...current,
      wishes: current.wishes.map((item) => item.id === wish.id ? { ...item, done: nextDone } : item),
    }));

    setNotice("Status wish berhasil diperbarui.");
  }

  // Fungsi untuk menghapus wish dari database
  async function removeWish(wish: Wish) {

    if (!wish.id) {
      setNotice("ID wish tidak ditemukan. Muat ulang halaman.");
      return;
    }

    const { error } = await supabase
      .from("wishes")
      .delete()
      .eq("id", wish.id);

    if (error) {
      setNotice("Gagal menghapus wish dari database.");
      console.error("Gagal menghapus wish dari database:", error);
      return;
    }

    setData((current) => ({
      ...current,
      wishes: current.wishes.filter((item) => item.id !== wish.id),
    }));

    setNotice("Wish berhasil dihapus dari database.");
  }

  // FUNGSI UNTUK SIDEBAR OUR GALERY
  useEffect(() => {
    async function loadMemories() {
      const { data: memoriesData, error } = await supabase
        .from("memories")
        .select("id, title, image_path, caption")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal memuat foto kenangan:", error);
        setNotice("Gagal memuat daftar foto kenangan.");
        return;
      }

      const memories: Memory[] = (memoriesData ?? []).map((item) => {
        const { data: publicUrlData } = supabase.storage
          .from("memories")
          .getPublicUrl(item.image_path);

        return {
          id: item.id,
          title: item.title,
          image: publicUrlData.publicUrl,
          caption: item.caption,
        };
      });

      setData((current) => ({
        ...current,
        memories,
      }));
    }
    loadMemories()
  }, [])

  // Fungsi untuk upload foto 
  async function uploadPhoto(file: File, input: HTMLInputElement) {
    if (!file.type.startsWith("image/")) {
      setNotice("Pilih file gambar yang valid.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotice("Ukuran gambar maksimal 5 MB.");
      return;
    }

    const filePath = `${crypto.randomUUID()}-${file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    )}`;

    const { error: uploadError } = await supabase.storage
      .from("memories")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      setNotice("Gagal mengunggah gambar ke storage.");
      console.error("Upload foto gagal:", uploadError);
      return;
    }

    const { data: newMemory, error: insertError } = await supabase
      .from("memories")
      .insert({
        title: memoryTitle.trim() || file.name.replace(/\.[^.]+$/, ""),
        image_path: filePath,
        caption: memoryCaption.trim(),
      })
      .select("id, title, image_path, caption")
      .single();

    if (insertError) {
      const { error: cleanupError } = await supabase.storage
        .from("memories")
        .remove([filePath]);

      if (cleanupError) {
        console.error("Gagal membersihkan file:", cleanupError);
      }

      setNotice("Foto gagal disimpan ke database.");
      console.error("Simpan metadata gagal:", insertError);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("memories")
      .getPublicUrl(newMemory.image_path);

    setData((current) => ({
      ...current,
      memories: [
        ...current.memories,
        {
          id: newMemory.id,
          title: newMemory.title,
          image: publicUrlData.publicUrl,
          caption: newMemory.caption,
        },
      ],
    }));

    setMemoryTitle("");
    setMemoryCaption("");
    input.value = "";

    setSaved(true);
    setNotice("Foto kenangan berhasil ditambahkan.");

    window.setTimeout(() => setSaved(false), 2000);
  }

  // fungsi handler button add image
  async function handleAddPhoto(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const input = document.getElementById(
      "photo-input"
    ) as HTMLInputElement | null;

    const file = input?.files?.[0];

    if (!input || !file) {
      setNotice("Silakan pilih foto terlebih dahulu.");
      return;
    }

    await uploadPhoto(file, input);
  }

  // funsi untuk mengahpus photo dari database
  async function removeMemory(memory: Memory) {

    if (!memory.id) return;

    const { data: row, error: readError } = await supabase
      .from("memories")
      .select("id, image_path")
      .eq("id", memory.id)
      .single();

    if (readError || !row) {
      setNotice("Data dari foto tidak ditemukan");
      console.error("Gagal mencari foto:", readError);
      return;
    }

    const { error: deleteError } = await supabase
      .from("memories")
      .delete()
      .eq("id", memory.id);

    if (deleteError) {
      setNotice("Gagal menghapus foto dari database.");
      console.error("Gagal menghapus metadata:", deleteError)
      return;
    }

    const { error: storageError } = await supabase.storage
      .from("memories")
      .remove([row.image_path]);

    if (storageError) {
      console.error("Metadata terhapus, tetapi file Storage gagal dihapus:", storageError);
    }

    setData((current) => ({
      ...current,
      memories: current.memories.filter((item) => item.id !== memory.id),
    }));

    setNotice(
      storageError
        ? "Data foto dihapus, tetapi file gambarnya perlu di bersihkan dari storage."
        : "Foto kenangan berhasil di hapus."
    )
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
                    <small>{s.text}</small>
                  </span>
                  <button onClick={() => removeStory(s)}>
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
                  <button onClick={() => removeLetter(l)}>
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
                  Tambahkan foto kenangan kalian dan simpan dalam galeri.
                </p>
              </div>
            </div>

            <form className="admin-form" onSubmit={handleAddPhoto}>
              <label>
                Judul foto
                <input
                  type="text"
                  value={memoryTitle}
                  onChange={(e) => setMemoryTitle(e.target.value)}
                  placeholder="Hari pertama liburan"
                />
              </label>

              <label>
                Caption
                <input
                  type="text"
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
                  onChange={() => setNotice("")}
                />
              </label>

              <div className="full-field">
                <button type="submit" className="button button-dark">
                  + Tambah Foto
                </button>
              </div>
            </form>

            <div className="admin-card-heading gallery-list-heading">
              <div>
                <span className="section-kicker">YOUR COLLECTION</span>
                <h3>Daftar Foto Kenangan</h3>
                <p>{data.memories.length} foto tersimpan</p>
              </div>
            </div>

            {data.memories.length === 0 ? (
              <div className="gallery-empty">
                <span>♡</span>
                <strong>Belum ada foto kenangan</strong>
                <p>Foto yang kamu tambahkan akan tampil di sini.</p>
              </div>
            ) : (
              <div className="admin-photo-grid">
                {data.memories.map((m, i) => (
                  <div
                    className="admin-photo"
                    key={m.id ?? `${m.title}-${i}`}
                  >
                    <img src={m.image} alt={m.title} />

                    <div className="admin-photo-info">
                      <strong>{m.title}</strong>
                      <p>{m.caption || "Tidak ada caption."}</p>

                      <button
                        type="button"
                        onClick={() => {
                          if (m.id) {
                            void removeMemory(m);
                          }
                        }}
                        disabled={!m.id}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                      onChange={() => toggleWish(w)}
                    />
                    <span>
                      <strong>{w.text}</strong>
                      <small>
                        {w.done ? "Sudah terwujud ♡" : "Masih jadi impian"}
                      </small>
                    </span>
                  </label>
                  <button onClick={() => removeWish(w)}>
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

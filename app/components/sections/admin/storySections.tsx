
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { FormEvent } from "react";

type Story = {
  id: string;
  title: string;
  date: string;
  text: string;
};

export default function StoriesSection() {
  // Supabase client
  const supabase = createClient();

  // STATE

  const [stories, setStories] = useState<Story[]>([]);

  const [story, setStory] = useState({
    title: "",
    date: "",
    text: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Pagination
  const [storyPage, setStoryPage] = useState(1);
  const storiesPerPage = 5;

  // LOGIC PAGINATION

  const maxStoryPage = Math.max(
    1,
    Math.ceil(stories.length / storiesPerPage)
  );

  const visibleStories = stories.slice(
    (storyPage - 1) * storiesPerPage,
    storyPage * storiesPerPage
  );

  // FETCH STORIES

  const fetchStories = async () => {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("stories")
      .select("id, title, date, text")
      .order("date", { ascending: true });

    if (error) {
      setMessage("Gagal mengambil data stories.");
      console.error(error);
    } else {
      setStories(data ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // ADD STORY

  const handleAddStory = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!story.title.trim() || !story.text.trim()) {
      setMessage("Judul dan isi cerita harus diisi.");
      return;
    }

    setSaving(true);
    setMessage("");

    const { data, error } = await supabase
      .from("stories")
      .insert({
        title: story.title.trim(),
        date: story.date,
        text: story.text.trim(),
      })
      .select("id, title, date, text")
      .single();

    if (error) {
      setMessage("Gagal menambahkan cerita.");
      console.error(error);
    } else {
      const updatedStories = [...stories, data];

      setStories(updatedStories);

      setStory({
        title: "",
        date: "",
        text: "",
      });

      // Menampilkan halaman terakhir
      setStoryPage(
        Math.max(
          1,
          Math.ceil(updatedStories.length / storiesPerPage)
        )
      );

      setMessage("Cerita berhasil ditambahkan.");
    }

    setSaving(false);
  };

  // DELETE STORY

  const handleDeleteStory = async (id: string) => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus cerita ini?"
    );

    if (!confirmed) return;

    setMessage("");

    const { error } = await supabase
      .from("stories")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage("Gagal menghapus cerita.");
      console.error(error);
    } else {
      const updatedStories = stories.filter(
        (item) => item.id !== id
      );

      setStories(updatedStories);

      const newMaxPage = Math.max(
        1,
        Math.ceil(updatedStories.length / storiesPerPage)
      );

      if (storyPage > newMaxPage) {
        setStoryPage(newMaxPage);
      }

      setMessage("Cerita berhasil dihapus.");
    }
  };

  // TAMPILAN

  return (
    <section className="admin-card">

      {/* Header */}
      <div className="admin-card-heading">
        <div>
          <span className="section-kicker">
            CHAPTERS OF US
          </span>

          <h3>Our Story</h3>

          <p>
            Tambahkan momen penting dalam perjalanan kalian.
          </p>
        </div>

        <span>
          {stories.length} cerita
        </span>
      </div>

      {/* Pesan */}
      {message && (
        <div className="admin-notice">
          {message}
        </div>
      )}

      {/* Form tambah cerita */}
      <form
        className="admin-form"
        onSubmit={handleAddStory}
      >
        <label>
          Judul cerita

          <input
            type="text"
            value={story.title}
            onChange={(e) =>
              setStory({
                ...story,
                title: e.target.value,
              })
            }
            placeholder="Awal dari kita"
            required
          />
        </label>

        <label>
          Tanggal / label

          <input
            type="date"
            value={story.date}
            onChange={(e) =>
              setStory({
                ...story,
                date: e.target.value,
              })
            }
          />
        </label>

        <label className="full-field">
          Cerita

          <textarea
            value={story.text}
            onChange={(e) =>
              setStory({
                ...story,
                text: e.target.value,
              })
            }
            rows={4}
            placeholder="Tuliskan kenangan kalian..."
            required
          />
        </label>

        <button
          type="submit"
          className="button button-dark"
          disabled={saving}
        >
          {saving ? "Menyimpan..." : "Tambah cerita +"}
        </button>
      </form>

      {/* Daftar cerita */}
      <div className="manage-list">

        {loading ? (
          <p>Memuat cerita...</p>
        ) : stories.length === 0 ? (
          <p>Belum ada cerita.</p>
        ) : (
          <>
            {visibleStories.map((item, index) => (
              <div key={item.id}>
                <div>

                  <p>{item.date}</p>

                  <h4>{item.title}</h4>

                  <p>{item.text}</p>
                </div>

                <button
                  type="button"
                  className="button button-dark"
                  onClick={() =>
                    handleDeleteStory(item.id)
                  }
                >
                  Hapus
                </button>
              </div>
            ))}

            {/* Pagination */}
            {maxStoryPage > 1 && (
              <div className="story-navigation">
                <button
                  type="button"
                  onClick={() =>
                    setStoryPage((page) =>
                      Math.max(1, page - 1)
                    )
                  }
                  disabled={storyPage === 1}
                >
                  ←
                </button>

                <span>
                  {storyPage} / {maxStoryPage}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setStoryPage((page) =>
                      Math.min(maxStoryPage, page + 1)
                    )
                  }
                  disabled={storyPage === maxStoryPage}
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

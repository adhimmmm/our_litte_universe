
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { Memory } from "@/app/page";

type GallerySectionsProps = {
  memories: Memory[];
};

export default function GallerySections({ memories }: GallerySectionsProps) {
  // Pagination Our Gallery
  const [galleryPage, setGalleryPage] = useState(0);
  const memoriesPerPage = 6;

  const maxGalleryPage = Math.max(
    0,
    Math.ceil(memories.length / memoriesPerPage) - 1,
  );

  const visibleMemories = memories.slice(
    galleryPage * memoriesPerPage,
    (galleryPage + 1) * memoriesPerPage,
  );

  // State popup gambar
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Foto yang sedang dipilih
  const selectedMemory =
    selectedIndex !== null ? memories[selectedIndex] : null;

  // Navigasi foto di dalam popup
  const showPrevious = () => {
    if (selectedIndex === null || memories.length === 0) return;

    setSelectedIndex(
      (selectedIndex - 1 + memories.length) % memories.length,
    );
  };

  const showNext = () => {
    if (selectedIndex === null || memories.length === 0) return;

    setSelectedIndex((selectedIndex + 1) % memories.length);
  };

  // Navigasi menggunakan keyboard
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIndex(null);
      }

      if (e.key === "ArrowLeft") {
        showPrevious();
      }

      if (e.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, memories.length]);

  // Jika jumlah foto berubah
  useEffect(() => {
    if (memories.length === 0) {
      setSelectedIndex(null);
      setGalleryPage(0);
      return;
    }

    setGalleryPage((page) => Math.min(page, maxGalleryPage));

    setSelectedIndex((index) =>
      index !== null && index >= memories.length
        ? memories.length - 1
        : index,
    );
  }, [memories.length, maxGalleryPage]);

  return (
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

      {memories.length > 0 ? (
        <div className="story-carousel">
          <div className="memory-grid">
            {visibleMemories.map((memory, i) => {
              const memoryIndex = galleryPage * memoriesPerPage + i;

              return (
                <figure
                  className="memory-card"
                  key={`${memory.title}-${memoryIndex}`}
                  onClick={() => setSelectedIndex(memoryIndex)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedIndex(memoryIndex);
                    }
                  }}
                  aria-label={`Lihat foto ${memory.title}`}
                >
                  <img src={memory.image} alt={memory.title} />

                  <figcaption>
                    <strong>{memory.title}</strong>
                    <span>{memory.caption}</span>
                  </figcaption>
                </figure>
              );
            })}
          </div>

          {memories.length > memoriesPerPage && (
            <div className="story-navigation">
              <button
                type="button"
                onClick={() => setGalleryPage((page) => Math.max(0, page - 1))}
                disabled={galleryPage === 0}
                aria-label="Foto sebelumnya"
              >
                ←
              </button>

              <span>
                {galleryPage + 1} / {maxGalleryPage + 1}
              </span>

              <button
                type="button"
                onClick={() =>
                  setGalleryPage((page) => Math.min(maxGalleryPage, page + 1))
                }
                disabled={galleryPage === maxGalleryPage}
                aria-label="Foto berikutnya"
              >
                →
              </button>
            </div>
          )}
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

      {/* Popup Preview Gambar */}
      {selectedMemory && (
        <div
          className="image-lightbox"
          onClick={() => setSelectedIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Preview ${selectedMemory.title}`}
        >
          {/* Tombol tutup */}
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setSelectedIndex(null)}
            aria-label="Tutup gambar"
          >
            ×
          </button>

          {/* Tombol foto sebelumnya */}
          {memories.length > 1 && (
            <button
              type="button"
              className="lightbox-nav lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                showPrevious();
              }}
              aria-label="Foto sebelumnya"
            >
              ←
            </button>
          )}

          {/* Konten gambar */}
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedMemory.image}
              alt={selectedMemory.title}
            />

            <div className="lightbox-caption">
              <strong>{selectedMemory.title}</strong>
              {selectedMemory.caption && <p>{selectedMemory.caption}</p>}

              <span className="lightbox-counter">
                {selectedIndex! + 1} / {memories.length}
              </span>
            </div>
          </div>

          {/* Tombol foto berikutnya */}
          {memories.length > 1 && (
            <button
              type="button"
              className="lightbox-nav lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Foto berikutnya"
            >
              →
            </button>
          )}
        </div>
      )}
    </section>
  );
}

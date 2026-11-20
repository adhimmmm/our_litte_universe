"use client";

import Link from "next/link";
import { useState } from "react";
import type { Memory } from "@/app/page";

type GallerySectionsProps = {
  memories: Memory[];
};

export default function GallerySections({ memories }: GallerySectionsProps) {
  // fungsi pagination card our gallery
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
    </section>
  );
}

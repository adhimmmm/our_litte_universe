"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import BucketSections from "./components/sections/user/bucket-sections";
import GallerySections from "./components/sections/user/gallery-sections";
import LetterSections from "./components/sections/user/letter-sections";
import LoveCounterSections from "./components/sections/user/loveCounter-sections";
import StorySections from "./components/sections/user/story-sections";

export type Story = { id?: string; title: string; date: string; text: string };
export type Letter = { id?: string; title: string; message: string };
export type Memory = {
  id?: string;
  title: string;
  image: string;
  caption: string;
};
export type Wish = { id?: string; text: string; done: boolean };

type SiteData = {
  names: string;
  startDate: string;
  note: string;
  stories: Story[];
  letters: Letter[];
  memories: Memory[];
  wishes: Wish[];
};

export default function Home() {
  const [supabase] = useState(() => createClient());
  const [data, setData] = useState<SiteData>({
    names: "",
    startDate: "",
    note: "",
    stories: [],
    letters: [],
    memories: [],
    wishes: [],
  });
  const [ready, setReady] = useState(false);
  const [openLetter, setOpenLetter] = useState<Letter | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      const [
        settingsResult,
        storiesResult,
        lettersResult,
        memoriesResult,
        wishesResult,
      ] = await Promise.all([
        supabase
          .from("site_settings")
          .select("names, start_date, note")
          .eq("id", 1)
          .maybeSingle(),

        supabase
          .from("stories")
          .select("id, title, date, text")
          .order("created_at", { ascending: true }),

        supabase
          .from("letters")
          .select("id, title, message")
          .order("created_at", { ascending: true }),

        supabase
          .from("memories")
          .select("id, title, image_path, caption")
          .order("created_at", { ascending: true }),

        supabase
          .from("wishes")
          .select("id, text, done")
          .order("created_at", { ascending: true }),
      ]);

      if (cancelled) return;

      const errors = [
        settingsResult.error,
        storiesResult.error,
        lettersResult.error,
        memoriesResult.error,
        wishesResult.error,
      ].filter(Boolean);

      if (errors.length > 0) {
        console.error("Gagal memuat data Supabase:", errors);
      }

      const memories: Memory[] = (memoriesResult.data ?? []).map((item) => {
        const { data: publicUrl } = supabase.storage
          .from("memories")
          .getPublicUrl(item.image_path);

        return {
          id: item.id,
          title: item.title,
          image: publicUrl.publicUrl,
          caption: item.caption,
        };
      });

      setData({
        names: settingsResult.data?.names ?? "",
        startDate: settingsResult.data?.start_date ?? "",
        note: settingsResult.data?.note ?? "",
        stories: storiesResult.data ?? [],
        letters: lettersResult.data ?? [],
        memories,
        wishes: wishesResult.data ?? [],
      });

      setReady(true);
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  return (
    <main>
      <Navbar />

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
            <span className="photo-label">{data.names}</span>
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

      <LoveCounterSections startDate={data.startDate} ready={ready} />

      <StorySections stories={data.stories} />

      <LetterSections letters={data.letters} setOpenLetter={setOpenLetter} />

      <GallerySections memories={data.memories} />

      <BucketSections wishes={data.wishes} />

      <Footer />

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

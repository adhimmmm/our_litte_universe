
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import "../styles/login.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setError("Email atau password salah. Silakan coba lagi.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Periksa koneksi dan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />

      <div className="login-stars" aria-hidden="true">
        <span className="star star-one">✦</span>
        <span className="star star-two">✧</span>
        <span className="star star-three">✦</span>
        <span className="star star-four">✧</span>
        <span className="star star-five">·</span>
        <span className="star star-six">✦</span>
        <span className="star star-seven">·</span>
        <span className="star star-eight">✧</span>
      </div>

      <div className="login-layout">
        <section className="login-intro">
          <div className="intro-badge">
            <span className="intro-badge-dot" />
            A LITTLE PLACE JUST FOR US
          </div>

          <div className="intro-art" aria-hidden="true">
            <div className="intro-orbit intro-orbit-one" />
            <div className="intro-orbit intro-orbit-two" />

            <div className="intro-moon">☾</div>
            <span className="intro-heart intro-heart-one">♡</span>
            <span className="intro-heart intro-heart-two">✦</span>
            <span className="intro-heart intro-heart-three">♥</span>
          </div>

          <p className="intro-overline">OUR LITTLE UNIVERSE</p>

          <h1 className="intro-title">
            A universe
            <br />
            <span>of our own.</span>
          </h1>

          <p className="intro-description">
            Tempat kecil untuk menyimpan cerita,
            <br className="desktop-break" />
            kenangan, dan hal-hal indah tentang kita.
          </p>

          <div className="intro-divider">
            <span />
            <span className="intro-divider-heart">♡</span>
            <span />
          </div>

          <p className="intro-note">
            “In this little universe, it will always be us.”
          </p>
        </section>

        <section className="login-card">
          <div className="login-card-top">
            <div className="login-logo">♡</div>

            <div>
              <p className="login-card-eyebrow">YOUR LITTLE SPACE</p>
              <h2>Welcome back</h2>
              <p className="login-card-subtitle">
                Senang melihatmu kembali.
              </p>
            </div>
          </div>

          <div className="login-welcome">
            <span className="welcome-sparkle">✦</span>
            <span>Masuk dan lanjutkan cerita kita.</span>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="login-field">
              <label htmlFor="email">Alamat email</label>

              <div className="login-input-wrap">
                <span className="field-icon" aria-hidden="true">
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>

              <div className="login-input-wrap">
                <span className="field-icon" aria-hidden="true">
                  ♡
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={
                    showPassword
                      ? "Sembunyikan password"
                      : "Tampilkan password"
                  }
                  aria-pressed={showPassword}
                  disabled={loading}
                >
                  {showPassword ? "Sembunyikan" : "Lihat"}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error" role="alert">
                <span aria-hidden="true">!</span>
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="login-submit"
            >
              <span>{loading ? "Sedang menyiapkan ruangmu..." : "Masuk ke universe"}</span>
              <span className="submit-arrow" aria-hidden="true">
                {loading ? "✦" : "→"}
              </span>
            </button>
          </form>

          <a href="/" className="login-back-link">
            Kembali ke halaman utama
          </a>

          <div className="login-security">
            <span className="security-icon">♡</span>
            <span>Private space · Made just for us</span>
          </div>

          <div className="login-card-footer">
            <span>✦</span>
            <span>MADE WITH LOVE</span>
            <span>✦</span>
          </div>
        </section>
      </div>

      <footer className="login-bottom">
        <span>OUR LITTLE UNIVERSE</span>
        <span className="bottom-separator">·</span>
        <span>EVERY LITTLE THING MATTERS</span>
      </footer>
    </main>
  );
}

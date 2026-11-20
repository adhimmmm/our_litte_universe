
import { Wish } from "@/app/page";
import Link from "next/link";
import { useState } from "react";

type BucketSectionsProps = {
    wishes: Wish[];
};

export default function BucketSections({ wishes }: BucketSectionsProps) {
    const completed = wishes.filter((w) => w.done).length;

    // Fungsi pagination card Our Bucket List
    const [bucketPage, setBucketPage] = useState(0);
    const wishesPerPage = 5;

    const maxBucketPage = Math.max(
        0,
        Math.ceil(wishes.length / wishesPerPage) - 1
    );

    const visibleWishes = wishes.slice(
        bucketPage * wishesPerPage,
        (bucketPage + 1) * wishesPerPage
    );

    return (
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
                            {completed} dari {wishes.length} mimpi terwujud
                        </span>

                        <div className="progress-track">
                            <div
                                style={{
                                    width: `${wishes.length
                                        ? (completed / wishes.length) * 100
                                        : 0
                                    }%`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="wish-list">
                    {visibleWishes.map((wish, i) => {
                        const wishIndex = bucketPage * wishesPerPage + i;

                        return (
                            <div
                                className={`wish-row ${wish.done ? "wish-done" : ""}`}
                                key={`${wish.text}-${wishIndex}`}
                            >
                                <span className="wish-check">
                                    {wish.done ? "✓" : "♡"}
                                </span>

                                <span>{wish.text}</span>

                                <span className="wish-number">
                                    {String(wishIndex + 1).padStart(2, "0")}
                                </span>
                            </div>
                        );
                    })}

                    {wishes.length > wishesPerPage && (
                        <div className="story-navigation">
                            <button
                                type="button"
                                onClick={() =>
                                    setBucketPage((page) => Math.max(0, page - 1))
                                }
                                disabled={bucketPage === 0}
                                aria-label="Mimpi sebelumnya"
                            >
                                ←
                            </button>

                            <span>
                                {bucketPage + 1} / {maxBucketPage + 1}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    setBucketPage((page) =>
                                        Math.min(maxBucketPage, page + 1)
                                    )
                                }
                                disabled={bucketPage === maxBucketPage}
                                aria-label="Mimpi berikutnya"
                            >
                                →
                            </button>
                        </div>
                    )}

                    <Link href="/admin" className="wish-manage">
                        Tambah mimpi baru <span>↗</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

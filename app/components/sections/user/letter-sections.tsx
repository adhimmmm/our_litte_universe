
import { Letter } from "@/app/page";
import { useState } from "react";

type LetterSectionsProps = {
    letters: Letter[];
    setOpenLetter: (letter: Letter | null) => void;
};

export default function LetterSections({
    letters,
    setOpenLetter,
}: LetterSectionsProps) {

    // Fungsi pagination card Our Letter
    const [letterPage, setLetterPage] = useState(0);
    const lettersPerPage = 3;

    const maxLetterPage = Math.max(
        0,
        Math.ceil(letters.length / lettersPerPage) - 1
    );

    const visibleLetters = letters.slice(
        letterPage * lettersPerPage,
        (letterPage + 1) * lettersPerPage
    );

    return (
        <section className="letters-section" id="letters">
            <div className="letters-intro">
                <span className="section-kicker">
                    FOR THE DAYS YOU NEED ME
                </span>

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
                {visibleLetters.map((letter, i) => {
                    const letterIndex = letterPage * lettersPerPage + i;

                    return (
                        <button
                            className="letter-row"
                            key={`${letter.title}-${letterIndex}`}
                            onClick={() => setOpenLetter(letter)}
                        >
                            <span className="letter-icon">✉</span>
                            <span>{letter.title}</span>
                            <span className="letter-arrow">↗</span>
                        </button>
                    );
                })}

                {/* Pagination */}
                {letters.length > lettersPerPage && (
                    <div className="story-navigation">
                        <button
                            type="button"
                            onClick={() =>
                                setLetterPage((page) => Math.max(0, page - 1))
                            }
                            disabled={letterPage === 0}
                            aria-label="Surat sebelumnya"
                        >
                            ←
                        </button>

                        <span>
                            {letterPage + 1} / {maxLetterPage + 1}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setLetterPage((page) =>
                                    Math.min(maxLetterPage, page + 1)
                                )
                            }
                            disabled={letterPage === maxLetterPage}
                            aria-label="Surat berikutnya"
                        >
                            →
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

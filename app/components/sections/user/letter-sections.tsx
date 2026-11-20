import { Letter } from "@/app/page";


type LetterSectionsProps = {
    letters: Letter[];
    setOpenLetter: (letter: Letter | null) => void;
}

export default function LetterSections({ letters, setOpenLetter }: LetterSectionsProps) {
    
    return (
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
                {letters.map((letter, i) => (
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
    )
}
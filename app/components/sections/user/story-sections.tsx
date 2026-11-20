import { Story } from "@/app/page";
import { useState } from "react";

type StorySectionsProps = {
    stories: Story[];
}


export default function StorySections({ stories }: StorySectionsProps) {

    // fungsi pagination card our litte story
    const [storyPage, setStoryPage] = useState(0);
    const storiesPerPage = 4;
    const maxStoryPage = Math.max(
        0,
        Math.ceil(stories.length / storiesPerPage) - 1,
    );
    const visibleStories = stories.slice(
        storyPage * storiesPerPage,
        (storyPage + 1) * storiesPerPage,
    );

    
    return (
        <section className="section story-section" id="story">
            <div className="section-heading">
                <div>
                    <span className="section-kicker">CHAPTERS OF US</span>
                    <h2>
                        Our little <em>story.</em>
                    </h2>
                </div>
                <p>
                    Setiap cerita punya awal. Ini adalah cerita favorit kita—yang masih
                    terus ditulis.
                </p>
            </div>
            <div className="story-carousel">
                <div className="story-grid">
                    {visibleStories.map((story, i) => {
                        const storyIndex = storyPage * storiesPerPage + i;

                        return (
                            <article
                                className="story-card"
                                key={`${story.title}-${storyIndex}`}
                            >
                                <span className="story-index">
                                    {String(storyIndex + 1).padStart(2, "0")}
                                </span>

                                <span className="story-date">{story.date}</span>

                                <h3>{story.title}</h3>

                                <p>{story.text}</p>

                                <span className="card-heart">♡</span>
                            </article>
                        );
                    })}
                </div>

                {stories.length > storiesPerPage && (
                    <div className="story-navigation">
                        <button
                            type="button"
                            onClick={() => setStoryPage((page) => Math.max(0, page - 1))}
                            disabled={storyPage === 0}
                            aria-label="Cerita sebelumnya"
                        >
                            ←
                        </button>

                        <span>
                            {storyPage + 1} / {maxStoryPage + 1}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setStoryPage((page) => Math.min(maxStoryPage, page + 1))
                            }
                            disabled={storyPage === maxStoryPage}
                            aria-label="Cerita berikutnya"
                        >
                            →
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}
type LoveCounterSectionsProps = {
  startDate: string;
  ready: boolean;
};

function daysTogether(date: string) {
  const start = new Date(`${date}T00:00:00`);

  if (Number.isNaN(start.getTime())) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.max(
    0,
    Math.floor((today.getTime() - start.getTime()) / 86400000),
  );
}

export default function LoveCounterSections({
  startDate,
  ready,
}: LoveCounterSectionsProps) {
  const formattedDate =
    ready && startDate
      ? new Date(`${startDate}T00:00:00`).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "—";

  return (
    <section className="love-counter" id="anniversary">
      <div>
        <span className="section-kicker">A LOVE THAT KEEPS GROWING</span>
        <h2>
          Sudah sejauh ini, <em>bersama.</em>
        </h2>
      </div>
      <div className="counter-number">
        <strong>
          {ready && startDate
            ? `${daysTogether(startDate).toLocaleString("id-ID")} hari`
            : "—"}
        </strong>
        <span>hari dan masih terus bertambah ♡</span>
      </div>
      <div className="counter-date">
        <span>SEJAK HARI ITU</span>
        <strong>{formattedDate}</strong>
      </div>
    </section>
  );
}

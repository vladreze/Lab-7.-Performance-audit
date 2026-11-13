import { useRef, useState, useEffect, useMemo } from "react";
import TutorCard from "./TutorCard";
import { useBioClamp } from "../hooks/useBioClamp";

const PAGE = 24;

export default function TutorList({
  tutors,
  favorites,
  selectedId,
  onSelect,
  onToggleFavorite,
  style,
}) {
  const containerRef = useRef(null);
  const sentinelRef = useRef(null);
  const [limit, setLimit] = useState(PAGE);
  const [prevTutors, setPrevTutors] = useState(tutors);

  if (prevTutors !== tutors) {
    setPrevTutors(tutors);
    setLimit(PAGE);
  }

  const shown = useMemo(() => tutors.slice(0, limit), [tutors, limit]);
  useBioClamp(containerRef, [shown]);

  useEffect(() => {
    if (limit >= tutors.length) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setLimit(tutors.length);
      return undefined;
    }
    const node = sentinelRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setLimit((l) => l + PAGE);
      },
      { rootMargin: "800px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [limit, tutors.length]);

  return (
    <>
      <div className="tutor-grid" ref={containerRef} style={style}>
        {shown.map((tutor) => (
          <TutorCard
            key={tutor.id}
            tutor={tutor}
            isFavorite={favorites.includes(tutor.id)}
            isSelected={tutor.id === selectedId}
            onSelect={onSelect}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
      {limit < tutors.length && <div ref={sentinelRef} style={{ height: 1 }} />}
    </>
  );
}

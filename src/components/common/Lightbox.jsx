import { useEffect } from "react";
import Icon from "./Icon";

export default function Lightbox({
  images = [],
  currentIndex = 0,
  isOpen = false,
  onClose,
  onNavigate,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const current = images[currentIndex];
  const currentUrl = typeof current === "string" ? current : current?.url || current?.image;
  const currentAlt = typeof current === "string" ? "Gallery image" : current?.alt || current?.caption || "Gallery image";

  const handlePrev = (e) => {
    e?.stopPropagation();
    const prev = (currentIndex - 1 + images.length) % images.length;
    onNavigate(prev);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    const next = (currentIndex + 1) % images.length;
    onNavigate(next);
  };

  return (
    <div
      className="lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
    >
      <button
        type="button"
        className="lightbox-close"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <Icon name="x" size={24} />
      </button>

      <div className="lightbox-counter">
        {currentIndex + 1} / {images.length}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="lightbox-nav lightbox-prev"
            onClick={handlePrev}
            aria-label="Previous image"
          >
            <Icon name="arrowLeft" size={24} />
          </button>
          <button
            type="button"
            className="lightbox-nav lightbox-next"
            onClick={handleNext}
            aria-label="Next image"
          >
            <Icon name="arrowRight" size={24} />
          </button>
        </>
      )}

      <div
        className="lightbox-figure"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentUrl}
          alt={currentAlt}
          className="lightbox-image"
          loading="eager"
        />
        {typeof current === "object" && current?.caption && (
          <figcaption className="lightbox-caption">{current.caption}</figcaption>
        )}
      </div>
    </div>
  );
}

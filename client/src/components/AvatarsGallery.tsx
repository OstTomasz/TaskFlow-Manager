import { avatars, type AvatarId } from "@/constants";
import { cn } from "@/lib/cn";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { useEffect, useRef } from "react";

interface AvatarsGalleryProps {
  onSelect: (id: AvatarId) => void;
  selected?: AvatarId;
}

export const AvatarsGallery = ({ onSelect, selected }: AvatarsGalleryProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [selected]);

  const currentIndex = avatars.findIndex((a) => a.id === selected);
  const selectAdjacent = (dir: "left" | "right") => {
    const base = currentIndex < 0 ? 0 : currentIndex;
    const nextIndex = dir === "right" ? base + 1 : base - 1;
    if (nextIndex < 0 || nextIndex >= avatars.length) return;
    onSelect(avatars[nextIndex].id);
  };

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-2 w-13 z-10 pointer-events-none bg-(--bg-primary) " />
      <div className="absolute right-0 top-0 bottom-2 w-13 z-10 pointer-events-none bg-(--bg-primary)" />
      <button
        type="button"
        onClick={() => selectAdjacent("left")}
        disabled={currentIndex <= 0}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 comic-btn px-2 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ArrowBigLeft />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-(--space-sm) overflow-x-auto snap-x snap-mandatory scrollbar-none px-10"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 45%, black 65%, transparent)",
        }}
      >
        <div className="shrink-0 w-10" />
        {avatars.map((avatar) => {
          const isSelected = selected === avatar.id;
          return (
            <button
              ref={isSelected ? selectedRef : null}
              key={avatar.id}
              type="button"
              onClick={() => onSelect(avatar.id)}
              className={cn(
                "snap-center shrink-0 transition-all duration-200 rounded-xl p-2 border-2 my-4",
                isSelected
                  ? "bg-(--bg-primary) border-ink scale-110 shadow-(--shadow-comic)"
                  : "border-transparent hover:scale-105 opacity-70 hover:opacity-100",
              )}
              aria-pressed={isSelected}
            >
              <svg className="w-10 h-10 sm:w-16 sm:h-16" viewBox="0 0 150 150">
                <use href={avatar.icon} />
              </svg>
            </button>
          );
        })}
        <div className="shrink-0 w-10" />
      </div>

      <button
        type="button"
        onClick={() => selectAdjacent("right")}
        disabled={currentIndex === avatars.length - 1}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 comic-btn px-2 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ArrowBigRight />
      </button>
    </div>
  );
};

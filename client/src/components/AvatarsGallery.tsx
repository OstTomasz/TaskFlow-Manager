import { avatars, type AvatarId } from "@/constants";

interface AvatarsGalleryProps {
  onSelect: (id: AvatarId) => void;
  selected?: AvatarId;
}

export const AvatarsGallery = ({ onSelect, selected }: AvatarsGalleryProps) => {
  return (
    <div className="flex gap-(--space-sm) p-(--space-sm)">
      {avatars.map((avatar) => (
        <button
          key={avatar.id}
          type="button"
          onClick={() => onSelect(avatar.id)}
          aria-pressed={selected === avatar.id}
        >
          <svg className="w-20 h-20" viewBox="0 0 150 150">
            <use href={avatar.icon} />
          </svg>
        </button>
      ))}
    </div>
  );
};

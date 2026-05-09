import { UserRoundPlus } from "lucide-react";

export const CreateUserBtn = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-[90dvw] md:w-fit comic-btn"
    >
      <span className="text-center text-3xl font-bold">Create New User</span>
      <UserRoundPlus size={80} />
    </button>
  );
};

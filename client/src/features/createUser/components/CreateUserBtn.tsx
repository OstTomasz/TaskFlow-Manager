import { UserRoundPlus } from "lucide-react";

export const CreateUserBtn = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <button
      type="button"
      onClick={handleClick}
      className="comic-card w-70 justify-center items-center pt-0"
    >
      <h3 className="text-center text-3xl font-bold">Create New User</h3>
      <UserRoundPlus size={80} className="mt-5" />
    </button>
  );
};

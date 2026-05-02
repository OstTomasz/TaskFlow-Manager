import { UserRoundPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col justify-around items-center">
      <h2>Identify Yourself</h2>
      <button onClick={() => navigate("/todos")}>Go to Todos</button>
      {/* User List */}
      <div className="flex gap-(--space-sm) p-(--space-md)">
        <div className="flex flex-col items-center border p-(--space-sm)">
          <svg className="w-20 h-20" viewBox="0 0 150 150">
            <use href="/avatars-sprite.svg#Avatar01" />
          </svg>
          <h3>Name</h3>
          <form className="flex flex-col">
            <input placeholder="password"></input>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
      {/* New user */}
      <div className="border p-(--space-sm)">
        <h3>Create New User</h3>
        <button className="flex mx-auto py-(--space-sm)">
          <UserRoundPlus size={70} />
        </button>
        {/* After clicking button - it dissapear and appear form */}
        <form className="flex flex-col ">
          <select>Select avatar</select>
          <input placeholder="name"></input>
          <input placeholder="password"></input>
          <input placeholder="confirm password"></input>
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
};

import { Footer } from "@/components";

export const HomePage = () => {
  return (
    <>
      {/* Topbar - showing on both sites, diff content */}
      <header className="w-full flex py-4 border-b border-b-black">
        <h1 className="text-5xl justify-self-center">Task List Manager</h1>
        <p className="justify-self-end">theme toogler</p>
      </header>
      {/* Content */}
      <main className="h-full flex flex-col justify-around items-center">
        <h2>Identify Yourself</h2>
        {/* User List */}
        <div className="flex gap-1 p-5">
          <div className="flex flex-col items-center border border-black p-1s">
            <img src="" alt="user avatar" />
            <h3>Name</h3>
            <form className="flex flex-col">
              <input placeholder="password"></input>
              <button type="submit">Login</button>
            </form>
          </div>
          <div className="flex flex-col items-center border border-black p-1">
            <img src="" alt="user avatar" />
            <h3>Name</h3>
            <form className="flex flex-col">
              <input placeholder="password"></input>
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
        {/* New user */}
        <div className="border border-black p-1">
          <h3>Create New User</h3>
          <button>
            <img src="" alt="plus" />
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
      </main>
      {/* Footer - same content on both sites */}
      <Footer />
    </>
  );
};

export const TodosPage = () => {
  return (
    <>
      {/* Topbar - showing on both sites, diff content */}
      <header className="w-full flex py-4 border-b border-b-black">
        <h1 className="text-5xl justify-self-center">Task List Manager</h1>
        <button className="justify-self-end">theme toogler</button>
        {/* On mobile */}
        <button>Burger</button>
        {/* On other */}
        <button>Settings</button>
        <button>Logout</button>
      </header>
      {/* Content */}
      <main className="h-full flex flex-col justify-around items-center">
        {/* Task List */}
        <h2>Task list</h2>
        <div>
          <span>Dot</span> <h3>Task name</h3> <span>Priority</span>
          <button>\/</button>
          {/* after expand */}
          <p>Description</p>
          <span>created at</span>
          <p>modified at</p>
          <button>edit</button>
        </div>
        {/* Task archive - expandable */}
        <h2>Task archive</h2> <button>\/</button>
        <div>
          <span>Dot</span> <h3>Task name</h3> <span>Priority</span>
          <button>\/</button>
          {/* after expand */}
          <p>Description</p>
          <span>archived at</span>
          <button>edit</button>
        </div>
      </main>
      {/* Footer - same content on both sites */}
      <footer className="w-full fixed bottom-0 flex justify-center border-t border-t-black">
        <p>Created by Tomasz Ostaszewski @2026. All right reserved</p>
      </footer>
    </>
  );
};

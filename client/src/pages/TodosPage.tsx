import { Footer, Topbar } from "@/components";

export const TodosPage = () => {
  return (
    <>
      <Topbar />

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
      <Footer />
    </>
  );
};

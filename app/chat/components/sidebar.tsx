export default function Sidebar() {
  return (
    <div className="h-full flex flex-col">

      <div className="p-4 border-b border-slate-700 text-xl font-bold">
        Yapify
      </div>

      <div className="p-3 border-b border-slate-700">
        <input
          placeholder="Search..."
          className="w-full rounded bg-slate-800 p-2 outline-none"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 hover:bg-slate-800 cursor-pointer">
          John Doe
        </div>

        <div className="p-4 hover:bg-slate-800 cursor-pointer">
          Group Chat
        </div>

        <div className="p-4 hover:bg-slate-800 cursor-pointer">
          Alex
        </div>
      </div>

    </div>
  )
}

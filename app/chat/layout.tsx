import Sidebar from "./components/sidebar"

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-slate-900 text-white">
      <div className="w-[280px] border-r border-slate-700">
        <Sidebar />
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}

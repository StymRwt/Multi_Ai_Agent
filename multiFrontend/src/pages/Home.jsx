import { useCallback, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex h-dvh overflow-hidden bg-ink-950 text-fog-100">
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      <ChatArea onOpenSidebar={() => setSidebarOpen(true)} />
    </div>
  );
}

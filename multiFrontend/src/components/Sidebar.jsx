import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus } from "lucide-react";
import LogoMark from "./LogoMark";
import ConversationList from "./ConversationList";
import { startNewChat } from "../redux/slices/conversationSlice";
import { logoutUser } from "../redux/slices/userSlice";

export default function Sidebar({ open, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.user.user);

  // Escape closes the mobile drawer.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleNewChat = () => {
    dispatch(startNewChat());
    onClose();
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-ink-800 bg-ink-900 transition-transform duration-200 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2.5 px-5 pb-3 pt-5">
          <LogoMark />
          <span className="font-display text-lg font-semibold tracking-tight text-white">
            Multi-Agent AI
          </span>
        </div>

        <div className="px-3 pb-3">
          <button
            type="button"
            onClick={handleNewChat}
            className="flex w-full items-center gap-2 rounded-lg border border-ink-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-ink-800"
          >
            <Plus size={16} aria-hidden="true" />
            New chat
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          <ConversationList onNavigate={onClose} />
        </div>

        <div className="border-t border-ink-800 p-3">
          {user && (
            <div className="mb-2 flex items-center gap-3 px-2 py-1">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-700 text-sm font-semibold uppercase text-white">
                {user.name?.[0] || "?"}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-white">{user.name}</span>
                <span className="block truncate text-xs text-fog-500">{user.email}</span>
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-fog-300 transition-colors hover:bg-ink-800 hover:text-white"
          >
            <LogOut size={16} aria-hidden="true" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}

import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { User as UserIcon, Bell } from "lucide-react";

const TopNav: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-neutral-800">
          Welcome back, <span className="text-primary-700">{user?.full_name || "Farmer"}</span>
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 relative transition-all duration-200">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-primary-600 ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-neutral-200">
          <div className="text-right">
            <p className="text-sm font-semibold text-neutral-800">{user?.full_name}</p>
            <p className="text-xs text-neutral-500 font-medium capitalize">{user?.role?.toLowerCase()}</p>
          </div>
          {user?.profile_picture ? (
            <img
              src={user.profile_picture}
              alt={user.full_name}
              className="h-9 w-9 rounded-full object-cover border"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 border border-primary-200">
              <UserIcon className="h-5 w-5" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;

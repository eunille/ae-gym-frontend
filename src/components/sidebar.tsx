import {
  LineChart,
  LogOut,
  Package,
  User2,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./ui/tooltip";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import logo from "@/assets/images/gym-logo.png";

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="fixed inset-y-0 left-0 top-0 bottom-0 z-10 hidden w-60 flex-col border-r shadow-md bg-white sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
        <div className="flex flex-col items-center mb-8">
          <img
            className="w-24 h-24 mb-4 rounded-full shadow-lg"
            src={logo}
            alt="Gym Logo"
          />
          <span className="text-xl font-semibold text-gray-900">AE Gym</span>
        </div>

        {/* Navigation Links */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/members"
                className={`group flex h-9 w-full items-center justify-center rounded-md gap-2 transition ${
                  location.pathname === "/members"
                    ? "bg-yellow-300 text-gray-900"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <User2 className="h-4 w-4 transition-all group-hover:scale-110" />
                <span className="font-medium">Members</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Members</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/membership"
                className={`group flex h-9 w-full items-center justify-center rounded-md gap-2 transition ${
                  location.pathname === "/membership"
                    ? "bg-yellow-300 text-gray-900"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <User2 className="h-4 w-4 transition-all group-hover:scale-110" />
                <span className="font-medium">Membership</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Membership</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/products"
                className={`group flex h-9 w-full items-center justify-center rounded-md gap-2 transition ${
                  location.pathname === "/products"
                    ? "bg-yellow-300 text-gray-900"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Package className="h-4 w-4 transition-all group-hover:scale-110" />
                <span className="font-medium">Products</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Products</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/analytics"
                className={`group flex h-9 w-full items-center justify-center rounded-md gap-2 transition ${
                  location.pathname === "/analytics"
                    ? "bg-yellow-300 text-gray-900"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <LineChart className="h-4 w-4 transition-all group-hover:scale-110" />
                <span className="font-medium">Analytics</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Analytics</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>

      {/* Logout Button */}
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-[#FCD301] text-white transition "
              >
                <LogOut className="h-5 w-5 transition-all group-hover:scale-125" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-800 text-white">
              Logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
};

export default Sidebar;

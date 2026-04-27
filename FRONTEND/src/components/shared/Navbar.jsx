import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Menu, User2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SERVER_URL } from "@/utils/constant";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(`${SERVER_URL}/logout`, {}, { withCredentials: true });

      if (res.data.success) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message || "Logged out successfully.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Unable to log out. Please try again.");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {/* Logo */}
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Work<span className="text-[#cd8416]">Bazaar</span>
        </h1>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10">
          <ul className="flex gap-6 text-gray-700 font-medium">
            {user && user.role === "recruiter" ? (
              <>
                <li><Link to="/admin/companies">Companies</Link></li>
                <li><Link to="/admin/jobs">Jobs</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/jobs">Jobs</Link></li>
                <li><Link to="/browse">Browse</Link></li>
              </>
            )}
          </ul>

          {/* Right Section */}
          {!user ? (
            <div className="flex gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#3f1e77]">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.profile?.profilePhoto} />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-64 mt-3 border border-gray-200 shadow-xl bg-white p-4 rounded-xl">
                <div>
                  <div className="flex gap-3 mb-3">
                    <Avatar>
                      <AvatarImage src={user?.profile?.profilePhoto} />
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{user?.fullname}</h4>
                      <p className="text-sm text-gray-500">
                        {user?.profile?.bio}
                      </p>
                    </div>
                  </div>
                  {user.role === "jobseeker" && (
                    <div className="flex gap-2 items-center cursor-pointer mb-2">
                      <User2 size={18} />
                      <Button variant="link">
                        <Link to="/profile">View Profile</Link>
                      </Button>
                    </div>
                  )}
                  <div className="flex gap-2 items-center cursor-pointer">
                    <LogOut size={18} />
                    <Button variant="link" onClick={logoutHandler}>
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white shadow-md border-t border-gray-100">
          <ul className="flex flex-col gap-3 p-4 text-gray-700 font-medium">
            {user && user.role === "recruiter" ? (
              <>
                <li><Link to="/admin/companies">Companies</Link></li>
                <li><Link to="/admin/jobs">Jobs</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/jobs">Jobs</Link></li>
                <li><Link to="/browse">Browse</Link></li>
              </>
            )}
          </ul>
          <div className="border-t border-gray-200 p-4 flex flex-col gap-2">
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-[#6A38C2] hover:bg-[#3f1e77] w-full">
                    Signup
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                onClick={logoutHandler}
                variant="outline"
                className="w-full text-red-600 border-red-300 hover:bg-red-50"
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

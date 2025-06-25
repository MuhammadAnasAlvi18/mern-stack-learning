import { useEffect } from "react";
import { axiosInstance } from "../lib/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";

const Header = () => {
  const { user} = useAuthStore();

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.get("/logout");
      console.log(res);
      window.location.href = "/";
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <header>
      <div className="header-logo">
        <span>LOGO</span>
      </div>
      <ul className="header-links">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/">About</a>
        </li>
        <li>
          <a href="/">Service</a>
        </li>
        <li>
          <a href="/">Contact</a>
        </li>
      </ul>
      <div className="header-btn">
        {user ? (
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <a href="/login">Login</a>
            <a href="/signup">Signup</a>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

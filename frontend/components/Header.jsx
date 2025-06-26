import { axiosInstance } from "../lib/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";
import { Menubar } from 'primereact/menubar';

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

  const items = [
        {
            label: user ? user.fullname : "",
            items: [
                {
                    label: 'Logout',
                    command: () => {
                        handleLogout();
                    }
                }
            ]
        }
    ];

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
          <Menubar model={items} />
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

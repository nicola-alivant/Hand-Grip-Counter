import { FaChartLine, FaHome } from "react-icons/fa";
import { Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom"; // Optional, if you use routing

const BottomNavBar = () => {
  const location = useLocation();

  const navItems = [
    { id: "home", label: "Home", icon: <FaHome size={18} />, path: "/" },
    {
      id: "chart",
      label: "Chart",
      icon: <FaChartLine size={18} />,
      path: "/chart",
    },
  ];

  return (
    <Navbar fixed="bottom" className="bg-primary py-2 shadow-md z-50">
      <div className="d-flex justify-content-around w-100">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`
                flex flex-col items-center px-4 py-1 rounded-md text-sm 
                transition-colors duration-200 w-100 m-1
                ${
                  isActive
                    ? "bg-white text-primary"
                    : "text-white hover:bg-white hover:text-primary"
                }
              `}
              style={{ textDecoration: "none" }}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </Navbar>
  );
};

export default BottomNavBar;

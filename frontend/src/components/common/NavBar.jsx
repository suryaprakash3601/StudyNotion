import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import getAllCategory from "../../services/operations/categoryApi";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { AiOutlineShoppingCart, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import ProfileDropdown from "../core/HomePage/ProfileDropDown";

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const [category, setCategory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategory();
        setCategory(response.data.data);
      } catch (error) {
        console.log("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const matchRoute = (route) => {
    return matchPath({ path: route, end: route === "/" }, location.pathname);
  };

  return (
    <div className="relative flex h-14 items-center justify-center border-b border-richblack-700 bg-richblack-900 text-richblack-25 z-50">
      <div className="w-11/12 max-w-maxContent flex items-center justify-between">
        {/* Logo */}
        <Link to="/" onClick={() => setIsOpen(false)}>
          <img src={logo} alt="Logo" className="h-8" />
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-sm font-medium">
            {NavbarLinks.map((el, index) => (
              <li key={index}>
                {el.title === "Catalog" ? (
                  <div className="relative group cursor-pointer flex items-center gap-1">
                    <p
                      className={`transition ${
                        matchRoute("/catalog") ? "text-yellow-25" : ""
                      }`}
                    >
                      {el.title}
                    </p>
                    <IoIosArrowDropdownCircle className="text-lg" />
                    {/* Dropdown */}
                    <div className="absolute left-1/2 top-full z-20 mt-2 w-[300px] -translate-x-1/2 rounded-md bg-richblack-5 text-richblack-900 p-4 shadow-md opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 h-4 w-4 bg-richblack-5"></div>
                      {category.length > 0 ? (
                        category.map((el, idx) => (
                          <Link
                            key={idx}
                            to={`/catalog/${el.name}`}
                            className="block px-3 py-2 hover:bg-richblack-100 rounded text-center"
                          >
                            {el.name}
                          </Link>
                        ))
                      ) : (
                        <p className="text-center text-sm">Loading...</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={el.path}>
                    <p
                      className={`hover:text-yellow-25 transition ${
                        matchRoute(el.path) ? "text-yellow-25" : ""
                      }`}
                    >
                      {el.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Auth Buttons / Profile / Cart */}
        <div className="flex gap-x-4 items-center">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-1 bg-richblack-700 rounded-lg px-3 py-1.5 border border-richblack-500 focus-within:border-yellow-400 transition-colors">
            <IoSearchOutline className="text-richblack-300 text-lg" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="bg-transparent text-sm text-white placeholder:text-richblack-400 outline-none w-40"
            />
          </form>
          {user && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative" onClick={() => setIsOpen(false)}>
              <AiOutlineShoppingCart size={25} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-100 text-black rounded-full text-xs px-1">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {!token && (
            <div className="hidden md:flex gap-x-4 items-center">
              <Link to="/login">
                <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
          {token && <ProfileDropdown />}

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="block md:hidden text-2xl text-richblack-100 focus:outline-none"
          >
            {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="absolute top-14 left-0 w-full bg-richblack-900 border-b border-richblack-700 z-50 flex flex-col p-6 gap-y-4 md:hidden shadow-lg">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-1 bg-richblack-700 rounded-lg px-3 py-2 border border-richblack-500 w-full">
            <IoSearchOutline className="text-richblack-300 text-lg" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="bg-transparent text-sm text-white placeholder:text-richblack-400 outline-none w-full"
            />
          </form>

          {/* Navigation Links */}
          <ul className="flex flex-col gap-y-4 text-base font-medium">
            {NavbarLinks.map((el, index) => (
              <li key={index} className="border-b border-richblack-800 pb-2">
                {el.title === "Catalog" ? (
                  <div className="flex flex-col">
                    <button
                      onClick={() => setCatalogOpen(!catalogOpen)}
                      className="flex items-center justify-between w-full text-left text-richblack-25 focus:outline-none"
                    >
                      <p>{el.title}</p>
                      <IoIosArrowDropdownCircle className={`text-lg transition-transform duration-200 ${catalogOpen ? "rotate-180" : ""}`} />
                    </button>
                    {catalogOpen && (
                      <div className="mt-2 flex flex-col gap-y-2 pl-4">
                        {category.length > 0 ? (
                          category.map((el, idx) => (
                            <Link
                              key={idx}
                              to={`/catalog/${el.name}`}
                              onClick={() => setIsOpen(false)}
                              className="text-sm text-richblack-200 hover:text-yellow-25 py-1"
                            >
                              {el.name}
                            </Link>
                          ))
                        ) : (
                          <p className="text-xs text-richblack-300">Loading categories...</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to={el.path} onClick={() => setIsOpen(false)}>
                    <p className={matchRoute(el.path) ? "text-yellow-25" : "text-richblack-25"}>
                      {el.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Auth Buttons */}
          {!token && (
            <div className="flex flex-col gap-y-3 mt-4">
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <button className="w-full text-center border border-richblack-700 bg-richblack-800 py-2 text-richblack-100 rounded-md">
                  Log in
                </button>
              </Link>
              <Link to="/signup" onClick={() => setIsOpen(false)}>
                <button className="w-full text-center bg-yellow-50 py-2 text-richblack-900 font-semibold rounded-md">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NavBar;

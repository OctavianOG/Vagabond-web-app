import { useState, useCallback } from "react";
import { FiSun } from "react-icons/fi";
import { AiOutlineBell } from "react-icons/ai";
import { BiHeartCircle } from "react-icons/bi";
import { FaListUl } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { VscAccount } from "react-icons/vsc";
import { BsMoon } from "react-icons/bs";
import { Link } from "react-router-dom";
import useStore from "../store/store";
import { trpc } from "../trpc";
import { useQueryClient } from "@tanstack/react-query";

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleDropdown = useCallback(() => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }, []);
  const store = useStore();
  const user = store.authorizedUser;
  const { darkMode, toggleDarkMode } = store;
  const queryClient = useQueryClient();

  const { mutate: userLogout } = trpc.userLogout.useMutation({
    onSuccess(data) {
      queryClient.clear();
      document.location.href = "/login";
    },
    onError(error) {
      queryClient.clear();
      document.location.href = "/login";
    },
  });

  const handleLogout = () => {
    userLogout();
  };

  return (
    <header
      className={`${
        darkMode ? "bg-[#111111]" : "bg-white"
      } pb-6 font-normal lg:min-h-[85px]`}
    >
      <nav
        className={`m-auto grid w-[80%] grid-cols-[repeat(auto-fit,minmax(100px,1fr))] justify-between ${
          darkMode ? "text-[#FFFFFF]" : "text-black"
        }`}
      >
        <Link to="/">
          <img
            className="pointer-events-none h-[80px]"
            src={`${darkMode ? "/images/logo.png" : "/images/black-logo.png"}`}
            alt="Logo"
          />
        </Link>
        <ul className="col-span-2 my-auto grid grid-flow-col justify-between">
          <li>
            <Link to="/properties/search">BUY</Link>
          </li>
          <li>
            <Link to="/sell">SELL</Link>
          </li>
          <li>
            <Link to="/properties/search">RENT</Link>
          </li>
          <li>
            <Link to="/">BLOG</Link>
          </li>
        </ul>
        <ul className="my-auto grid grid-flow-col justify-end gap-10">
          <li>
            <select
              className={`appearance-none  ${
                darkMode ? "bg-[#111111]" : "bg-white"
              } outline-none`}
            >
              <option value="ENG">ENG</option>
              <option value="UA">UA</option>
            </select>
          </li>
          <li>
            {darkMode ? (
              <FiSun
                className="cursor-pointer"
                onClick={toggleDarkMode}
                size={25}
              />
            ) : (
              <BsMoon
                className="cursor-pointer"
                onClick={toggleDarkMode}
                size={25}
              />
            )}
          </li>
        </ul>
        <ul className="my-auto grid grid-flow-col justify-end gap-10">
          {!user ? (
            <li>
              <Link to="/login">Login</Link>
            </li>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={toggleDropdown}
                className={`flex items-center rounded-md bg-transparent px-4 py-2  ${
                  darkMode ? "text-white" : "text-black"
                } outline-none focus:outline-none`}
              >
                Account
              </button>
              {isOpen && (
                <div
                  className={`absolute right-0 mt-2 h-48 w-40 rounded-md border ${
                    darkMode ? "bg-[#111111] text-white" : "bg-white text-black"
                  }`}
                >
                  <ul className="py-1">
                    <li>
                      <Link
                        onClick={toggleDropdown}
                        to="/profile"
                        className="flex justify-between px-4 py-2 text-sm"
                      >
                        Profile <VscAccount size={20} />
                      </Link>
                    </li>
                    <hr />
                    <li>
                      <Link
                        onClick={toggleDropdown}
                        to="/featured"
                        className="flex justify-between px-4 py-2 text-sm"
                      >
                        Featured <BiHeartCircle size={20} />
                      </Link>
                    </li>
                    <hr />
                    <li>
                      <Link
                        onClick={toggleDropdown}
                        to="/listings"
                        className="flex justify-between px-4 py-2 text-sm"
                      >
                        Listings <FaListUl size={20} />
                      </Link>
                    </li>
                    <hr />
                    <li
                      className="mt-10 flex justify-between px-4 text-sm hover:cursor-pointer"
                      onClick={handleLogout}
                    >
                      Log out
                      <BiLogOut size={20} />
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          <li className="my-auto">
            <AiOutlineBell size={25} />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

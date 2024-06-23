import { CiLogout } from "react-icons/ci";
import { FaUserPlus } from "react-icons/fa";
import { MdOutlineChat } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import Avatar from "./Avatar";
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from "./SearchUser";

const Sidebar = () => {
  const user = useSelector((state: RootState) => state.user.user);

  const [openEditProfileModal, setOpenEditProfileModal] =
    useState<boolean>(false);
  const [allUsers, setAllUsers] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState<boolean>(false);

  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
      <div className="bg-slate-200 w-12 h-full rounded-r-lg py-5 flex flex-col justify-between">
        <div>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-400 rounded ${
                isActive && "bg-slate-300"
              }`
            }
            title="Chats"
          >
            <MdOutlineChat size={25} />
          </NavLink>
          <div
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-400 rounded"
            title="Add friend"
            onClick={() => setOpenSearchUser(true)}
          >
            <FaUserPlus size={25} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button
            title={user?.name}
            onClick={() => setOpenEditProfileModal(!openEditProfileModal)}
          >
            <Avatar
              width={40}
              height={40}
              name={user?.name || ""}
              imageUrl={user?.avatar}
              userId={user?._id}
            />
          </button>
          <button
            title="Logout"
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-400 rounded"
          >
            <span className="">
              <CiLogout size={21} />
            </span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="h-16 flex items-center">
          <h2 className="text-xl font-bold p-4 text-slate-800">Chats</h2>
        </div>
        <div className="bg-slate-200 p-[0.5px]"></div>
        <div className=" h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar scroll-smooth">
          {allUsers.length === 0 && (
            <div className="mt-12">
              <div className="flex justify-center items-center my-4 text-slate-500">
                <FiArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-center text-slate-400">
                Explore users to connect and chat daily.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* edit user details */}
      {openEditProfileModal && (
        <EditProfileModal onClose={() => setOpenEditProfileModal(false)} />
      )}

      {/* search users */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
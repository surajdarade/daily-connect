import { CiLogout } from "react-icons/ci";
import { FaImage, FaVideo, FaUserPlus } from "react-icons/fa6";
import { MdOutlineChat } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useEffect, useState } from "react";
import EditProfileModal from "./EditProfileModal";
import Avatar from "./Avatar";
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from "./SearchUser";
import { userSliceReset } from "../store/userSlice";
import { getSocket } from "../middleware/socketMiddleware";
import toast from "react-hot-toast";
import axios from "axios";

type User = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  online: boolean;
};

type Message = {
  _id: string;
  msgByUserId: string;
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string;
};

type ConversationUser = {
  sender: User;
  receiver: User;
  lastMsg?: Message;
  unseenMsg?: number;
  userDetails: User;
};

const Sidebar = () => {
  const user = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const socketConnection = getSocket();

  const [openEditProfileModal, setOpenEditProfileModal] =
    useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<ConversationUser[]>([]);
  const [openSearchUser, setOpenSearchUser] = useState<boolean>(false);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user?._id);

      socketConnection.on("conversation", (data) => {
        console.log("conversation", data);

        const conversationUserData = data.map(
          (conversationUser: {
            sender: { _id: string };
            receiver: { _id: string | undefined };
          }) => {
            if (
              conversationUser?.sender?._id === conversationUser?.receiver?._id
            ) {
              return {
                ...conversationUser,
                userDetails: conversationUser?.sender,
              };
            } else if (conversationUser?.receiver?._id !== user?._id) {
              return {
                ...conversationUser,
                userDetails: conversationUser.receiver,
              };
            } else {
              return {
                ...conversationUser,
                userDetails: conversationUser.sender,
              };
            }
          }
        );

        setAllUsers(conversationUserData);
      });
    }
  }, [socketConnection, user]);

  const handleLogout = async () => {
    const socket = getSocket();
    if (socket) {
      socket.disconnect();
    }
    dispatch(userSliceReset());
    localStorage.clear();
    try {
      const res = await axios.post(`https://daily-connect-server.vercel.app/api/v1/auth/logout`);
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/email");
      }
    } catch (error) {
      toast.error("Error logging out, try again later");
    }
  };

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
              userId={user?._id || ""}
            />
          </button>
          <button
            title="logout"
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
            onClick={handleLogout}
          >
            <span className="-ml-2">
              <CiLogout size={20} />
            </span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="h-16 flex items-center">
          <h2 className="text-2xl p-4 text-slate-800">Chats</h2>
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
          {allUsers.map((conv) => {
            return (
              <NavLink
                to={"/" + conv?.userDetails?._id}
                key={conv?.userDetails?._id}
                className="flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer"
              >
                <div>
                  <Avatar
                    imageUrl={conv?.userDetails?.avatar}
                    name={conv?.userDetails?.name}
                    width={40}
                    height={40}
                    userId={conv?.userDetails?._id}
                  />
                </div>
                <div>
                  <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">
                    {conv?.userDetails?.name}
                  </h3>
                  <div className="text-slate-500 text-xs flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      {conv?.lastMsg?.imageUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaImage />
                          </span>
                          {!conv?.lastMsg?.text && <span>Image</span>}
                        </div>
                      )}
                      {conv?.lastMsg?.videoUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaVideo />
                          </span>
                          {!conv?.lastMsg?.text && <span>Video</span>}
                        </div>
                      )}
                    </div>
                    <p className="text-ellipsis line-clamp-1">
                      {conv?.lastMsg?.text}
                    </p>
                  </div>
                </div>
                {Boolean(conv?.unseenMsg) && (
                  <p className="text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full">
                    {conv?.unseenMsg}
                  </p>
                )}
              </NavLink>
            );
          })}
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
import React, { useEffect, useState } from "react";
import { IoSearchOutline, IoClose } from "react-icons/io5";
import Loading from "./Loading";
import UserSearchCard from "./UserSearchCard";
import toast from "react-hot-toast";
import axios from "axios";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

interface SearchUserProps {
  onClose: () => void;
}

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

const SearchUser: React.FC<SearchUserProps> = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const user = useSelector((state: RootState) => state.user);

  const handleSearchUser = async () => {
    const URL = `https://daily-connect-server.vercel.app/api/v1/chat/searchUser`;
    try {
      setLoading(true);
      const res = await axios.post(URL, { search, selfId: user?._id });
      setLoading(false);

      setSearchUser(res.data.data);
    } catch (error) {
      toast.error("Unexpected error occurred, Please try again later");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search.trim() !== "") {
      handleSearchUser();
    } else {
      setSearchUser([]);
    }
  }, [search]);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10">
      <div className="w-full max-w-lg mx-auto mt-10">
        {/**input search user */}
        <div className="bg-white rounded h-14 overflow-hidden flex">
          <input
            type="text"
            placeholder="Search user by name, email...."
            className="w-full outline-none py-1 h-full px-4"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className="h-14 w-14 flex justify-center items-center">
            <IoSearchOutline size={25} />
          </div>
        </div>

        {/**display search user */}
        <div className="bg-white mt-2 w-full p-4 rounded">
          {/**no user found */}
          {search.trim() === "" && !loading && (
            <p className="text-center text-slate-500">No user found!</p>
          )}

          {loading && (
            <span>
              <Loading />
            </span>
          )}

          {search.trim() !== "" && searchUser.length === 0 && !loading && (
            <p className="text-center text-slate-500">No user found!</p>
          )}

          {searchUser.length !== 0 &&
            !loading &&
            searchUser.map((user) => (
              <UserSearchCard key={user._id} user={user} onClose={onClose} />
            ))}
        </div>
      </div>

      <div
        className="absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white"
        onClick={onClose}
      >
        <button>
          <IoClose />
        </button>
      </div>
    </div>
  );
};

export default SearchUser;

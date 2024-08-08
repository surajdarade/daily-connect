/* eslint-disable react-refresh/only-export-components */
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import React, { useRef, useState, useEffect } from "react";
import Avatar from "./Avatar";
import Divider from "./Divider";
import toast from "react-hot-toast";
import axios from "axios";
import { setUser, userSliceReset } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { Helmet } from "react-helmet";

interface EditProfileModalProps {
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
  const user = useSelector((state: RootState) => state.user);

  const [name, setName] = useState<string>(user?.name || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setAvatar(file);
    }
  };

  const handleClearAvatar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setAvatar(null);
  };

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get(
        `https://daily-connect-server.vercel.app/api/v1/user/userDetails`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.data));
      } else {
        toast.error("Failed to fetch user details");
      }
    } catch (error) {
      toast.error("Error fetching user details");
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (name.trim().length === 0) {
      toast.error("Name cannot be empty");
      return;
    }

    if (name === user?.name && !avatar) {
      toast.error("No changes are made to update");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const res = await axios.put(
        `https://daily-connect-server.vercel.app/api/v1/user/updateUser`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        fetchUserDetails(); // Fetch updated user details
      } else {
        toast.error(res.data.message);
      }

      if (res.data.logout) {
        dispatch(userSliceReset());
        navigate("/email");
      }
    } catch (error) {
      toast.error("Please try again later");
    }

    setAvatar(null);
    setLoading(false);
    // onClose();  // Close the modal after updating
  };

  const handleCancel = () => {
    setAvatar(null);
    onClose();
  };

  useEffect(() => {
    // Fetch user details on mount
    fetchUserDetails();
  }, []);

  return (
    <>
    <Helmet>
      <title>Edit Profile | {user?.name}</title>
    </Helmet>
      <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
        <div className="bg-white p-4 rounded m-1 max-w-sm w-full">
          <h2 className="font-semilbold text-xl">Profile Details</h2>
          <p className="text-sm text-gray-500">Update profile details</p>
          <form className="grid gap-3 mt-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-1 px-2 focus:outline-primary border rounded"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={user?.email}
                className="w-full py-1 px-2 focus:outline-primary border rounded bg-gray-200 text-gray-600 cursor-not-allowed"
                disabled
              />
            </div>
            <div>
              <div>Avatar</div>
              <div className="my-1 flex items-center gap-4">
                {avatar ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={URL.createObjectURL(avatar)}
                      alt="Selected Avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <button
                      onClick={handleClearAvatar}
                      className="text-red-500 text-bold rounded-full border p-1 px-3 hover:bg-[#ff4747] hover:text-white"
                    >
                      Remove Avatar
                    </button>
                  </div>
                ) : (
                  <>
                    <Avatar
                      width={40}
                      height={40}
                      imageUrl={user?.avatar}
                      name={user?.name || ""}
                      userId={user?._id || ""}
                    />
                    <label htmlFor="avatar">
                      <button
                        className="font-semibold hover:text-primary"
                        onClick={(e) => {
                          e.preventDefault();
                          if (fileInputRef.current) {
                            fileInputRef.current.click();
                          }
                        }}
                      >
                        Change Avatar
                      </button>
                      <input
                        type="file"
                        id="avatar"
                        name="avatar"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleAvatar}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
            <Divider />
            <div className="flex gap-2 w-fit ml-auto ">
              <button
                onClick={handleCancel}
                className="border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white"
              >
                Close
              </button>
              <button
                onClick={handleSubmit}
                className="border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary"
              >
                {loading ? (
                  <ClipLoader color={"#ffffff"} loading={true} size={20} /> // Display spinner when loading
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default React.memo(EditProfileModal);

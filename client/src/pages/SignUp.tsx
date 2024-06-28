import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { Helmet } from "react-helmet";

const SignUp = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [avatar, setAvatar] = useState<File | null>(null);

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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // SIGN UP
    let isValid = true;
    let toastMessage = "";

    if (!name.trim()) {
      isValid = false;
      toastMessage += "Name is required.\n";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(emailRegex)) {
      isValid = false;
      toastMessage += "Invalid email address.\n";
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!password.match(passwordRegex)) {
      isValid = false;
      toastMessage +=
        "Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 6 characters long.\n";
    }

    if (isValid) {
      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);

        if (avatar) {
          formData.append("avatar", avatar);
        }

        const res = await axios.post(
          `http://localhost:3000/api/v1/auth/signup`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/email");
        }
      } catch (error) {
        toast.error("Please try again later");
      }
    } else {
      toast.error(toastMessage);
    }

    setName("");
    setEmail("");
    setPassword("");
    setAvatar(null);
  };

  return (
    <>
      <Helmet>
        <title>Daily Connect / Sign Up</title>
      </Helmet>
      <div className="mt-5">
        <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
          <form
            method="POST"
            className="grid gap-4 mt-5"
            onSubmit={handleFormSubmit}
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="name">Name: </label>
              <input
                type="text"
                placeholder="Enter your name"
                id="name"
                name="name"
                value={name}
                className="bg-slate-100 px-2 py-1 focus:outline-primary"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="email">Email: </label>
              <input
                type="email"
                placeholder="Enter your email"
                id="email"
                name="email"
                value={email}
                className="bg-slate-100 px-2 py-1 focus:outline-primary"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password">Password: </label>
              <input
                type="password"
                placeholder="Enter your password"
                id="password"
                name="password"
                value={password}
                className="bg-slate-100 px-2 py-1 focus:outline-primary"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="avatar">Profile Photo:</label>
              <label
                htmlFor="avatar"
                className="h-14 bg-slate-200 flex justify-center items-center border hover:border-primary cursor-pointer"
              >
                <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                  {avatar?.name ? avatar?.name : "Upload profile photo"}
                </p>
                {avatar?.name && (
                  <button
                    className="text-lg ml-2 hover:text-red-600"
                    onClick={handleClearAvatar}
                  >
                    <IoClose />
                  </button>
                )}
              </label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                className="bg-slate-100 px-2 py-1 focus:outline-primary hidden"
                accept="image/*"
                onChange={handleAvatar}
              />
            </div>
            <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide">
              Sign up
            </button>
          </form>
          <p className="my-3 text-center">
            Already have an account?{" "}
            <Link to="/email" className="hover:text-primary font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;

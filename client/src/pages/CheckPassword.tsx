import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { PiUserCircle } from "react-icons/pi";
import { AiFillLeftCircle } from "react-icons/ai";
import { Helmet } from "react-helmet";

const CheckPassword = () => {
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await axios.post(
        `https://daily-connect-server.vercel.app/api/v1/auth/password`,
        { userId: location?.state, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        localStorage.setItem("token", res?.data?.data);
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Please try again later");
    }
  };

  return (
    <>
      <Helmet>
        <title>Daily Connect / Sign In</title>
      </Helmet>
      <div className="mt-5">
        <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
          <div className="mx-auto w-fit mb-2">
            <PiUserCircle size={80} />
          </div>
          <form
            method="POST"
            className="grid gap-4 mt-5"
            onSubmit={handleFormSubmit}
          >
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
            <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide">
              Sign in
            </button>
          </form>
          <div className="my-3 text-center flex flex-col items-center gap-2">
            <div className="flex gap-2 hover:text-primary font-semibold">
              <AiFillLeftCircle size={25} />
              <Link to="/email">Go back</Link>
            </div>
            <div className="flex gap-2 hover:text-primary font-semibold">
              <Link to="/forgot-password">Forgot password</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckPassword;

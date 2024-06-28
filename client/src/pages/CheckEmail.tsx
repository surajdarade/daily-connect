import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { PiUserCircle } from "react-icons/pi";
import { Helmet } from "react-helmet";

const CheckEmail = () => {
  const [email, setEmail] = useState<string>("");

  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    let isValid = true;
    let toastMessage = "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(emailRegex)) {
      isValid = false;
      toastMessage += "Invalid email address.\n";
    }

    if (isValid) {
      try {
        const res = await axios.post(
          `http://localhost:3000/api/v1/auth/email`,
          { email },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/password", { state: res?.data?.data?._id });
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        toast.error("Please try again later");
      }
    } else {
      toast.error(toastMessage);
    }
    setEmail("");
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
            <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide">
              Check email to insert password
            </button>
          </form>
          <div className="my-3 text-center gap-2">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="hover:text-primary font-semibold">
                Sign up
              </Link>
            </p>
            <p>
              <Link
                to="/forgot-password"
                className="gap-2 hover:text-primary font-semibold"
              >
                Forgot password
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckEmail;

import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { setUser, userSliceReset, setSocketId } from "../store/userSlice";
import Sidebar from "./Sidebar";
import logo from "../assets/logo.png";
import { getSocket } from "../middleware/socketMiddleware";
import { Helmet } from "react-helmet";
import { RootState } from "../store/store";

const Home = () => {
  const user = useSelector((state: RootState) => state?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = location.pathname === "/";

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const res = await axios.get(
        `process.env.VITE_APP_SERVER_USER_URI/userDetails`,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.data));
      }

      if (res.data.data.logout) {
        dispatch(userSliceReset());
        navigate("/email");
      }
    } catch (error) {
      if(user){
        toast.error("Error fetching user details!");
      }
      
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Redirect if not logged in and on base path
  useEffect(() => {
    if (!user && basePath) {
      navigate("/email");
    }
  }, [user, basePath, navigate]);

  // Socket connection
  useEffect(() => {
    dispatch({ type: "user/connectSocket" });
    const socket = getSocket();
    if (socket) {
      dispatch(setSocketId(socket?.id || ""));
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Daily Connect | Home</title>
      </Helmet>
      <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
        <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
          <Sidebar />
        </section>

        {/**message component**/}
        <section className={`${basePath && "hidden"}`}>
          <Outlet />
        </section>

        <div
          className={`justify-center items-center flex-col gap-2 hidden ${
            !basePath ? "hidden" : "lg:flex"
          }`}
        >
          <div>
            <img src={logo} width={250} alt="logo" />
          </div>
          <p className="text-lg mt-2 text-slate-500">
            Select user to send message
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
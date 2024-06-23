import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import { RootState } from "../store/store";
import { setUser, userSliceReset } from "../store/userSlice";
import Sidebar from "./Sidebar";
import logo from '../assets/logo.png'

const Home = () => {
  // const user = useSelector((state: RootState) => state?.user?.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/v1/user/userDetails",
        { withCredentials: true }
      );
      console.log("fetch ", res);
      if (res.data.success) {
        dispatch(setUser(res.data.data));
      }

      if (res.data.data.logout) {
        dispatch(userSliceReset());
        navigate("/email");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching user details");
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const basePath = location.pathname === "/";
  return (
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
  );
};

export default Home;

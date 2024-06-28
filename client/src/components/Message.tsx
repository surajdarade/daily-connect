import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSocket } from "../middleware/socketMiddleware";
import backgroundImage from "../assets/wallapaper.jpeg";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { IoMdSend } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Loading from "./Loading";
import toast from "react-hot-toast";
import moment from "moment";
import { Helmet } from "react-helmet";

interface Message {
  _id: string;
  msgByUserId: string;
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string;
}

const Message = () => {
  const user = useSelector((state: RootState) => state?.user);

  const params = useParams();
  const socketConnection = getSocket();

  const [dataUser, setDataUser] = useState({
    _id: "",
    name: "",
    email: "",
    avatar: "",
    online: false,
  });
  const [message, setMessage] = useState("");
  const [allMessage, setAllMessage] = useState([]);
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [openImageVideoUpload, setOpenImageVideoUpload] =
    useState<boolean>(false);
  const currentMessage = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImage(file);
    }
    setOpenImageVideoUpload(false);
  };

  const handleVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setVideo(file);
    }
    setOpenImageVideoUpload(false);
  };

  const handleClearUploadMedia = () => {
    setImage(null);
    setVideo(null);
    setLoading(false);
    setOpenImageVideoUpload(false);
  };

  const handleUploadImageVideoOpen = (): void => {
    setOpenImageVideoUpload((prev: boolean) => !prev);
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!socketConnection) {
      toast.error("Wait for socket connection");
      return;
    }

    if ((message || image || video) && user?._id && params?.userId) {
      if (socketConnection) {
        // Construct the message object conditionally
        const messageData: { [key: string]: unknown } = {
          sender: user?._id,
          receiver: params?.userId,
          text: message,
          msgByUserId: user?._id,
        };

        if (image) {
          const imageBuffer = await image.arrayBuffer();
          messageData.image = {
            buffer: imageBuffer,
            filename: image.name,
            mimetype: image.type,
          };
        }

        if (video) {
          const videoBuffer = await video.arrayBuffer();
          messageData.video = {
            buffer: videoBuffer,
            filename: video.name,
            mimetype: video.type,
          };
        }

        socketConnection.emit("newMessage", messageData);

        setMessage("");
        setImage(null);
        setVideo(null);
      }
    }
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("messagePage", params?.userId);

      socketConnection.emit("seen", params.userId);

      socketConnection.on("messageUser", (data) => {
        setDataUser(data);
      });
      socketConnection.on("message", (messages) => {
        // console.log('message data',messages)
        setAllMessage(messages);
      });
    }
  }, [socketConnection, params?.userId, user]);

  return (
    <>
      <Helmet>
        <title>{dataUser?.name ? `Chat | ${dataUser.name}` : `Chat`}</title>
      </Helmet>
      <div
        style={{ backgroundImage: `url(${backgroundImage})` }}
        className="bg-no-repeat bg-cover"
      >
        <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
          <div className="flex items-center gap-4">
            <Link to={"/"} className="lg:hidden">
              <FaAngleLeft size={25} />
            </Link>
            <div>
              <Avatar
                width={50}
                height={50}
                imageUrl={dataUser?.avatar}
                name={dataUser?.name}
                userId={dataUser?._id}
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
                {dataUser?.name}
              </h3>
              <p className="-my-2 text-sm">
                {dataUser.online ? (
                  <span className="text-primary">online</span>
                ) : (
                  <span className="text-slate-400">offline</span>
                )}
              </p>
            </div>
          </div>

          <div>
            <button className="cursor-pointer hover:text-primary">
              <HiDotsVertical />
            </button>
          </div>
        </header>

        {/* show all messages */}
        <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
          {/**all message show here */}
          <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
            {allMessage.map(
              (msg: Message) => {
                return (
                  <div
                    key={msg?._id}
                    className={` p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
                      user?._id === msg?.msgByUserId
                        ? "ml-auto bg-teal-100"
                        : "bg-white"
                    }`}
                  >
                    <div className="w-full relative">
                      {msg?.imageUrl && (
                        <img
                          src={msg?.imageUrl}
                          className="w-full h-full object-scale-down"
                        />
                      )}
                      {msg?.videoUrl && (
                        <video
                          src={msg.videoUrl}
                          className="w-full h-full object-scale-down"
                          controls
                        />
                      )}
                    </div>
                    <p className="px-2">{msg.text}</p>
                    <p className="text-xs ml-auto w-fit">
                      {moment(msg.createdAt).format("hh:mm")}
                    </p>
                  </div>
                );
              }
            )}
          </div>

          {/* upload Image display */}
          {image && (
            <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
              <div
                className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-white"
                onClick={handleClearUploadMedia}
              >
                <IoClose size={30} />
              </div>
              <div className="bg-white p-3">
                <img
                  src={URL.createObjectURL(image)}
                  alt="image"
                  className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                />
              </div>
            </div>
          )}
          {/* upload video display */}
          {video && (
            <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
              <div
                className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-white"
                onClick={handleClearUploadMedia}
              >
                <IoClose size={40} />
              </div>
              <div className="bg-white p-3">
                <video
                  src={URL.createObjectURL(video)}
                  className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                  controls
                  controlsList="nodownload"
                />
              </div>
            </div>
          )}
          {loading && (
            <div className="w-full h-full flex sticky bottom-0 justify-center items-center">
              <Loading />
            </div>
          )}
        </section>

        {/* send message */}
        <section className="h-16 bg-white flex items-center px-4">
          <div className="relative ">
            <button
              onClick={handleUploadImageVideoOpen}
              className="flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white"
            >
              <FaPlus size={20} />
            </button>

            {/* video and image */}
            {openImageVideoUpload && (
              <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
                <form>
                  <label
                    htmlFor="image"
                    className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                  >
                    <div className="text-primary">
                      <FaImage size={18} />
                    </div>
                    <p>Image</p>
                  </label>
                  <label
                    htmlFor="video"
                    className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                  >
                    <div className="text-purple-500">
                      <FaVideo size={18} />
                    </div>
                    <p>Video</p>
                  </label>

                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleImage}
                    accept="image/*"
                    className="hidden"
                  />

                  <input
                    type="file"
                    id="video"
                    name="video"
                    accept="video/*"
                    onChange={handleVideo}
                    className="hidden"
                  />
                </form>
              </div>
            )}
          </div>

          {/* input box */}
          <form
            className="h-full w-full flex gap-2"
            onSubmit={handleSendMessage}
          >
            <input
              type="text"
              placeholder="Type here message..."
              className="py-1 px-4 outline-none w-full h-full"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="text-primary hover:text-secondary">
              <IoMdSend size={28} />
            </button>
          </form>
        </section>
      </div>
    </>
  );
};

export default Message;

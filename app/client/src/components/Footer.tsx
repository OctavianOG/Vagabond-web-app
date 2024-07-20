import {
  BsTelegram,
  BsTwitter,
  BsReddit,
  BsDiscord,
  BsGithub,
  BsYoutube,
  BsFacebook,
  BsInstagram,
} from "react-icons/bs";
import useStore from "../store/store";

const Footer = () => {
  const todayDate: Date = new Date();
  const { darkMode } = useStore();
  return (
    <footer
      className={`mt-auto flex min-h-[250px] flex-col ${
        darkMode ? "bg-[#111111] text-[#FFFFFF]" : "bg-white text-black"
      } pt-10 font-normal`}
    >
      <div className="mx-auto w-[80%] space-y-10">
        <div className="grid lg:grid-cols-3">
          <div className="space-y-16">
            <img
              className="h-[30px]"
              src={`${
                darkMode
                  ? "/images/WhiteLogoWord.png"
                  : "/images/BlackLogoWord.png"
              }`}
              alt="logo"
            />
            <h1>Unlock The Door To Your New Home With Ease.</h1>
            <ul className="m-auto flex items-stretch space-x-4">
              <li>BUY</li>
              <li>SELL</li>
              <li>RENT</li>
              <li>BLOG</li>
            </ul>
          </div>
          <ul className="space-y-10">
            <li className="font-bold">Help</li>
            <li>Customer Support</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
          </ul>
          <div className="space-y-12">
            <h1 className="text-center">Follow us</h1>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(48px,48px))] justify-between gap-x-20 gap-y-4 ">
              <BsTelegram size={48} />
              <BsInstagram size={48} />
              <BsTwitter size={48} />
              <BsReddit size={48} />
              <BsDiscord size={48} />
              <BsGithub size={48} />
              <BsYoutube size={48} />
              <BsFacebook size={48} />
            </div>
          </div>
        </div>
        <div>
          <hr />
          <h1 className="text-center">
            &copy; {todayDate.getFullYear()} Vagabond real-estate marketplace.
            All Rights Reserved.
          </h1>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

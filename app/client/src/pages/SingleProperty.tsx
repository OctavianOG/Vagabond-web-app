import { useParams } from "react-router-dom";
import { trpc } from "../trpc";
import { toast } from "react-toastify";
import useStore from "../store/store";
import { BiHeartCircle } from "react-icons/bi";
import PropertyActions from "../components/PropertyAction";

const SingleProperty = () => {
  const { propertyId } = useParams();
  const store = useStore();
  const user = store.authorizedUser;
  const { darkMode } = store;
  const { data: property } = trpc.getProperty.useQuery(
    { propertyId },
    {
      select: (data) => data.data.property,
      retry: 1,
      onSuccess: (data) => {
        console.log("Fetched property successfully");
      },
      onError: (error) => {
        toast(error.message, {
          type: "error",
          position: "top-right",
        });
      },
    }
  );

  if (!property) {
    return null;
  }

  return (
    <main
      className={`min-h-screen ${
        darkMode ? "bg-[#111111]" : "bg-white"
      } font-normal`}
    >
      <div
        className={`m-auto w-[80%] ${
          darkMode ? "text-[#FFFFFF]" : "textblack"
        }`}
      >
        <h1 className="py-4 text-center text-5xl font-bold">
          {property.type.charAt(0).toUpperCase() + property.type.slice(1)} for
          sale
        </h1>
        <div className="grid justify-between gap-y-1 overflow-hidden rounded-[50px] sm:grid-cols-[repeat(auto-fit,minmax(200px,200px))] xl:grid-cols-[repeat(auto-fit,minmax(250px,250px))]">
          {property.images.map((img) => (
            <img
              src={img}
              alt="House interior preview"
              className="object-cover sm:h-[200px] sm:w-[200px] xl:h-[250px] xl:w-[250px]"
            />
          ))}
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,250px))] justify-between py-4">
          <p className="m-auto text-xl font-medium">410 000 $</p>
          <p className="m-auto text-xl font-medium">
            Aparment area: {property.area}&sup2;
          </p>
          <p className="m-auto text-justify text-xl font-medium">
            {property.address}
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,300px))] justify-between gap-y-8">
          <p className="m-auto text-xl">Quantity of rooms: {property.rooms}</p>
          <PropertyActions user={user} propertyId={propertyId} />
          <p className="m-auto text-xl">Floor: {property.floor}</p>
        </div>
        <div className="grid justify-between gap-y-8 py-4 sm:grid-cols-[repeat(auto-fit,minmax(450px,450px))] 2xl:grid-cols-[repeat(auto-fit,minmax(500px,500px))]">
          <p className="mx-auto text-justify text-xl font-light">
            {property.info}
          </p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d342336.0789987482!2d33.03688720238609!3d47.907350174256464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40dadfe03154ab7b%3A0xb0fa3a177d6b186e!2z0JrRgNC40LLQvtC5INCg0L7Qsywg0JTQvdC10L_RgNC-0L_QtdGC0YDQvtCy0YHQutCw0Y8g0L7QsdC70LDRgdGC0YwsIDUwMDAw!5e0!3m2!1sru!2sua!4v1685975068189!5m2!1sru!2sua"
            className="w-full rounded-3xl border-0 sm:col-span-2 sm:h-full lg:col-span-1 xl:h-[300px] 2xl:col-span-2"
            loading="lazy"
          ></iframe>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,300px))] justify-between">
          <button
            className={`flex h-[40px] w-[300px] justify-between rounded-[50px] ${
              darkMode ? "bg-white" : "bg-black"
            }`}
          >
            <img
              src="/images/Agent.png"
              className="h-[40px] w-[40px] rounded-full object-cover"
            />
            <p
              className={`m-auto ${darkMode ? "text-[#111111]" : "text-white"}`}
            >{`${property.author.name} ${property.author.surname}`}</p>
          </button>
          <button
            className={`m-auto h-[40px] w-[300px] rounded-[50px] border-2 border-solid ${
              darkMode
                ? "border-white text-white hover:bg-white hover:text-[#111111]"
                : "border-black text-black hover:bg-black hover:text-white"
            }`}
          >
            Send a message
          </button>
          <button className="m-auto h-[40px] w-[300px] rounded-[50px] bg-[#CAFC01] text-[#111111]">
            {property.author.phonenumber}
          </button>
        </div>
      </div>
    </main>
  );
};
export default SingleProperty;

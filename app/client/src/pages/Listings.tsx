import { BiTrash } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import useStore from "../store/store";
import { trpc } from "../trpc";
import { toast } from "react-toastify";
import PropertyListings from "../components/PropertyListings";

const Listings = () => {
  const store = useStore();
  const user = store.authorizedUser;
  const { darkMode } = store;

  const { data: properties } = trpc.getPropertiesByAuthor.useQuery(
    { email: user?.email },
    {
      select: (data) => data.data.properties,
      retry: 1,
      onSuccess: (data) => {
        console.log("Successfuly fetched properties");
      },
      onError: (error) => {
        toast(error.message, {
          type: "error",
          position: "top-right",
        });
      },
    }
  );

  return (
    <main
      className={`min-h-screen  font-normal ${
        darkMode ? "bg-[#111111] text-white" : "bg-white text-black"
      } `}
    >
      <div className="m-auto w-[80%]">
        <h1 className="text-center text-5xl font-bold">My listings</h1>
        {properties?.length === 0 ? (
          <p className="text-center" role="alert"></p>
        ) : (
          <ul className="grid justify-between gap-x-12 gap-y-16 pt-4 sm:grid-cols-[repeat(auto-fit,minmax(200px,200px))] md:grid-cols-[repeat(auto-fit,minmax(252px,252px))]">
            {properties?.map((property) => (
              <PropertyListings key={property._id} property={property} />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};
export default Listings;

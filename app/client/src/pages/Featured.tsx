import { BiHeartCircle } from "react-icons/bi";
import useStore from "../store/store";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { trpc } from "../trpc";
import Property from "../components/Property";

const Featured = () => {
  const store = useStore();
  const user = store.authorizedUser;
  const { darkMode } = store;

  const { data: properties } = trpc.getProperties.useQuery(undefined, {
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
  });

  return (
    <main
      className={`min-h-screen ${
        darkMode ? "bg-[#111111] text-white" : "bg-white text-black"
      } font-normal`}
    >
      <div className="m-auto w-[80%]">
        <h1 className="text-center text-5xl font-bold">Featured offers</h1>
        <div className="py-6">
          {properties?.length === 0 ? (
            <p className="text-center" role="alert"></p>
          ) : (
            <ul className="grid justify-between gap-x-12 gap-y-16 pt-4 sm:grid-cols-[repeat(auto-fit,minmax(200px,200px))] md:grid-cols-[repeat(auto-fit,minmax(252px,252px))]">
              {properties
                ?.filter((property) => user?.featured?.includes(property._id))
                .map((property) => (
                  <Property key={property._id} property={property} />
                ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
};
export default Featured;

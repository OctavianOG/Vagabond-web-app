import { useState } from "react";
import { BiHeartCircle } from "react-icons/bi";
import { toast } from "react-toastify";
import useStore from "../store/store";
import { trpc } from "../trpc";
import Property from "../components/Property";

const Buy = () => {
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

  const store = useStore();
  const { darkMode } = store;
  const [propertyType, setPropertyType] = useState<string | undefined>(
    store.searchParams?.propertyType
  );
  const [propertyState, setPropertyState] = useState<string | undefined>(
    store.searchParams?.propertyState
  );
  const [propertyAddress, setPropertyAddress] = useState<string | undefined>(
    store.searchParams?.propertyAddress
  );

  const [propertyAreaMin, setPropertyAreaMin] = useState<string | undefined>(
    ""
  );
  const [propertyAreaMax, setPropertyAreaMax] = useState<string | undefined>(
    ""
  );
  const [propertyPriceMin, setPropertyPriceMin] = useState<string | undefined>(
    ""
  );
  const [propertyPriceMax, setPropertyPriceMax] = useState<string | undefined>(
    ""
  );
  const [propertyRooms, setPropertyRooms] = useState<string | undefined>("");
  const [propertyFloorMin, setPropertyFloorMin] = useState<string | undefined>(
    ""
  );
  const [propertyFloorMax, setPropertyFloorMax] = useState<string | undefined>(
    ""
  );
  const [filteredProperties, setFilteredProperties] = useState(properties);

  const handleFilterProperties = ({
    properties,
    propertyType,
    propertyState,
    propertyAddress,
    propertyAreaMax,
    propertyAreaMin,
    propertyFloorMax,
    propertyFloorMin,
    propertyPriceMax,
    propertyPriceMin,
    propertyRooms,
  }: {
    properties: unknown[];
    propertyType: string;
    propertyState: string;
    propertyAddress: string;
    propertyAreaMax: string;
    propertyAreaMin: string;
    propertyFloorMax: string;
    propertyFloorMin: string;
    propertyPriceMax: string;
    propertyPriceMin: string;
    propertyRooms: string;
  }) => {
    const filtered = properties.filter((property) => {
      if (propertyType && propertyType !== property.type) {
        return false;
      }
      if (propertyState && propertyState !== property.state) {
        return false;
      }
      if (propertyAddress && !property.address.includes(propertyAddress)) {
        return false;
      }
      if (propertyAreaMin && property.area < Number(propertyAreaMin)) {
        return false;
      }
      if (propertyAreaMax && property.area > Number(propertyAreaMax)) {
        return false;
      }
      if (propertyPriceMin && property.price < Number(propertyPriceMin)) {
        return false;
      }
      if (propertyPriceMax && property.price > Number(propertyPriceMax)) {
        return false;
      }
      if (propertyFloorMin && property.floor < Number(propertyFloorMin)) {
        return false;
      }
      if (propertyFloorMax && property.floor > Number(propertyFloorMax)) {
        return false;
      }
      if (propertyRooms && Number(property.rooms) !== Number(propertyRooms)) {
        return false;
      }

      return true;
    });
    setFilteredProperties(filtered);
  };
  return (
    <main
      className={`min-h-screen  font-normal ${
        darkMode ? "bg-[#111111] text-white" : "bg-white text-black"
      }`}
    >
      <div className="m-auto w-[80%]">
        <h1 className="text-center text-5xl font-bold">Property For Sale</h1>
        <form className="mt-8 space-y-8">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,220px))] justify-between gap-y-8">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              required
              className={` h-10 min-h-[15px] w-[220px] min-w-[125px] rounded-3xl px-4 ${
                darkMode
                  ? "bg-white text-[#111111] required:invalid:text-[#111111]"
                  : "bg-black text-white required:invalid:text-gray-500"
              } outline-none `}
            >
              <option
                className={`${darkMode ? "text-[#111111]" : "text-white"}`}
                hidden
                disabled
                value=""
              >
                Property type
              </option>
              <option
                className={`${darkMode ? "text-[#111111]" : "text-white"}`}
                value="house"
              >
                House
              </option>
              <option
                className={`${darkMode ? "text-[#111111]" : "text-white"}`}
                value="apartment"
              >
                Apartment
              </option>
              <option
                className={`${darkMode ? "text-[#111111]" : "text-white"}`}
                value="townhouse"
              >
                Townhouse
              </option>
            </select>
            <select
              value={propertyState}
              onChange={(e) => setPropertyState(e.target.value)}
              required
              className={` h-10 min-h-[15px] w-[220px] min-w-[125px] rounded-3xl px-4 ${
                darkMode
                  ? "bg-white text-[#111111] required:invalid:text-[#111111]"
                  : "bg-black text-white required:invalid:text-gray-500"
              } outline-none `}
            >
              <option
                className={`${darkMode ? "text-[#111111]" : "text-white"}`}
                hidden
                disabled
                value=""
              >
                Property state
              </option>
              <option
                className={`${darkMode ? "text-[#111111]" : "text-white"}`}
                value="new"
              >
                New building
              </option>
              <option
                className={`${darkMode ? "text-[#111111]" : "text-white"}`}
                value="secondary"
              >
                Secondary building
              </option>
            </select>
            <input
              value={propertyAddress}
              onChange={(e) => {
                setPropertyAddress(e.target.value);
              }}
              placeholder="Enter an address"
              required
              className={`h-10 min-h-[15px] w-[220px] min-w-[125px] rounded-3xl px-4 ${
                darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
              } outline-none`}
              type="text"
            />
            <div
              className={`h-10 min-h-[15px] w-[220px] rounded-3xl px-4 ${
                darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
              }`}
            >
              <div className="flex justify-between">
                <p className="my-auto">Area</p>
                <input
                  value={propertyAreaMin}
                  onChange={(e) => setPropertyAreaMin(e.target.value)}
                  placeholder="0"
                  required
                  className={` h-10 w-4 bg-transparent ${
                    darkMode ? "text-[#111111]" : "text-white"
                  } outline-none`}
                  type="number"
                />
                <p className="my-auto">m&sup2;</p>
                <p className="my-auto">—</p>
                <input
                  value={propertyAreaMax}
                  onChange={(e) => setPropertyAreaMax(e.target.value)}
                  placeholder="999"
                  required
                  className={` h-10 w-8 bg-transparent ${
                    darkMode ? "text-[#111111]" : "text-white"
                  } outline-none`}
                  type="number"
                />
                <p className="my-auto">m&sup2;</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,220px))] justify-between gap-y-8">
            <div
              className={`col-span-2 h-10 min-h-[15px] rounded-3xl px-4 ${
                darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
              }`}
            >
              <div className="flex justify-between">
                <p className="my-auto">Price</p>
                <p className="my-auto">min:</p>
                <input
                  value={propertyPriceMin}
                  onChange={(e) => setPropertyPriceMin(e.target.value)}
                  placeholder="0"
                  required
                  className={` h-10 w-12 bg-transparent ${
                    darkMode ? "text-[#111111]" : "text-white"
                  } outline-none`}
                  type="number"
                />
                <p className="my-auto">$</p>
                <p className="my-auto">—</p>
                <p className="my-auto">max:</p>
                <input
                  value={propertyPriceMax}
                  onChange={(e) => setPropertyPriceMax(e.target.value)}
                  placeholder="100 000 000"
                  required
                  className={` h-10 w-24 bg-transparent ${
                    darkMode ? "text-[#111111]" : "text-white"
                  } outline-none`}
                  type="number"
                />
                <p className="my-auto">$</p>
              </div>
            </div>
            <div
              className={` flex h-10 min-h-[15px] w-[220px] min-w-[125px] justify-between rounded-3xl px-4 outline-none ${
                darkMode
                  ? "bg-white text-[#111111] required:invalid:text-[#111111]"
                  : "bg-black  text-white required:invalid:text-gray-500"
              }`}
            >
              <p className="my-auto">Rooms</p>
              <input
                placeholder="0"
                value={propertyRooms}
                onChange={(e) => setPropertyRooms(e.target.value)}
                required
                type="number"
                className={`h-10 min-h-[15px] w-48 min-w-[125px] rounded-3xl px-4 text-center outline-none ${
                  darkMode
                    ? "bg-white text-[#111111] required:invalid:text-[#111111]"
                    : "bg-black text-white required:invalid:text-gray-500"
                }`}
              />
            </div>
            <div
              className={`h-10 min-h-[15px] w-[220px] rounded-3xl px-4 ${
                darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
              }`}
            >
              <div className="flex justify-between">
                <p className="my-auto">Floor</p>
                <p className="my-auto">min:</p>
                <input
                  value={propertyFloorMin}
                  onChange={(e) => setPropertyFloorMin(e.target.value)}
                  placeholder="0"
                  required
                  className={` h-10 w-4 bg-transparent ${
                    darkMode ? "text-[#111111]" : "text-white"
                  } outline-none`}
                  type="number"
                />

                <p className="my-auto">—</p>
                <p className="my-auto">max:</p>
                <input
                  value={propertyFloorMax}
                  onChange={(e) => setPropertyFloorMax(e.target.value)}
                  placeholder="99"
                  required
                  className={` h-10 w-6 bg-transparent ${
                    darkMode ? "text-[#111111]" : "text-white"
                  } outline-none`}
                  type="number"
                />
              </div>
            </div>
          </div>
          <div className="m-auto flex h-10 w-fit space-x-4">
            <button
              className="m-auto h-10 min-h-[15px] w-64 min-w-[55px] rounded-3xl bg-[#CAFC01] text-[#111111] outline-none"
              onClick={(e) => {
                e.preventDefault();
                handleFilterProperties({
                  properties,
                  propertyType,
                  propertyState,
                  propertyAddress,
                  propertyAreaMax,
                  propertyAreaMin,
                  propertyFloorMax,
                  propertyFloorMin,
                  propertyPriceMax,
                  propertyPriceMin,
                  propertyRooms,
                });
              }}
            >
              Search
            </button>
            <button
              className="m-auto h-10 min-h-[15px] w-64 min-w-[55px] rounded-3xl bg-blue-500 text-[#111111] outline-none"
              onClick={(e) => {
                e.preventDefault();
                setPropertyType("");
                setPropertyState("");
                setPropertyAddress("");
                setPropertyAreaMax("");
                setPropertyAreaMin("");
                setPropertyFloorMax("");
                setPropertyFloorMin("");
                setPropertyPriceMax("");
                setPropertyPriceMin("");
                setPropertyRooms("");
                handleFilterProperties({
                  properties,
                  propertyType: "",
                  propertyState: "",
                  propertyAddress: "",
                  propertyAreaMax: "",
                  propertyAreaMin: "",
                  propertyFloorMax: "",
                  propertyFloorMin: "",
                  propertyPriceMax: "",
                  propertyPriceMin: "",
                  propertyRooms: "",
                });
              }}
            >
              Reset
            </button>
          </div>
        </form>
        <div className="mt-4 grid justify-between md:grid-cols-[repeat(auto-fit,minmax(260px,260px))] xl:grid-cols-[repeat(auto-fit,minmax(336px,336px))]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d342336.0789987482!2d33.03688720238609!3d47.907350174256464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40dadfe03154ab7b%3A0xb0fa3a177d6b186e!2z0JrRgNC40LLQvtC5INCg0L7Qsywg0JTQvdC10L_RgNC-0L_QtdGC0YDQvtCy0YHQutCw0Y8g0L7QsdC70LDRgdGC0YwsIDUwMDAw!5e0!3m2!1sru!2sua!4v1685975068189!5m2!1sru!2sua"
            height="800"
            className="w-full rounded-3xl border-0 lg:col-span-2"
            loading="lazy"
          ></iframe>
          {properties?.length === 0 ? (
            <p className="text-center" role="alert"></p>
          ) : (
            <ul className="grid h-[800px] max-h-screen max-w-full grid-cols-[repeat(auto-fit,minmax(252px,252px))] justify-end gap-x-12 gap-y-16 scrollbar-thin lg:overflow-y-auto">
              {filteredProperties
                ? filteredProperties.map((property) => (
                    <Property key={property._id} property={property} />
                  ))
                : properties?.map((property) => (
                    <Property key={property._id} property={property} />
                  ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
};
export default Buy;

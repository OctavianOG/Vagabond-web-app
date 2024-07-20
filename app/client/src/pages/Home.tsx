import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { trpc } from "../trpc";
import useStore from "../store/store";
import Property from "../components/Property";
import Accordion from "../components/Accordion";

const Home = () => {
  const [propertyType, setPropertyType] = useState<string>("");
  const [propertyState, setPropertyState] = useState<string>("");
  const [propertyAddress, setPropertyAddress] = useState<string>("");

  const store = useStore();
  const { darkMode } = store;
  const handleSetSearchParams = ({
    propertyType,
    propertyState,
    propertyAddress,
  }: {
    propertyType: string;
    propertyState: string;
    propertyAddress: string;
  }) => {
    store.setSearchParams({ propertyType, propertyState, propertyAddress });
  };

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
        darkMode ? "bg-[#111111]" : "bg-white"
      } font-normal`}
    >
      <div
        className={`m-auto w-[80%] ${
          darkMode ? "text-[#FFFFFF]" : "text-black"
        }`}
      >
        <h1 className="text-center text-5xl font-bold">
          FIND YOUR MODERN AFFORDABLE HOME
        </h1>
        <form className="mt-8 grid justify-between sm:grid-cols-[repeat(auto-fit,minmax(200px,200px))] md:grid-cols-[repeat(auto-fit,minmax(252px,252px))]">
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            required
            className={`m-auto h-10 min-h-[15px] w-52 min-w-[125px] rounded-3xl ${
              darkMode
                ? "bg-white text-[#111111] required:invalid:text-[#111111]"
                : "bg-black text-white required:invalid:text-gray-500"
            } pl-4  outline-none `}
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
            className={`m-auto h-10 min-h-[15px] w-52 min-w-[125px] rounded-3xl ${
              darkMode
                ? "bg-white text-[#111111] required:invalid:text-[#111111]"
                : "bg-black text-white required:invalid:text-gray-500"
            }  pl-4  outline-none `}
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
            placeholder="Enter an address"
            value={propertyAddress}
            onChange={(e) => {
              setPropertyAddress(e.target.value);
            }}
            required
            className={`m-auto h-10 min-h-[15px] w-52 min-w-[125px] rounded-3xl ${
              darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
            } pl-4 outline-none`}
            type="text"
          />
          <button
            className={`m-auto h-10 min-h-[15px] w-32 min-w-[55px] rounded-3xl bg-[#CAFC01] 
              text-[#111111] outline-none`}
            onClick={() => {
              handleSetSearchParams({
                propertyType,
                propertyState,
                propertyAddress,
              });
            }}
          >
            <Link to="/properties/search">Search</Link>
          </button>
        </form>
        <div className="relative">
          <ul className="absolute left-12 top-[20%] grid grid-cols-3 gap-x-6 text-2xl">
            <li>1.2M+</li>
            <li>320K+</li>
            <li>635K+</li>
            <li>Offers available</li>
            <li>Happy customers</li>
            <li>Users</li>
          </ul>
          <img
            className="pointer-events-none rounded-br-[300px]"
            src="/images/background.png"
            loading="lazy"
          />
        </div>
        <div className="py-6">
          <h1 className="text-4xl font-semibold">RECOMMENDED OFFERS</h1>
          {properties?.length === 0 ? (
            <p className="text-center" role="alert"></p>
          ) : (
            <ul className="grid justify-between gap-x-12 gap-y-16 pt-4 sm:grid-cols-[repeat(auto-fit,minmax(200px,200px))] md:grid-cols-[repeat(auto-fit,minmax(252px,252px))]">
              {properties?.map((property) => (
                <Property key={property._id} property={property} />
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-center">
          <button
            className={`h-10 w-32 rounded-3xl  ${
              darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
            }`}
          >
            See More
          </button>
        </div>
        <div className="m-auto mt-8">
          <h1 className="py-8 text-4xl font-semibold">STEPS TO BUY PROPERTY</h1>
          <div className="grid w-full grid-cols-2">
            <img
              className="rounded-tr-[200px]"
              src="/images/hobi-industri-AHwOPKDR8G0-unsplash.jpg"
              alt="building"
            />
            <div className="grid grid-cols-2">
              <div className="justify-self-center">
                <div
                  className={`h-8 w-8 rounded-full border-2  ${
                    darkMode
                      ? "border-[#111111] outline-white"
                      : "border-white outline-black"
                  } bg-[#CAFC01] outline outline-2`}
                ></div>
                <hr
                  className={`ml-4 h-1/4 w-px ${
                    darkMode ? "bg-white text-white" : "bg-black text-black"
                  }`}
                />
                <div
                  className={`h-8 w-8 rounded-full border-2  ${
                    darkMode
                      ? "border-[#111111] outline-white"
                      : "border-white outline-black"
                  } bg-[#CAFC01] outline outline-2`}
                ></div>
                <hr
                  className={`ml-4 h-1/4 w-px ${
                    darkMode ? "bg-white text-white" : "bg-black text-black"
                  }`}
                />
                <div
                  className={`h-8 w-8 rounded-full border-2  ${
                    darkMode
                      ? "border-[#111111] outline-white"
                      : "border-white outline-black"
                  } bg-[#CAFC01] outline outline-2`}
                ></div>
                <hr
                  className={`ml-4 h-1/4 w-px ${
                    darkMode ? "bg-white text-white" : "bg-black text-black"
                  }`}
                />
                <div
                  className={`h-8 w-8 rounded-full border-2  ${
                    darkMode
                      ? "border-[#111111] outline-white"
                      : "border-white outline-black"
                  } bg-[#CAFC01] outline outline-2`}
                ></div>
              </div>
              <div className="2xl:space-y-20">
                <h1 className="sm:text-2xl md:text-4xl">Find an offer</h1>
                <p className="sm:text-lg md:text-xl">
                  There are list of beautiful and comfortable houses to view,
                  with various types of houses for your comfort, check out all
                  the houses of your choice.
                </p>
                <h1 className="sm:text-2xl md:text-4xl">Contact seller</h1>
                <p className="sm:text-lg md:text-xl">
                  After you have seen the house of your comfort ,you can contact
                  the seller. They are always available to contact.
                </p>
                <h1 className="sm:text-2xl md:text-4xl">Request a visit</h1>
                <p className="sm:text-lg md:text-xl">
                  You could ask a seller to pay a visit to the home of your
                  choice, with the help the seller-man you can do so and get a
                  reality view of your home.
                </p>
                <h1 className="sm:text-2xl md:text-4xl">Make a purchase</h1>
                <p className="sm:text-lg md:text-xl">
                  After you have visited the house of your dreams, and it
                  completely satisfied your requirements and wishes - draw up
                  sales contracts.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="m-auto py-8">
          <h1 className="text-center text-4xl font-semibold">BLOG</h1>
          <div className="grid justify-between overflow-hidden rounded-[75px] sm:grid-cols-[repeat(auto-fit,minmax(150px,150px))] md:grid-cols-[repeat(auto-fit,minmax(240px,240px))]">
            <div>
              <div className="flex sm:h-[120px] sm:w-[150px] md:h-[195px] md:w-[240px]">
                <img
                  className=" object-cover"
                  src="/images/Agent.png"
                  alt="Agent picture"
                />
              </div>
              <div
                className={`h-[100px] ${
                  darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
                } text-center`}
              >
                <h1 className="font-bold">Olexiy Kravchenko</h1>
                <p>Real estate expert, practising attorney</p>
              </div>
            </div>
            <div>
              <div className="flex sm:h-[120px] sm:w-[150px] md:h-[195px] md:w-[240px]">
                <img
                  className=" object-cover"
                  src="/images/blog1.png"
                  alt="Agent picture"
                />
              </div>
              <div
                className={`h-[100px] ${
                  darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
                } text-center`}
              >
                <p>Buying and selling secondary housing</p>
                <button
                  className={`h-6 w-[75px] rounded-3xl border-2 border-solid ${
                    darkMode ? "border-black" : "border-white"
                  }`}
                >
                  Read
                </button>
              </div>
            </div>
            <div>
              <div className="flex sm:h-[120px] sm:w-[150px] md:h-[195px] md:w-[240px]">
                <img
                  className="object-cover"
                  src="/images/blog2.png"
                  alt="Agent picture"
                />
              </div>
              <div
                className={`h-[100px] ${
                  darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
                } text-center`}
              >
                <p>What is important to know about primary housing</p>
                <button
                  className={`h-6 w-[75px] rounded-3xl border-2 border-solid ${
                    darkMode ? "border-black" : "border-white"
                  }`}
                >
                  Read
                </button>
              </div>
            </div>
            <div>
              <div className="flex sm:h-[120px] sm:w-[150px] md:h-[195px] md:w-[240px]">
                <img
                  className=" object-cover"
                  src="/images/blog3.png"
                  alt="Agent picture"
                />
              </div>
              <div
                className={`h-[100px] ${
                  darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
                } text-center`}
              >
                <p className="h-12">How to avoid rental fraud</p>
                <button
                  className={`mt-auto h-6 w-[75px] rounded-3xl border-2 border-solid ${
                    darkMode ? "border-black" : "border-white"
                  }`}
                >
                  Read
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-10 py-4">
          <h1 className="text-center text-4xl font-semibold">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <Accordion
            title="Can I list my property on multiple real-estate marketplaces at the same time?"
            content="Yes, it is possible to list your property on multiple real-estate
            marketplaces at the same time, although it is important to keep
            track of the listings to avoid double bookings or other
            complications."
          />
          <Accordion
            title="Can I negotiate the price of a property listed on a real-estate marketplace?"
            content="Yes, it is often possible to negotiate the price of a property listed on a real-estate marketplace. However, it is important to approach negotiations respectfully and with a clear understanding of the seller's expectations."
          />
          <Accordion
            title="How much does it cost to use this platform?"
            content="Our platform is free to use for buyers and renters. Sellers and landlords pay a small fee to list their properties and access our range of premium tools and resources."
          />
          <Accordion
            title="How do I get in touch with sellers or landlords about a property I'm interested in?"
            content="You can contact sellers or landlords directly through our messaging system, which allows you to ask questions and arrange viewings. We also offer a range of tools and resources to help you negotiate with sellers and landlords and make informed decisions about properties."
          />
          <Accordion
            title="What happens if there is a problem with a property I purchase or rent through this platform?"
            content="We offer a range of protections and guarantees to ensure that buyers and renters are satisfied with their purchases and rentals. If you encounter any issues with a property, our customer support team is available to help you resolve the issue and ensure a positive outcome."
          />
        </div>
      </div>
    </main>
  );
};

const memorizedHome = memo(Home);
export default memorizedHome;

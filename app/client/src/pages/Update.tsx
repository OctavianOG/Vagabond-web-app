import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { FC, useEffect } from "react";
import { object, string, TypeOf, number, array } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { AiOutlineUpload } from "react-icons/ai";
import FileUpload from "../components/FileUpload";
import useStore from "../store/store";
import { trpc } from "../trpc";
import { useState } from "react";
import { TRPCError } from "@trpc/server";
import { useNavigate, useParams } from "react-router-dom";

const updatePropertySchema = object({
  type: string().optional(),
  state: string().optional(),
  price: string().optional(),
  address: string().optional(),
  area: string().optional(),
  rooms: string().optional(),
  floor: string().optional(),
  images: array(string()).optional(),
  info: string().optional(),
});

type UpdatePropertyInput = TypeOf<typeof updatePropertySchema>;

const Update: FC = () => {
  const store = useStore();
  const [images, setImages] = useState<string[]>([]);
  const { darkMode } = store;

  const setImagesArray = (newImages: string | string[]) => {
    if (Array.isArray(newImages)) {
      setImages(newImages);
    } else {
      setImages([newImages]);
    }
  };

  const navigate = useNavigate();

  const { propertyId } = useParams<{ propertyId: string }>();

  if (!propertyId) {
    return null;
  }

  const { data: property } = trpc.getProperty.useQuery(
    { propertyId },
    {
      select: (data) => data.data.property,
      retry: 1,
      onSuccess: (data) => {
        console.log("Fetched property successfully");
      },
      onError: (error) => {
        toast.error(error.message, {
          position: "top-right",
        });
      },
    }
  );

  const queryClient = useQueryClient();
  const { mutate: updateProperty } = trpc.updateProperty.useMutation({
    onSuccess: (data) => {
      queryClient.refetchQueries(["getProperties"]);
      toast.success("Property updated Successfully", {
        position: "top-right",
      });
    },
    onError: (error) => {
      throw new TRPCError({
        code: "CONFLICT",
        message: error.message,
      });
    },
  });

  const validateInput = useForm<UpdatePropertyInput>({
    resolver: zodResolver(updatePropertySchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = validateInput;

  useEffect(() => {
    if (isSubmitSuccessful) {
      navigate(`/properties/${property?._id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<UpdatePropertyInput> = async (data) => {
    updateProperty({ body: { ...data, images }, params: { propertyId } });
  };

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
        <h1 className="text-center text-5xl font-bold">Sell your property</h1>
        <FormProvider {...validateInput}>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(500px,500px))] justify-between gap-y-8"
          >
            <div className="space-y-8">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(208px,208px))] justify-between gap-y-8">
                <select
                  {...register("type")}
                  defaultValue={property?.type}
                  required
                  className={`h-10 min-h-[15px] w-52 min-w-[125px] rounded-3xl px-4 outline-none ${
                    darkMode
                      ? "bg-white text-[#111111] required:invalid:text-[#111111]"
                      : "bg-black text-white required:invalid:text-gray-500"
                  }`}
                >
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
                  {...register("state")}
                  defaultValue={property?.state}
                  required
                  className={`h-10 min-h-[15px] w-52 min-w-[125px] rounded-3xl px-4 outline-none ${
                    darkMode
                      ? "bg-white text-[#111111] required:invalid:text-[#111111]"
                      : "bg-black text-white required:invalid:text-gray-500"
                  }`}
                >
                  <option
                    className={`${darkMode ? "text-[#111111]" : "text-white"}`}
                    value="new"
                  >
                    New house
                  </option>
                  <option
                    className={`${darkMode ? "text-[#111111]" : "text-white"}`}
                    value="secondary"
                  >
                    Secondary house
                  </option>
                </select>
                <div
                  className={`flex justify-between rounded-3xl px-4 ${
                    darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
                  }`}
                >
                  <p className="my-auto">Price</p>
                  <input
                    {...register("price")}
                    defaultValue={property?.price}
                    placeholder="0"
                    required
                    className={`h-10 w-14 bg-transparent ${
                      darkMode ? "text-[#111111]" : "text-white"
                    } outline-none`}
                    type="number"
                  />
                  <p className="my-auto">$</p>
                </div>
                <div
                  className={`h-10 min-h-[15px] w-[208px] rounded-3xl px-4 ${
                    darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
                  }`}
                >
                  <div className="flex justify-between">
                    <p className="my-auto">Area</p>
                    <input
                      {...register("area")}
                      defaultValue={property?.area}
                      placeholder="0"
                      required
                      className={`h-10 w-8 bg-transparent ${
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
                  <input
                    {...register("address")}
                    defaultValue={property?.address}
                    placeholder="Enter an address"
                    required
                    className={`h-10 min-h-[15px] w-full min-w-[125px] rounded-3xl px-4 ${
                      darkMode
                        ? "bg-white text-[#111111]"
                        : "bg-black text-white"
                    } outline-none`}
                    type="text"
                  />
                </div>
                <div
                  className={`flex h-10 min-h-[15px] w-[220px] justify-between rounded-3xl px-4 ${
                    darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
                  }`}
                >
                  <label className="my-auto" htmlFor="rooms">
                    Rooms
                  </label>
                  <input
                    {...register("rooms")}
                    defaultValue={property?.rooms}
                    placeholder="0"
                    type="number"
                    required
                    className={`h-10 w-8 bg-transparent ${
                      darkMode ? "text-[#111111]" : "text-white"
                    } outline-none`}
                  />
                </div>
                <div
                  className={`h-10 min-h-[15px] w-[220px] rounded-3xl px-4 ${
                    darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
                  }`}
                >
                  <div className="flex justify-between">
                    <p className="my-auto">Floor</p>
                    <input
                      {...register("floor")}
                      defaultValue={property?.floor}
                      placeholder="0"
                      required
                      className={`h-10 w-8 bg-transparent ${
                        darkMode ? "text-[#111111]" : "text-white"
                      } outline-none`}
                      type="number"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <textarea
                {...register("info")}
                defaultValue={property?.info}
                placeholder="Additional description"
                className={`h-full min-w-full rounded-3xl p-2 ${
                  darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
                } outline-none`}
              />
            </div>
            <div className="col-span-2 ">
              <div className="grid justify-between gap-y-1 overflow-hidden rounded-[50px] sm:grid-cols-[repeat(auto-fit,minmax(200px,200px))] xl:grid-cols-[repeat(auto-fit,minmax(250px,250px))]">
                {property?.images.map((img) => (
                  <img
                    src={img}
                    alt="House interior preview"
                    className="object-cover sm:h-[200px] sm:w-[200px] xl:h-[250px] xl:w-[250px]"
                  />
                ))}
              </div>
              <FileUpload
                maxUploads={12}
                imgSize={250}
                setImagesForm={setImagesArray}
              />
              <button
                type="submit"
                onClick={() => console.log(errors, images)}
                className="m-auto flex h-10 w-1/4 items-center justify-between rounded-[100px] bg-[#CAFC01] px-4 text-[#111111]"
              >
                Save and upload
                <AiOutlineUpload size={25} />
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </main>
  );
};

export default Update;

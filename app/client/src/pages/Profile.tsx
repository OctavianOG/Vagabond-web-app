import { AiOutlineUpload } from "react-icons/ai";
import FileUpload from "../components/FileUpload";
import { FC, useState } from "react";
import useStore from "../store/store";
import { UserInterface } from "../libs/types";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { object, string, TypeOf } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../trpc";
import { zodResolver } from "@hookform/resolvers/zod";

const updateUserSchema = object({
  password: string()
    .trim()
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters")
    .optional(),
  passwordConfirm: string().trim().optional(),
  name: string().trim().optional(),
  surname: string().trim().optional(),
  phonenumber: string()
    .length(13, "Phone number must be 12 digits only")
    .regex(/^[\d+]+$/, {
      message: "Only plus at the beginning and numbers are allowed",
    })
    .optional(),
  info: string()
    .max(500, "Info must be less than or equal to 500 characters")
    .optional(),
  profilepic: string().optional(),
  featured: string().array().optional(),
});

type UpdateUserInput = TypeOf<typeof updateUserSchema>;

const Profile: FC = () => {
  const store = useStore();
  const user = store.authorizedUser;
  const queryClient = useQueryClient();
  const [image, setImage] = useState<string[]>([
    user?.profilepic ? user?.profilepic : "",
  ]);
  const [profilepic, setProfilepic] = useState<string[]>([]);

  const { darkMode } = store;

  const { mutate: updateUser } = trpc.updateUser.useMutation({
    onSuccess: (data) => {
      toast("User updated successfully", {
        type: "success",
        position: "top-right",
      });
    },
    onError(error) {
      toast(error.message, {
        type: "error",
        position: "top-right",
      });
    },
  });

  const validateInput = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = validateInput;

  const onSubmitHandler: SubmitHandler<UpdateUserInput> = async (data) => {
    updateUser({
      body: { data },
      userParams: { email: user?.email },
    });
  };

  return (
    <main
      className={`min-h-screen ${
        darkMode ? "bg-[#111111]" : "bg-white"
      } font-normal`}
    >
      <div className="m-auto w-[80%] text-[#FFFFFF]">
        <h1 className="text-center text-5xl font-bold">My Profile</h1>
        <FormProvider {...validateInput}>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="mt-8 grid justify-center sm:grid-cols-[repeat(auto-fit,minmax(200px,200px))] lg:grid-cols-[repeat(auto-fit,minmax(500px,500px))] lg:gap-x-2 lg:gap-y-8"
          >
            <div
              className={`h-full rounded-3xl border-2 border-solid ${
                darkMode ? "border-white" : "border-black"
              }`}
            >
              <textarea
                className="hidden"
                {...register("profilepic")}
                value={profilepic[0]}
              />
              <FileUpload
                maxUploads={1}
                imgSize={500}
                setImagesForm={setProfilepic}
                presetImage={image[0]}
              />
            </div>
            <div className="space-y-8">
              <div className="grid justify-between gap-y-8 sm:grid-cols-[repeat(auto-fit,minmax(200px,200px))] lg:grid-cols-[repeat(auto-fit,minmax(240px,240px))]">
                <div
                  className={`h-10 min-h-[15px] rounded-3xl px-4 ${
                    darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
                  } sm:w-[200px] lg:w-[240px]`}
                >
                  <div className="flex justify-between">
                    <p className="my-auto w-1/4">Name:</p>
                    <input
                      {...register("name")}
                      placeholder="Olexiy"
                      defaultValue={user?.name}
                      required
                      className={`h-10 w-3/4 bg-transparent ${
                        darkMode ? "text-[#111111]" : "text-white"
                      } outline-none`}
                      type="text"
                    />
                  </div>
                </div>
                <div
                  className={`h-10 min-h-[15px] rounded-3xl px-4 ${
                    darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
                  } sm:w-[200px] lg:w-[240px]`}
                >
                  <div className="flex justify-between">
                    <p className="my-auto w-1/4">Phone:</p>
                    <input
                      {...register("phonenumber")}
                      placeholder="+380-12-345-67-89"
                      defaultValue={user?.phonenumber}
                      required
                      className={` h-10 w-3/4 bg-transparent ${
                        darkMode ? "text-[#111111]" : "text-white"
                      } outline-none`}
                      type="text"
                    />
                  </div>
                </div>
                <div
                  className={`h-10 min-h-[15px] rounded-3xl px-4 ${
                    darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
                  } sm:w-[200px] lg:w-[240px]`}
                >
                  <div className="flex justify-between">
                    <p className="my-auto w-1/3">Surname:</p>
                    <input
                      {...register("surname")}
                      placeholder="Kravchenko"
                      defaultValue={user?.surname}
                      required
                      className={` h-10 w-2/3 bg-transparent ${
                        darkMode ? "text-[#111111]" : "text-white"
                      } outline-none`}
                      type="text"
                    />
                  </div>
                </div>
                <div
                  className={`h-10 min-h-[15px] rounded-3xl px-4 ${
                    darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
                  } sm:w-[200px] lg:w-[240px]`}
                >
                  <div className="flex h-10 justify-between">
                    <p className="my-auto w-1/4">Email: </p>
                    <p className="my-auto w-3/4 text-[#111111] outline-none">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,240px))] justify-between gap-y-8">
                <div
                  className={`h-10 min-h-[15px] rounded-3xl px-4 ${
                    darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
                  } sm:w-[200px] lg:w-[240px]`}
                >
                  <div className="flex justify-between">
                    <p className="my-auto w-3/5">New password:</p>
                    <input
                      {...register("password")}
                      required
                      className={`h-10 w-2/5 ${
                        darkMode ? "text-[#111111]" : "text-white"
                      } bg-transparent outline-none`}
                      type="password"
                    />
                  </div>
                </div>
                <div
                  className={`h-10 min-h-[15px] rounded-3xl px-4 ${
                    darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
                  } sm:w-[200px] lg:w-[240px]`}
                >
                  <div className="flex justify-between">
                    <p className="my-auto w-4/5">Confirm new password:</p>
                    <input
                      {...register("passwordConfirm")}
                      required
                      className={` h-10 w-1/5 ${
                        darkMode ? "text-[#111111]" : "text-white"
                      } bg-transparent outline-none`}
                      type="password"
                    />
                  </div>
                </div>
              </div>
              <div>
                <textarea
                  {...register("info")}
                  placeholder="Additional info about user"
                  className={`h-[400px] w-full rounded-3xl p-2 ${
                    darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
                  } outline-none`}
                />
              </div>
            </div>
            <button
              type="submit"
              onClick={() => console.log(profilepic, errors)}
              className={` col-span-2 m-auto flex h-10 w-1/4 items-center justify-between rounded-3xl bg-[#CAFC01] px-4 text-[#111111]`}
            >
              Save and upload
              <AiOutlineUpload size={25} />
            </button>
          </form>
        </FormProvider>
      </div>
    </main>
  );
};
export default Profile;

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import InputForm from "../components/InputForm";
import { toast } from "react-toastify";
import { trpc } from "../trpc";
import useStore from "../store/store";

const registerSchema = object({
  email: string({ required_error: "Email is required" })
    .email("Invalid email")
    .trim()
    .toLowerCase(),
  password: string({ required_error: "Password is required" })
    .trim()
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  passwordConfirm: string({
    required_error: "Please, confirm your password",
  }).trim(),
  name: string({ required_error: "Name is required" }).trim(),
  surname: string({ required_error: "Surname is required" }).trim(),
  phonenumber: string({ required_error: "Phone number is required" })
    .length(13, "Phone number must be 12 digits only")
    .regex(/^[\d+]+$/, {
      message: "Only plus at the beginning and numbers are allowed",
    }),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "Passwords don't match",
});

export type RegisterInput = TypeOf<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { darkMode } = useStore();

  const { mutate: userRegister } = trpc.userRegister.useMutation({
    onSuccess: (data) => {
      toast("Successful registration!", {
        type: "success",
        position: "top-right",
      });
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message, {
        type: "error",
        position: "top-right",
      });
    },
  });

  const validateInput = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = validateInput;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<RegisterInput> = (values) => {
    userRegister(values);
  };

  return (
    <section
      className={`h-screen ${darkMode ? "bg-[#111111]" : "bg-white"} py-8`}
    >
      <div
        className={`m-auto w-[60%] space-y-4 rounded-3xl ${
          darkMode ? "bg-white" : "bg-[#111111]"
        } p-4`}
      >
        <h1
          className={`text-center text-4xl font-bold ${
            darkMode ? "text-black" : "text-white"
          }`}
        >
          Account registration
        </h1>
        <FormProvider {...validateInput}>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="m-auto w-full space-y-4 bg-transparent text-2xl"
          >
            <InputForm
              label="Email:"
              name="email"
              type="email"
              placeholder="Emailexample@gmail.com"
            />
            <InputForm
              label="Password"
              name="password"
              type="password"
              placeholder="input password"
            />
            <InputForm
              label="Confirm password"
              name="passwordConfirm"
              type="password"
              placeholder="confirm password"
            />
            <InputForm
              label="Name"
              name="name"
              type="text"
              placeholder="First name"
            />
            <InputForm
              label="Surname"
              name="surname"
              type="text"
              placeholder="Last name"
            />
            <InputForm
              label="Phone Number"
              name="phonenumber"
              type="tel"
              placeholder="+380123456789"
            />
            <span
              className={`m-auto flex justify-center ${
                darkMode ? "text-black" : "text-white"
              }`}
            >
              Already have an account?{" "}
              <p className="px-2 text-[#CAFC01]">
                <Link to="/login">Login</Link>
              </p>
            </span>
            <button
              type="submit"
              className={`m-auto flex w-1/2 justify-center rounded-3xl ${
                darkMode ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              Sign up
            </button>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};
export default Register;

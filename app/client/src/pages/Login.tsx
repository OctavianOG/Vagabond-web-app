import { Link, useLocation, useNavigate } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { trpc } from "../trpc";
import InputForm from "../components/InputForm";
import useStore from "../store/store";

const loginSchema = object({
  email: string({ required_error: "Email is required" })
    .email("Invalid email")
    .trim()
    .toLowerCase(),
  password: string({ required_error: "Password is required" })
    .trim()
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export type LoginInput = TypeOf<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state?.from.pathname as string) || "/";
  const { darkMode } = useStore();

  const { mutate: userLogin } = trpc.userLogin.useMutation({
    onSuccess(data) {
      toast("Successful log in", {
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

  const validateInput = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = validateInput;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      navigate(from);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    userLogin(values);
  };

  return (
    <section
      className={`h-screen ${darkMode ? "bg-[#111111]" : "bg-white"} py-8`}
    >
      <div
        className={`m-auto w-[60%] space-y-4 rounded-3xl ${
          darkMode ? "bg-white" : "bg-black"
        } p-4`}
      >
        <h1
          className={`text-center text-4xl font-bold ${
            darkMode ? "text-black" : "text-white"
          }`}
        >
          Account login
        </h1>
        <FormProvider {...validateInput}>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="m-auto w-full space-y-4 text-2xl"
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
            <span
              className={`m-auto flex justify-center ${
                darkMode ? "bg-white text-[#111111]" : "bg-black text-white"
              }`}
            >
              Don't have an account?{" "}
              <p className="px-2 text-[#CAFC01]">
                <Link to="/register">Sign up</Link>
              </p>
            </span>
            <button
              type="submit"
              className={`m-auto flex w-1/2 justify-center rounded-3xl ${
                darkMode ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              Log in
            </button>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export default Login;

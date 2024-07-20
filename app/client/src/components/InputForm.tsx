import { useFormContext } from "react-hook-form";
import useStore from "../store/store";

type FormProps = {
  label: string;
  name: string;
  type: string;
  placeholder: string;
};

const InputForm: React.FC<FormProps> = ({ label, name, type, placeholder }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { darkMode } = useStore();
  return (
    <div
      className={`m-auto flex w-full justify-between p-4 ${
        darkMode ? "text-black" : "text-white"
      } align-middle`}
    >
      <label
        htmlFor={name}
        className={` ${darkMode ? "text-[#111111]" : "text-white"}`}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className={`w-1/2 bg-transparent ${
          darkMode ? "text-black" : "text-white"
        }`}
        {...register(name)}
      />
      {errors[name] && (
        <span className="m-auto p-2 text-red-600">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
};

export default InputForm;

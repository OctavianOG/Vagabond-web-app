import { trpc } from "../trpc";
import { toast } from "react-toastify";
import { BiHeartCircle } from "react-icons/bi";
import { UserInterface } from "../libs/types";

type actionsProps = {
  propertyId: string;
  user: UserInterface;
};

const PropertyActions = ({ propertyId, user }: actionsProps) => {
  const { mutate: addToFeatured } = trpc.addToFeatured.useMutation({
    onSuccess: (data) => {
      toast("Added to featured successfully", {
        type: "success",
        position: "top-right",
      });
    },
    onError: (error) => {
      toast(error.message, {
        type: "error",
        position: "top-right",
      });
    },
  });

  const handleAddToFeatured = async () => {
    addToFeatured({
      body: { propertyId: propertyId },
      userParams: { email: user?.email },
    });
  };

  return (
    <>
      <button className="m-auto" onClick={handleAddToFeatured}>
        <BiHeartCircle size={40} />
      </button>
    </>
  );
};

export default PropertyActions;

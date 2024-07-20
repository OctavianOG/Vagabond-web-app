import { BiHeartCircle } from "react-icons/bi";
import { PropertyInterface } from "../libs/types";
import { FC } from "react";
import { Link } from "react-router-dom";
import { trpc } from "../trpc";
import { toast } from "react-toastify";
import useStore from "../store/store";

type PropertyProps = {
  property: PropertyInterface;
};

const Property: FC<PropertyProps> = ({ property }) => {
  const store = useStore();
  const user = store.authorizedUser;
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

  const handleAddToFeatured = async (event: React.MouseEvent) => {
    event.preventDefault();
    addToFeatured({
      body: { propertyId: property._id },
      userParams: { email: user?.email },
    });
  };

  return (
    <li className="sm:min-h-[330] sm:w-[200px] md:min-h-[480px] md:w-[252px]">
      <Link to={`/properties/${property._id}`}>
        <img
          className="object-cover sm:h-[250px] sm:w-[200px] md:h-[337px] md:w-[252px]"
          src={property.images[0]}
          alt="apartment preview"
        />
        <div className="h-fit">
          <div className="flex w-full justify-between pt-4">
            <h1 className="my-auto text-xl font-bold">
              {new Intl.NumberFormat("ru-RU").format(property.price)}$
            </h1>
            <BiHeartCircle onClick={handleAddToFeatured} size={30} />
          </div>
          <p className="h-[116px] justify-stretch overflow-hidden py-4 text-xl font-semibold">
            {property.address}
          </p>
          <ul className="flex justify-between">
            <li>{property.rooms} bedrooms</li>
            <li>{property.area} m&sup2;</li>
            <li>{property.floor} floor</li>
          </ul>
        </div>
      </Link>
    </li>
  );
};
export default Property;

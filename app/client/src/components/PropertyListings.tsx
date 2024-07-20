import { LuFileEdit } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";
import { PropertyInterface } from "../libs/types";
import { FC } from "react";
import { Link } from "react-router-dom";
import { trpc } from "../trpc";
import { toast } from "react-toastify";
import useStore from "../store/store";
import { useQueryClient } from "@tanstack/react-query";

type PropertyProps = {
  property: PropertyInterface;
};

const PropertyListings: FC<PropertyProps> = ({ property }) => {
  const store = useStore();
  const user = store.authorizedUser;
  const queryClient = useQueryClient();
  const { mutate: deleteProperty } = trpc.deleteProperty.useMutation({
    onSuccess: (data) => {
      queryClient.refetchQueries([["getPropertiesByAuthor"]]);
      toast("Property deleted successfully", {
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

  const handleDeleteProperty = async (_id: string) => {
    deleteProperty({ propertyId: _id });
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
            <Link to={`/properties/edit/${property._id}`}>
              <LuFileEdit size={30} />
            </Link>
            <FaRegTrashAlt
              onClick={() => handleDeleteProperty(property._id)}
              size={30}
            />
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
export default PropertyListings;

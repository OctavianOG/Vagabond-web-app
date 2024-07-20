import { Roles } from "server/src/model/user.model";
import { PropertyType, PropertyState } from "server/src/model/property.model";

export interface UserInterface {
  _id: string;
  id: string;
  _v: number;
  createdAt: string;
  updatedAt: string;
  email: string;
  name: string;
  surname: string;
  role: Roles;
  phonenumber: string;
  info?: string;
  profilepic?: string;
  featured?: string[];
}

export interface PropertyInterface {
  _id: string;
  type: PropertyType;
  state: PropertyState;
  price: number;
  address: string;
  area: number;
  rooms: number;
  floor: number;
  author: {
    email: string;
    name: string;
    surname: string;
    phonenumber: string;
  };
  images: string[];
  info?: string;
}

export interface SearchParams {
  propertyType: string;
  propertyState: string;
  propertyAddress: string;
}

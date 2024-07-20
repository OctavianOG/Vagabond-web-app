import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

export enum PropertyType {
  HOUSE = "house",
  APARTMENT = "apartment",
  TOWNHOUSE = "townhouse",
}

export enum PropertyState {
  NEW = "new",
  SECONDARY = "secondary",
}

class Author {
  @prop({ required: true })
  public email!: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public surname!: string;

  @prop({ required: true })
  public phonenumber!: string;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Property {
  @prop({ required: true, enum: PropertyType })
  public type!: PropertyType;

  @prop({ required: true, enum: PropertyState })
  public state!: PropertyState;

  @prop({ required: true })
  public price!: string;

  @prop({ required: true })
  public address!: string;

  @prop({ required: true })
  public area!: string;

  @prop({ required: true })
  public rooms!: string;

  @prop({ required: true })
  public floor!: string;

  @prop({ required: true, type: String })
  public images!: string[];

  @prop({ required: true, type: Author })
  public author!: Author;

  @prop({ default: "" })
  public info?: string;
}

const PropertyModel = getModelForClass<typeof Property>(Property);

export default PropertyModel;

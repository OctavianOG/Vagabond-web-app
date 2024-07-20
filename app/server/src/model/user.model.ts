import {
  prop,
  getModelForClass,
  index,
  modelOptions,
  pre,
} from "@typegoose/typegoose";
import bcrypt from "bcrypt";

export enum Roles {
  ADMIN = "admin",
  USER = "user",
}

@index({ email: 1 })
@pre<User>("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class User {
  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true, minlength: 8, maxlength: 32, select: false })
  public password!: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public surname!: string;

  @prop({ required: true, enum: Roles, default: "user" })
  public role!: Roles;

  @prop({ required: true, unique: true })
  public phonenumber!: string;

  @prop({ default: "" })
  public info?: string;

  @prop({ default: "" })
  public profilepic?: string;

  @prop({ type: () => [String] })
  public featured?: string[];

  async comparePasswords(hashedPassword: string, comparingPassword: string) {
    return await bcrypt.compare(comparingPassword, hashedPassword);
  }
}

const UserModel = getModelForClass<typeof User>(User);

export default UserModel;

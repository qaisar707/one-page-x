import e from "express";
export interface ICustomRequest extends e.Request {
  user?: any;
}

export const platForm_enum=["linkedin", "instagram", "facebook"]

export interface IUser{
  access_tokens: typeof platForm_enum
  name:String
  email:String
  id:String
  token:String
}
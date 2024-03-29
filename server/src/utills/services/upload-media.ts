import cloudinary from "./cloudinary-config";

export const fileUpload = async (filePath:string) => {
  try {
    const data = await cloudinary.v2.uploader.upload(filePath);
    return data;
  } catch (error) {
    throw error;
  }
};

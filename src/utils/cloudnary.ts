import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { envConfig } from "../config/config";
 
cloudinary.config({
    cloud_name: envConfig.cloud_name,
    api_key: envConfig.cloud_api_key,
    api_secret: envConfig.cloud_api_secret
})
const uploadOnCloudnary = async (
    localFilePath: string
): Promise<string | null> => {
    try {
        if (!localFilePath || !fs.existsSync(localFilePath)) {
            console.error("File path is invalid or file does not exist.");
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        console.log(
            "file successfully upoloded on the cloudinary",
            response.secure_url
        );

        fs.unlink(localFilePath, (error) => {
            if (error) {
                console.error("Error deleting local file", error);
            }
        });

        return response.secure_url;
    } catch (error) {
        console.log("faild to upload on cloudinary");

        try {
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
        } catch (deleteError) {
            console.error("faild to delete after faild upload", deleteError);
            // Continue execution despite file deletion error
        }
        return null;
    }
};

const getPublicIdsFromUrls = (urls: string[]): string[] => {
  return urls.map((url) => {
    const parts = url.split("/");
    const fileWithExt = parts[parts.length - 1];
    const folder = parts[parts.length - 2];

    const publicId = `${folder}/${fileWithExt.split(".")[0]}`;
    return publicId;
  });
};

export {uploadOnCloudnary, getPublicIdsFromUrls};

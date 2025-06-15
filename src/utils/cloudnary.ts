import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

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

export default uploadOnCloudnary;

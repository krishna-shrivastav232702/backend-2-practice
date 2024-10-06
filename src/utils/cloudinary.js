import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ||'dghcoknbs', 
    api_key: process.env.CLOUDINARY_API_KEY ||'487828635185234',       
    api_secret: process.env.CLOUDINARY_API_SECRET  || 'S-giXxHujTaribJbpO2bOrSxi7U' 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        console.log("Response started to upload");
        
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log(response);
        console.log("File uploaded successfully");

        return response;

    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);

        // Check if the local file exists before trying to delete it
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); // Remove the locally saved temporary file as the upload operation failed
            console.log(`Deleted local file: ${localFilePath}`);
        } else {
            console.warn(`File not found, could not delete: ${localFilePath}`);
        }
        
        return null;
    }
}

export { uploadOnCloudinary };

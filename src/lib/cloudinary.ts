import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import config from '../app/config';

// এখন আর এরর আসবে না
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

export const uploadToCloudinary = async (
  file: any,
  subFolder: 'menu_items' | 'categories' | 'profiles' = 'menu_items'
) => {
  const isVideo = file.mimetype.includes('video');
  const mainFolder = isVideo ? 'videos' : 'images';
  const resourceType = isVideo ? 'video' : 'image';

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `cooking_reina/${mainFolder}/${subFolder}`,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
    });

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw new Error("Cloudinary Upload Failed");
  }
};

export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: 'image' | 'video' = 'image'
) => {
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    throw new Error("Cloudinary Delete Failed");
  }
};
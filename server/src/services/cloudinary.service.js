import cloudinary from "../config/cloudinary.js";

export function uploadBufferToCloudinary(file, organizationId) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `ragify/${organizationId}/documents`,
        resource_type: "raw",
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      },
    );

    uploadStream.end(file.buffer);
  });
}

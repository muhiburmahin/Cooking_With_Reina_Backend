import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  
  // Auth Config
  auth_secret: process.env.BETTER_AUTH_SECRET,
  auth_url: process.env.BETTER_AUTH_URL,
  frontend_url: process.env.FRONTEND_URL,
  
  // Google OAuth
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,

  // Cloudinary Config
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
  },

  // Email Config
  resend_api_key: process.env.RESEND_API_KEY,
  from_email: process.env.FROM_EMAIL,
};
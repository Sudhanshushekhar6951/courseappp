import dotenv from "dotenv";

dotenv.config();

const JWT_USER_PASSWORD=process.env.JWT_USER_PASSWORD
const JWT_ADMIN_PASSWORD=process.env.JWT_ADMIN_PASSWORD
const STRIPE_SECRET_KEY="sk_test_51RhSscFVrMcLl79ygpJfKjRAAr9aBLKa1wATC7t8vGBxLGLOPCWXt6BeKLlV1e0D798u9pNBv64kbLApkTu9kDfv008kWFRY37"

export default {
    JWT_USER_PASSWORD,
    JWT_ADMIN_PASSWORD,
    STRIPE_SECRET_KEY,

}
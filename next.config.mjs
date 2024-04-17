/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [`${process.env.AWS_S3_BUCKET_NAME}.s3.ap-southeast-1.amazonaws.com`],
    }
};

export default nextConfig;


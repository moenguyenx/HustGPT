## Overview
This is a [Next.js](https://nextjs.org/) project called HustGPT.

Could say it base on the idea of ChatGPT with additional feature  like image processing, allowing users to POST Image with Prompt and the server will return proccessed Image.

Frameworks used:
- [Next.js](https://nextjs.org/) - Frontend framework 
- [Python Flask](https://flask.palletsprojects.com/en/3.0.x/) - Backend framework for Chat API and Image Processing engine
- [AWS Bucket S3](https://aws.amazon.com/s3/) - Image Storage 

The project was executed by Nguyen Quang Minh - 20214010, Hanoi University of Science and Technology.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Second, open another Terminal to run the Python backend server:
```bash
# Go to 'backend' directory
cd backend
# Create venv
python -m venv venv
# Activate venv
venv/Scripts/activate
# Install dependencies
pip install -r requirements.txt
# Go back to project directory
cd ..
# Run the server
npm run backend
```


## Learn More

To learn more about Frameworks used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Python Flask Documentation](https://flask.palletsprojects.com/en/3.0.x/) - learn about Flask server and API Routes.
- [AWS Client S3](https://www.npmjs.com/package/@aws-sdk/client-s3) - learn how to handle file upload from Next.js server to AWS Bucket S3.
- [AWS Boto3 SDK](https://pypi.org/project/boto3/) - learn how to handle file upload from Python server to AWS Bucket S3.


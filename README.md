# Daily Connect

Daily Connect with your closed ones with real-time messgage updates!

## Features

- **Real-Time Communication**: Engineered with Socket.io to provide instant chat and message updates.
- **User Authentication**: Secure authentication using JWT.
- **User Search**: API for searching users to chat with.
- **Message Features**: Display the last message and count of unseen messages.
- **Media Sharing**: Send media with captions, securely stored on AWS S3.

## Tech Stack

- **Frontend**: ReactJS, ReduxJS Toolkit
- **Backend**: NodeJS, ExpressJS
- **Database**: MongoDB
- **Real-Time Communication**: Socket.io
- **Cloud Storage**: AWS S3
- **Type Safety**: TypeScript
- **Authentication**: JWT

## Installation

1. Clone the repository
   ```sh
   git clone https://github.com/your-username/daily-connect.git

2. Navigate to the project directory
   ```sh
   cd daily-connect

3. Install Dependencies in client and server folder
    ```sh
    npm i

4. Create a .env file in the server folder with the following fields:
    ```sh
    DB_CONN_STRING=<your-mongodb-connection-string>
    CLIENT_URI=<your-client-uri>
    NODE_ENV="development"
    PORT=3000
    JWT_SECRET_KEY=<your-jwt-secret-key>
    JWT_EXPIRE=7d
    AWS_BUCKET_NAME=<your-aws-bucket-name>
    AWS_BUCKET_REGION=<your-aws-bucket-region>
    AWS_IAM_USER_KEY=<your-aws-iam-user-key>
    AWS_IAM_USER_SECRET=<your-aws-iam-user-secret>

5. Start client and server
    ```sh
    cd client
    npm run dev

    cd server
    npm run dev
Getting Started

1. Install the dependencies - npm i
   
2. Create a .env file with following paramters
      PORT=5000
      MONGO_URI=mongodb://127.0.0.1:27017/auth-system
      SESSION_SECRET=your_session_secret
      JWT_SECRET=your_jwt_secret
      GOOGLE_CLIENT_ID=your_google_client_id
      GOOGLE_CLIENT_SECRET=your_google_client_secret

3. Start the server - npm run start

Url for accessing the swagger docs - http://localhost:<PORT>/api-docs/

# CleanQuote Application

## Setup Instructions

1. **Firebase Setup:**
   The Firebase configuration has been pre-set with the provided values. If you need to use a different Firebase project, update the values in the `.env` file:

   ```
   VITE_FIREBASE_API_KEY=AIzaSyCCD2imem0sWzH9vnARFxKyqWVYuRsHoj0
   VITE_FIREBASE_AUTH_DOMAIN=carenova1-1bd30.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=carenova1-1bd30
   VITE_FIREBASE_STORAGE_BUCKET=carenova1-1bd30.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=74244447027
   VITE_FIREBASE_APP_ID=1:74244447027:web:c256bece28117032ef3c46
   VITE_FIREBASE_MEASUREMENT_ID=G-1JDV0VRTFK
   ```

2. **Install Dependencies:**
   Run `npm install` to install all required dependencies.

3. **Start the Development Server:**
   Run `npm run dev` to start the Vite development server.

4. **Build for Production:**
   When ready to deploy, run `npm run build` to create a production build.

## Troubleshooting

If you encounter any Firebase-related errors:
- Ensure all Firebase configuration values are correctly set in the `.env` file
- Check that your Firebase project is properly set up and the web app is added to the project
- Verify that the Firebase services you're using (Authentication, Analytics) are enabled in your Firebase project settings

For any other issues, please refer to the error messages in the console or contact the development team.
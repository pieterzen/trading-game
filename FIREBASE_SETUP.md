# Firebase Setup Instructions

This application uses Firebase for real-time data synchronization across multiple devices. Follow these steps to set up Firebase for your project:

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Give your project a name (e.g., "Trading Game")
4. Enable Google Analytics if desired (optional)
5. Click "Create project"

## 2. Set Up Realtime Database

1. In the Firebase Console, select your project
2. In the left sidebar, click "Build" > "Realtime Database"
3. Click "Create Database"
4. Choose a location for your database (select the one closest to your users)
5. Start in test mode (we'll secure it later)
6. Click "Enable"

## 3. Register Your Web App

1. In the Firebase Console, click the gear icon next to "Project Overview" and select "Project settings"
2. Scroll down to "Your apps" and click the web icon (</>) to add a web app
3. Give your app a nickname (e.g., "Trading Game Web")
4. Register the app
5. Copy the Firebase configuration object (we'll need this for the next step)

## 4. Configure Your Application

1. Create a `.env.local` file in the root of your project (copy from `.env.local.example`)
2. Fill in the Firebase configuration values from the previous step:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## 5. Secure Your Database (Optional but Recommended for Production)

1. In the Firebase Console, go to "Build" > "Realtime Database"
2. Click the "Rules" tab
3. Update the rules to secure your database. For example:

```json
{
  "rules": {
    ".read": true,  // Anyone can read
    ".write": true  // Anyone can write
  }
}
```

For a more secure setup, you might want to implement authentication and more specific rules.

## 6. Deploy Your Application

1. Run your application with `npm run dev` or `yarn dev`
2. Verify that the Firebase connection is working by checking the browser console for any errors

## Troubleshooting

- If you see errors related to Firebase in the console, double-check your configuration values in `.env.local`
- Make sure your Firebase project has the Realtime Database enabled
- Check that your database rules allow read and write access

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Realtime Database Documentation](https://firebase.google.com/docs/database)
- [Firebase Web SDK Documentation](https://firebase.google.com/docs/web/setup)

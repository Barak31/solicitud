# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Background Image

To set the background image for the form, please follow these steps:

1.  Create a folder named `public` in the root directory of your project if it doesn't already exist.
2.  Place your desired background image inside the `public` folder.
3.  Make sure the image is named `background.png`.

The application is configured to automatically pick up this image and display it as the background on the main page.

## Logo

To set the logo for the form, please follow these steps:

1.  Create a folder named `public` in the root directory of your project if it doesn't already exist.
2.  Place your desired logo image inside the `public` folder.
3.  Make sure the image is named `logo.png`.

The application is configured to automatically pick up this image and display it as the logo on the main page.

## Next Steps: Backend Integration (Firebase)

This project contains a complete frontend application built with Next.js and React. It is pre-configured to connect to a Firebase backend. The form data is collected and currently logged to the server console in `src/app/actions.ts`.

### Instructions for the Backend Developer

Your task is to complete the backend integration using Firebase services. The frontend is already set up with the Firebase JS SDK and configuration.

1.  **Set Up Firebase Services in your Project:**
    *   In your Firebase project console, enable **Cloud Firestore** (to store the form data) and **Cloud Storage for Firebase** (to store uploaded files).
    *   **Crucially, set up your Security Rules** for both Firestore and Storage to allow writes only from authenticated users or from your application's domain to prevent unauthorized access.

2.  **Implement the File Upload and Data Persistence Logic:**
    *   The primary file to modify is `src/app/actions.ts`.
    *   Locate the `submitApplication` function. You will see a `// TODO: Implement Firebase logic here` section.
    *   **File Uploads to Cloud Storage:**
        *   The form data contains `File` objects for all document uploads.
        *   For each file, you need to generate a unique storage path (e.g., `applications/{applicationId}/{fileName}`).
        *   Use the `uploadBytes` function from the Firebase Storage SDK to upload the file.
        *   After uploading, get the `downloadURL` for the file.
        *   You must replace the `File` object in your local data object with this `downloadURL` string before saving it to Firestore.
    *   **Data Saving to Cloud Firestore:**
        *   Once all file objects have been replaced with their corresponding download URLs, save the entire application object to a Firestore collection (e.g., `rental_applications`).
        *   Use the `addDoc` function from the Firestore SDK for this.

3.  **Implement Email Notifications:**
    *   After the data is successfully saved to Firestore, you need to send two emails:
        *   One to the selected agent (`data.agent.email`) with the full application details.
        *   A notification to `info@miscasasrd.com`.
    *   **Recommended Approach:** Use **Firebase Functions** triggered by a new document creation in your `rental_applications` collection. This is a reliable, serverless way to handle sending emails (e.g., using the Nodemailer library or integrating with a service like SendGrid).

## Data Retention and Cleanup

To manage storage costs and data privacy, it is highly recommended to set up automated data cleanup.

*   **For Form Data (Firestore):**
    *   Use **Firestore TTL (Time-to-Live) policies**. When saving a document, add a timestamp field (e.g., `deleteAt`) set to a future date (e.g., 90 days from creation).
    *   In the Firebase Console, configure a TTL policy on that field. Firestore will automatically delete the documents when they expire, at no extra cost.

*   **For Uploaded Files (Cloud Storage):**
    *   Use **Cloud Storage Lifecycle Rules**. In the Firebase Console, you can create a lifecycle rule for your storage bucket.
    *   Set up a rule to automatically delete files after a certain number of days (e.g., 90 days). This will keep your storage from growing indefinitely with old application files.

By following these steps, you can connect this fully-featured frontend to a robust and scalable Firebase backend with automated data management.

## Deployment Instructions (Self-Hosted VPS)

This Next.js application is ready to be deployed on your own Virtual Private Server (VPS). Here are the general steps to get your application live.

### Prerequisites

*   You have a VPS with Node.js and `npm` (or a similar package manager like `yarn` or `pnpm`) installed.
*   You have configured your domain's DNS to point to your VPS IP address.
*   You have a reverse proxy like Nginx or Apache set up to forward requests to the Node.js application port (typically port 3000).
*   You have an SSL certificate installed (e.g., via Let's Encrypt) for HTTPS.

### Steps

1.  **Clone Your Project:**
    Transfer your project files to your VPS, for example using `git clone`.

2.  **Install Dependencies:**
    Navigate to your project's root directory in your VPS terminal and install the necessary packages:
    ```bash
    npm install
    ```

3.  **Build the Application for Production:**
    This command compiles and optimizes your Next.js application for the best performance.
    ```bash
    npm run build
    ```

4.  **Start the Production Server:**
    To run the application, use the `start` command.
    ```bash
    npm run start
    ```
    By default, this will start the server on port 3000.

5.  **Keep the Application Running (Recommended):**
    To ensure your application stays online even if it crashes or the server reboots, it is highly recommended to use a process manager like `pm2`.

    *   Install `pm2` globally:
        ```bash
        npm install pm2 -g
        ```
    *   Start your application with `pm2`:
        ```bash
        pm2 start npm --name "your-app-name" -- start
        ```
    *   You can then use commands like `pm2 list`, `pm2 logs`, and `pm2 restart` to manage your application.

After these steps, your application should be live and accessible at your domain.

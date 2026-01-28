# FF HUB Setup Instructions

Follow these steps to get your Free Fire Esports Hub application running with a complete database and demo users.

## Step 1: Set up the Database Schema

This is the most important step. This single script will create all the necessary tables, security rules, and automation for your app.

1.  Go to your Supabase project dashboard.
2.  In the left sidebar, navigate to the **SQL Editor**.
3.  Click on **+ New query**.
4.  Open the `dummy_data.sql` file from the project files.
5.  Copy the **entire content** of `dummy_data.sql` and paste it into the Supabase SQL Editor.
6.  Click the **RUN** button.

You should see a success message: "Successfully set up database schema, RLS policies, and triggers." at the bottom. Your database is now ready!

## Step 2: (Recommended) Disable Email Confirmation

For a smoother development and testing experience, it is highly recommended to disable the email confirmation requirement for new users. This will allow you to log in immediately after signing up.

1.  In your Supabase dashboard, go to **Authentication** (the icon with users).
2.  In the sidebar, click on **Providers**.
3.  Find the **Email** provider in the list and click on it to expand.
4.  Toggle off the switch for **Confirm email**.
5.  Click **Save**.

If you keep this enabled, you must check your email and click the confirmation link after registering before you can log in.

## Step 3: Create Demo Users

Now that the database is set up, you can create your admin and regular user accounts through the application's interface.

1.  **Run the application.**
2.  Click on the **Login/Register** button.
3.  Click on **Register Now**.
4.  Create the **Admin User**:
    *   **Email**: `admin@ffhub.com`
    *   **Password**: `password123`
    *   Fill in the other details as you like (e.g., Name: `Admin FF`, In-game Name: `FF_Admin`).
    *   Click **Register**.
5.  After registering, log out.
6.  Create the **Regular User**:
    *   **Email**: `user@ffhub.com`
    *   **Password**: `password123`
    *   Fill in other details (e.g., Name: `Demo Player`, In-game Name: `Demo_User`).
    *   Click **Register**.

## Step 4: Grant Admin Privileges

The `admin@ffhub.com` user is currently a regular user. You need to promote them to an admin.

1.  Go back to the **SQL Editor** in your Supabase dashboard.
2.  Click **+ New query**.
3.  Paste the following single line of code into the editor:

    ```sql
    UPDATE public.users SET "isAdmin" = TRUE WHERE email = 'admin@ffhub.com';
    ```

4.  Click **RUN**.

You should see a success message indicating 1 row was updated.

## All Done!

Your setup is complete. You can now log in with:

-   **Admin Account**:
    -   Email: `admin@ffhub.com`
    -   Password: `password123`
-   **User Account**:
    -   Email: `user@ffhub.com`
    -   Password: `password123`

Enjoy the platform!

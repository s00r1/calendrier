# Kitchen Cleaning Schedule

## Project overview
This web application manages kitchen cleaning tasks. It runs entirely on the client side: open `index.html` in a modern browser to generate and print a custom calendar.

### Main features
- Dynamically generates a monthly calendar
- Manual or automatic assignment of rooms (from **1** to **54** except room **13**)
- Password-protected admin mode to edit the schedule
- Exclude rooms and start assignments on a specific date
- Quick calendar clearing and dark theme
- Print directly from the browser
- Download the schedule as a PDF
- Admin interface elements are hidden when printing
- Bilingual interface (French/العربية) with instant AR/FR toggle
- Online saving of assignments with Supabase
- Save and load admin configurations
- Change the admin password from the interface
- Add multiple rooms per day and link rooms together

---

## 🚀 Detailed local installation (Windows, Linux, macOS)

### 1️⃣ Prerequisites

To use this project you should have:
- **Git** (to clone the repository)
- A **modern browser** (Chrome, Firefox, Edge, Safari...)
- (Optional) [VS Code](https://code.visualstudio.com/) to easily edit the code
- (For persistence) A [Supabase](https://app.supabase.com/) account

#### Install Git for your system:

- Windows: Download Git here: https://git-scm.com/download/win and install it with default options. Launch “Git Bash” from the Start menu.
- Linux: open a terminal and type:
    sudo apt update
    sudo apt install git
- macOS: open Terminal and type:
    brew install git
  (If Homebrew is missing, see https://brew.sh)

---

### 2️⃣ Clone the repository

Open your terminal (**Git Bash** on Windows or the usual terminal on Linux/Mac) and type:

    git clone https://github.com/s00r1/calendrier.git
    cd calendrier

*Tip: if you don't want to use Git, click the “Code” button on GitHub then “Download ZIP” and unzip it wherever you like.*

---

### 3️⃣ Open the project

- Open the resulting `calendrier` folder.
- To edit the files, open it with [VS Code](https://code.visualstudio.com/) or your favorite editor.
- If you don't need to modify anything, skip to the next step.

---

### 4️⃣ Start the project locally

Quick method: double-click `index.html`.
Depending on your browser or system, some features may require using a local server.

Recommended server (to view and edit everything):
- Install the free Live Server extension for VS Code.
- Right-click `index.html` → “Open with Live Server”.
- Alternative: run `npx serve .` or `python3 -m http.server` in the project folder.

---

## Local installation
1. Clone the repository:
   ```bash
   git clone https://github.com/s00r1/calendrier.git
   cd calendrier
   ```
2. Copy `.env.example` to `.env` and fill in your Supabase keys and `ADMIN_PASS`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the local server:
   ```bash
   npm start
   ```
5. Open `index.html` in your browser.

## Working on GitHub
1. Fork this repository on GitHub.
2. Clone your fork:
   ```bash
   git clone https://github.com/s00r1/calendrier.git
   cd calendrier
   ```
3. Create a feature branch:
   ```bash
   git checkout -b my-feature
   ```
4. Commit your changes and push the branch:
   ```bash
   git push origin my-feature
   ```
5. From GitHub, open a Pull Request to the original repository.

## Manual tests
- Run `node testSupabase.js` to check access to the `assignments` table.
- Use `index.html?test-api=1` or `dev.html` to test Supabase requests in the browser.

### Configuration

1. Copy the `.env.example` file to `.env`.
2. Fill it with your Supabase credentials and the admin password:

    SUPABASE_URL=<your_url>
    SUPABASE_KEY=<your_key>
    ADMIN_PASS=s00r1

To enable Supabase persistence:
- Create an account at <https://app.supabase.com> and a project.
- Follow the remaining **Configuration** steps below.

---

Copy the `.env.example` file to `.env` and set `SUPABASE_URL`, `SUPABASE_KEY` and `ADMIN_PASS`.
The `.env.example` file includes:

```env
SUPABASE_URL=<your_url>
SUPABASE_KEY=<your_key>
ADMIN_PASS=s00r1
```

To persist assignments with Supabase:

1. Log in to [Supabase](https://app.supabase.com) and create a project (e.g. **menage**).
2. In **Table Editor**, create a table `assignments` with the columns `id` (auto-increment, primary key), `due_date` (date, unique) and `title` (text). The `due_date` column must be unique so that `upsert` works correctly.
3. Enable *Row Level Security* and add a policy allowing the `anon` role to read and write on the table (use `true` as expression for testing).
4. Under **Settings > API**, copy your project URL and anon key.
5. Enter these values in the `.env` file under the `SUPABASE_URL` and `SUPABASE_KEY` variables.
6. Run the `create_admin_configs.sql` script in the Supabase SQL Editor to create the `admin_configs` table.

### Automatically creating the Supabase tables

To avoid manual errors, you can create all tables directly from the **SQL Editor**.

1. In your project, open **SQL Editor** and choose **New query**.
2. Paste and run the following script to create the `assignments` table and its security policy:

```sql
create table if not exists public.assignments (
  id bigint generated by default as identity primary key,
  due_date date not null unique,
  title text
);

alter table public.assignments enable row level security;

create policy anon_full_access on public.assignments
  for all to anon
  using (true)
  with check (true);
```

3. In the same editor, open the `create_admin_configs.sql` file from this repository and execute it to create the `admin_configs` table.
4. Finally, copy the API URL and `anon` key from **Settings > API** and place them in your `.env` file.

**Note:** These keys are temporary for testing and will later be replaced by a safer method.

## Quick usage

1. Select the desired month and year; the calendar updates instantly.
2. Enable **admin mode** via the *Admin* button and enter the password set in the `.env` file (`ADMIN_PASS`).
3. Enter the room numbers for each date or use automatic assignment. Use the **+** button to add multiple rooms if needed.

4. Click **Download PDF** to save the schedule.
5. Click **Print** to generate a paper version of the schedule.
6. Change the language at any time using the **AR/FR** button at the top of the page. Changes are automatically saved in Supabase when configured.
7. Use the **Configuration** bar at the top of the admin area to load or save settings and change the password.
### Automatic assignment

In the admin section, enter the **starting room** and **start date**. Press the **Auto** button to pre-fill the calendar taking any excluded rooms into account.

### Excluding rooms

Select the room number or linked pair to ignore from the drop-down menu, then confirm to remove it from automatic planning. Linked pairs appear as "a/b" and exclude both rooms.

#### Edge case

If the exclusion list contains all rooms (all 54 numbers), the **Auto** button displays an error message and no assignment is performed.

### Linking rooms

Use the two fields in the admin section to specify room numbers that should always be assigned together. Remove a link with the small cross next to it. Linked pairs also appear in the drop-down lists as "a/b" while the returned value remains the first number.


### Saving or loading a configuration

The top line of the admin area now contains a **Configuration** bar located just below the *Admin* button. It provides a drop-down list of saved configurations along with **Load**, **Save** and **Delete** buttons. The same bar also offers a **Change password** button.

- Click **Save** to store the current exclusion and linking settings.
- Select a name and press **Load** to apply it.
- **Delete** removes the selected entry.
- **Change password** records a new admin password in Supabase.
### Cleaning the calendar

The **Clear** button quickly removes all entered values so you can start with a blank grid.

### Testing persistence

After manually filling the schedule or using the **Auto** button, refresh the page. All assigned dates should reappear thanks to persistence via Supabase. If not, double-check your Supabase configuration.

### Verify Supabase connection

The Node script `testSupabase.js` can quickly test access to the `assignments` table.

1. Install the dependencies (once):
    npm install
2. Run the script:
    node testSupabase.js
The retrieved data or a complete error message will appear in the console.

### Manual API tests

Another script (`test-api.js`) checks from the browser that Supabase requests work correctly.
Open `index.html?test-api=1` (or simply `dev.html`) to run these manual tests.
The results or errors will display directly in the interface.

### Dark theme

Toggle the **Theme** button to switch between a light and dark display according to your preferences.

## Contributing

Contributions are welcome! Feel free to open issues or pull requests to suggest improvements.

### Getting started

1. Copy `.env.example` to `.env` and fill in the required variables.
2. Run `npm install` if needed and then `npm start` (or `npx serve .`) to serve the application locally.
3. Use `node testSupabase.js` to verify the Supabase connection.
4. Pull requests must preserve client-side compatibility: please avoid adding extra server-side dependencies.

## License

This project is distributed under the [MIT](LICENSE) license. A guide in French is available: [README.md](README.md). Documentation and a license in Arabic are also available: [README_ar.md](README_ar.md) and [LICENSE_AR.md](LICENSE_AR.md).

## 💡 Tips & Beginner FAQ

- Can't clone? Make sure Git is installed (see step 1).
- Permission issue on the folder? Run your editor/terminal as administrator (Windows) or use sudo (Linux/Mac).
- Error when starting? Check that the Supabase keys are correctly set in `.env` and that the internet connection is active.
- Need to reset the project? Delete the folder, clone again and start calmly.

For any question or problem, open a GitHub issue at <https://github.com/s00r1/calendrier/issues>.

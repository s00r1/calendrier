# Kitchen Cleaning Schedule

This web application manages the distribution of cleaning tasks in the kitchen. It runs entirely on the client side: simply open `index.html` in a modern browser to generate and print a customized calendar.

## Main features

- Dynamically generates a monthly calendar
- Manual or automatic assignment of rooms (from **1** to **54** except room **13**)
- Password-protected admin mode to edit the schedule
- Exclude rooms and start assignments on a specific date
- Quick calendar clearing and dark theme for comfortable viewing
- Print directly from the browser
- Admin interface elements are automatically hidden when printing
- Bilingual interface (French/العربية) with instant switching via the AR/FR button
- Online saving of assignments thanks to Supabase

## Installation

No specific installation is required. Clone the repository and open the `index.html` file with your preferred browser. You can also serve the folder through a small HTTP server if you want to access it from other machines:

```bash
npx serve .
```

To persist assignments with Supabase:

1. Log in to [Supabase](https://app.supabase.com) and create a project (e.g. **menage**).
2. In **Table Editor**, create a table `assignments` with the columns `date` (date, primary key) and `chambre` (text).
3. Enable *Row Level Security* and add a policy allowing the `anon` role to read and write on the table (use `true` as expression for testing).
4. Under **Settings > API**, copy your project URL and anon key.
5. Fill these values in `calendar.js` in the `SUPABASE_URL` and `SUPABASE_KEY` constants.

**Note:** These keys are temporary for testing and will later be replaced by a safer method.

## Quick usage

1. Select the desired month and year; the calendar updates instantly.
2. Enable **admin mode** via the *Admin* button and enter the default password `s00r1`.
3. Enter the room numbers for each date or use automatic assignment.
4. Click **Print** to generate a paper version of the schedule.
5. Change the language at any time using the **AR/FR** button at the top of the page. Changes are automatically saved in Supabase when configured.

### Automatic assignment

In the admin section, enter the **starting room** and **start date**. Press the **Auto** button to pre-fill the calendar taking any excluded rooms into account.

### Excluding rooms

Enter the numbers to ignore in the exclusion field then validate to remove those rooms from the automatic planning.

#### Edge case

If the exclusion list contains all rooms (all 54 numbers), the **Auto** button displays an error message and no assignment is performed.

### Cleaning the calendar

The **Clear** button quickly removes all entered values so you can start with a blank grid.

### Testing persistence

After manually filling the schedule or using the **Auto** button, refresh the page. All assigned dates should reappear thanks to persistence via Supabase. If not, double-check your Supabase configuration.

### Dark theme

Toggle the **Theme** button to switch between a light and dark display according to your preferences.

## Contributing

Contributions are welcome! Feel free to open issues or pull requests to suggest improvements.

## License

This project is distributed under the [MIT](LICENSE) license. Documentation and a license in Arabic are available: [README_ar.md](README_ar.md) and [LICENSE_AR.md](LICENSE_AR.md).

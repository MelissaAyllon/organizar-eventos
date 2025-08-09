# organizing-sustainable-events

1. Clone the repository::
```
git clone https://github.com/MelissaAyllon/organizing-sustainable-events.git
```

2. Set up the project locally:

Ensure you have the .env file in your project’s root directory. If it doesn't exist, copy the .env.example to create your .env file:

3. Copy `.env.example` to `.env`

Create a `.env` file by copying the `.env.example` file:

```bash
cp .env.example .env
```

4. Generate the Application Key

Generate the Laravel application key:

```bash
php artisan key:generate
```

5. Create the SQLite Database

Navigate to the `database` folder and create an empty SQLite database file:

```bash
cd database
touch database.sqlite
```

This creates the `database.sqlite` file in the `database` directory.

6. Update `.env` for SQLite Configuration

Open the `.env` file and update it with the following configuration to use SQLite:

```env
DB_CONNECTION=sqlite
DB_DATABASE=./database/database.sqlite
```

7. Run Migrations

Run the Laravel migrations to create the necessary tables in the SQLite database:

```bash
php artisan migrate
```

8. Install Dependencies

Install the Node.js dependencies:

```bash
npm install
```

Build the assets:

```bash
npm run build
```

9. Start the Development Server

Finally, start the Laravel development server and watch for changes:

```bash
composer run dev
```

[Official Laravel Documentation](https://laravel.com/docs/12.x/installation)


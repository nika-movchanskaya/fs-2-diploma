
# Project Setup

## 🚀 Backend Setup:
```bash
$ composer install
$ php artisan migrate:fresh --seed
$ php artisan serve
```

## 💻 Frontend Setup:
```bash
$ npm install
$ npm start
```

## 🔑 Authentication:
- **Login Page:** `/login` -> Redirects to `/admin/index`
- **Default Credentials:**
```json
{
    "email": "test@example.com",
    "password": "password"
}
```
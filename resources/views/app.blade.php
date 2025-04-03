<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    @viteReactRefresh
    @vite(['resources/js/app.jsx', 'resources/css/app.css']) <!-- Ensure correct path -->
</head>

<body>
    @inertia
    <meta name="csrf-token" content="{{ csrf_token() }}">
</body>

</html>
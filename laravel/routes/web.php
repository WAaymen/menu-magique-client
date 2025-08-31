<?php

use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return view('welcome');
});

use App\Models\User;


Route::get('/users', function() {
    return User::all();
});




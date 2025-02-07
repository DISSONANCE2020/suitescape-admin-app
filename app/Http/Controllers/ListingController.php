<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Listing;
use Illuminate\Support\Facades\Log;

class ListingController extends Controller
{
    // public function index(): Response
    // {
    //     $listings = Listing::all(); // No user data, just listings

    //     Log::info("Listings fetched:", $listings->toArray());

    //     return Inertia::render('ContentModerator', [
    //         'listings' => $listings ?? []
    //     ]);
    // }

}
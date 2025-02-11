<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ContentAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure the content-admin role exists
        if (!Role::where('name', 'content-admin')->exists()) {
            Role::create(['name' => 'content-admin']);
        }

        // Check if the user already exists
        $user = User::where('email', 'gabriel@suitescape.ph')->first();
        if (!$user) {
            $user = User::create([
                'id' => Str::uuid()->toString(), // Ensure UUID is set
                'firstname' => 'Gabriel',
                'lastname' => 'Cruz',
                'email' => 'gabriel@suitescape.ph',
                'password' => Hash::make('your_secure_password'),
                'date_of_birth' => '2003-03-17', // ✅ Add date_of_birth field
            ]);

            // Assign role
            $user->assignRole('content-admin');
        }
    }
}

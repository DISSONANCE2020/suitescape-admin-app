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
        if (!Role::where('name', 'super-admin')->exists()) {
            Role::create(['name' => 'super-admin']);
        }

        // Check if the user already exists
        $user = User::where('email', operator: 'sample@gmail.com')->first();
        if (!$user) {
            $user = User::create([
                'id' => Str::uuid()->toString(),
                'firstname' => 'Jose',
                'lastname' => 'Cruz',
                'email' => 'sample@gmail.com',
                'password' => Hash::make('123'),
                'date_of_birth' => '2003-03-17',
            ]);

            // Assign role
            $user->assignRole('super-admin');
        }
    }
}

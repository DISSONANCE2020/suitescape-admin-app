<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class TestFinanceAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Create a test user
        $user = User::updateOrCreate(
            ['email' => 'finance@test.com'], // Avoid duplicate users
            [
                'firstname' => 'Finance',
                'lastname' => 'Admin',
                'password' => Hash::make('password123'),
            ]
        );

        // Assign role_id: 5 in model_has_roles
        DB::table('model_has_roles')->updateOrInsert(
            [
                'model_id' => $user->id,
                'model_type' => 'App\\Models\\User',
            ],
            [
                'role_id' => 5, // Finance Admin role
            ]
        );

        $this->command->info('✅ Test Finance Admin created successfully!');
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run()
    {

        $this->call([
            RoleSeeder::class,
        ]);
        
        // Ensure roles exist
        Role::firstOrCreate(['name' => 'super-admin']);
        Role::firstOrCreate(['name' => 'content-admin']);
        Role::firstOrCreate(['name' => 'finance-admin']);

        // Assign role to a specific user
        $user = User::find(1);
        if ($user) {
            $user->assignRole('content-admin');
        }
    }
}

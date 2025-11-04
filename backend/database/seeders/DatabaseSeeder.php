<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = \App\Models\User::factory()->create([
            'name' => 'Demo BudgetZen',
            'email' => 'demo@budgetzen.test',
            'password' => bcrypt('password'),
        ]);

        \App\Models\Expense::factory(12)->create([
            'user_id' => $user->id,
        ]);

        \App\Models\Charge::factory(8)->create([
            'user_id' => $user->id,
        ]);
    }
}

<?php

namespace Database\Factories;

use App\Models\Expense;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Expense>
 */
class ExpenseFactory extends Factory
{
    protected $model = Expense::class;

    public function definition(): array
    {
        $categories = ['Alimentation', 'Transport', 'Logement', 'Divertissement', 'Services publics', 'Autres'];

        return [
            'user_id' => User::factory(),
            'description' => $this->faker->sentence(3),
            'amount' => $this->faker->randomFloat(2, 5, 450),
            'category' => $this->faker->randomElement($categories),
            'date' => $this->faker->dateTimeBetween('-90 days', 'now')->format('Y-m-d'),
        ];
    }
}


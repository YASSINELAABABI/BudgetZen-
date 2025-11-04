<?php

namespace Database\Factories;

use App\Models\Charge;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Charge>
 */
class ChargeFactory extends Factory
{
    protected $model = Charge::class;

    public function definition(): array
    {
        $categories = ['Logement', 'Transport', 'Services publics', 'Assurances', 'Dettes', 'Abonnements'];

        return [
            'user_id' => User::factory(),
            'description' => ucfirst($this->faker->words(3, true)),
            'amount' => $this->faker->randomFloat(2, 15, 1500),
            'category' => $this->faker->randomElement($categories),
            'due_date' => $this->faker->dateTimeBetween('now', '+45 days')->format('Y-m-d'),
            'is_paid' => $this->faker->boolean(40),
        ];
    }
}


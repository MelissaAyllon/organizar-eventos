<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre' => $this->faker->word(),
            'fecha' => $this->faker->date(),
            'ubicacion' => $this->faker->address(),
            'descripcion' => $this->faker->sentence(),
            'tipo_actividad' => $this->faker->randomElement(['Conferencia', 'Taller', 'Seminario', 'Webinar']),
            'organizador' => $this->faker->company(),
            'capacidad_maxima' => $this->faker->numberBetween(50, 500),
            'estado' => $this->faker->randomElement(['activo', 'inactivo']),
            'comments_count' => $this->faker->numberBetween(0, 100),
        ];
    }
}

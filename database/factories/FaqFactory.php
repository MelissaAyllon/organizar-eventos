<?php

namespace Database\Factories;

use App\Models\Faq;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Faq>
 */
class FaqFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categorias = [
            'Eventos',
            'Registro',
            'Ubicación',
            'Participación',
            'Sostenibilidad',
            'General'
        ];

        return [
            'pregunta' => $this->faker->sentence() . '?',
            'respuesta' => $this->faker->paragraph(3),
            'categoria' => $this->faker->randomElement($categorias),
            'orden' => $this->faker->numberBetween(0, 100),
            'activo' => $this->faker->boolean(80), // 80% de probabilidad de estar activo
        ];
    }

    /**
     * Indica que la FAQ está activa
     */
    public function activa(): static
    {
        return $this->state(fn (array $attributes) => [
            'activo' => true,
        ]);
    }

    /**
     * Indica que la FAQ está inactiva
     */
    public function inactiva(): static
    {
        return $this->state(fn (array $attributes) => [
            'activo' => false,
        ]);
    }

    /**
     * FAQ de una categoría específica
     */
    public function categoria(string $categoria): static
    {
        return $this->state(fn (array $attributes) => [
            'categoria' => $categoria,
        ]);
    }
} 
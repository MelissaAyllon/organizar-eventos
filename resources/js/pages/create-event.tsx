import { router } from "@inertiajs/react";
import Event from "./Events/event"; // tu form reutilizable
import React, { useState } from "react";

export default function CreateEvent() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: unknown) => {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al crear el evento");
      }

      // Si se creó bien → redirigimos a /events
      router.visit("/events", {
        preserveScroll: true,
        preserveState: false,
      });
    } catch (error) {
        console.error("Error creating event:", error); // Log the error
        setError("Failed to create event. Please try again.");
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-red-800">
          {error}
        </div>
      )}

      <Event mode="create" onSubmit={handleSubmit} />
    </div>
  );
}

import { router } from "@inertiajs/react";
import Event from "./Events/event"; // tu form reutilizable
import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/events"
          className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-red-800">
          {error}
        </div>
      )}

      <Event mode="create" onSubmit={handleSubmit} />
    </div>
  );
}

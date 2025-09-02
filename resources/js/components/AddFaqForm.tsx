import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/text-area';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Plus } from 'lucide-react';

interface AddFaqFormProps {
  onFaqAdded: () => void;
}

export default function AddFaqForm({ onFaqAdded }: AddFaqFormProps) {
  const [open, setOpen] = useState(false);
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pregunta.trim() || !respuesta.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          pregunta: pregunta.trim(),
          respuesta: respuesta.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Limpiar el formulario
        setPregunta('');
        setRespuesta('');
        setOpen(false);
        
        // Notificar al componente padre que se agregó una FAQ
        onFaqAdded();
        
        alert('FAQ agregada exitosamente');
      } else {
        alert('Error al agregar la FAQ');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar la FAQ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setPregunta('');
    setRespuesta('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Agregar FAQ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nueva FAQ</DialogTitle>
          <DialogDescription>
            Completa los campos para agregar una nueva pregunta frecuente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="pregunta">Pregunta</Label>
              <Input
                id="pregunta"
                value={pregunta}
                onChange={(e) => setPregunta(e.target.value)}
                placeholder="¿Cuál es tu pregunta?"
                maxLength={255}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="respuesta">Respuesta</Label>
              <Textarea
                id="respuesta"
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                placeholder="Escribe la respuesta aquí..."
                maxLength={1000}
                rows={4}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Agregando...' : 'Agregar FAQ'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-dvh bg-background2 text-foreground p-4 w-full">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-red-500">Erreur</h1>
        <h2 className="text-2xl font-semibold">Une erreur s&apos;est produite</h2>
        <p className="text-gray-400 max-w-md">
          Désolé, une erreur inattendue s&apos;est produite lors de l&apos;opération.
          Veuillez réessayer ou contacter l&apos;administrateur si le problème persiste.
        </p>
        <div className="space-x-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Retour
          </Button>
          <Button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Accueil
          </Button>
        </div>
      </div>
    </div>
  );
}

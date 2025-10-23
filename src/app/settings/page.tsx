import { PasswordSettingsCard } from "@/components/settings/PasswordSettingsCard";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <p className="text-gray-600 mt-2">
            Gérez les paramètres de votre compte et de votre organisation
          </p>
        </div>

        {/* Section Sécurité */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Sécurité</h2>
          <PasswordSettingsCard />
        </div>

        {/* Autres sections peuvent être ajoutées ici */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Profil</h2>
          <div className="bg-white p-6 rounded-lg border">
            <p className="text-gray-600">
              Les paramètres de profil seront ajoutés ici...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

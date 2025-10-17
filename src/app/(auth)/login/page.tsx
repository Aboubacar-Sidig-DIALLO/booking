export default function LoginPage() {
  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="w-full max-w-sm rounded-xl border bg-white/50 p-6 shadow-sm dark:bg-neutral-900/50">
        <h1 className="mb-2 text-xl font-semibold">Connexion</h1>
        <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-300">
          Veuillez vous connecter pour continuer.
        </p>
        <form className="space-y-4">
          <input
            className="w-full rounded-md border px-3 py-2"
            placeholder="Email"
          />
          <input
            className="w-full rounded-md border px-3 py-2"
            placeholder="Mot de passe"
            type="password"
          />
          <button className="w-full rounded-md bg-black px-3 py-2 text-white dark:bg-white dark:text-black">
            Se connecter
          </button>
        </form>
      </div>
    </main>
  );
}

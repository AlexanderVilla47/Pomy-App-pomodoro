const NEW_APP_URL = "https://pomodoro.alexandervilla.dev/";

export default function MudanzaPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Nos mudamos</h1>
          <p className="text-gray-400 text-sm">
            Pomodoro ahora vive en una nueva dirección. Actualizá tus marcadores
            para seguir usándolo.
          </p>
        </div>
        <a
          href={NEW_APP_URL}
          className="inline-block bg-white text-gray-800 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Ir a la nueva dirección
        </a>
        <p className="text-gray-500 text-xs">pomodoro.alexandervilla.dev</p>
      </div>
    </div>
  );
}

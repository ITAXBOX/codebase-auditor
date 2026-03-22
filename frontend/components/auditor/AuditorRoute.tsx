import AuditorShell from './AuditorShell';

export default function AuditorRoute() {
  return (
    <main className="flex flex-col h-screen bg-gray-950 text-gray-100">
      <header className="flex-shrink-0 bg-gray-900 border-b border-gray-800 px-6 py-4
                         flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-indigo-600 text-white text-xs font-bold">
              AI
            </span>
            Codebase Auditor
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Architecture mapping · MLOps analysis · Health scoring
          </p>
        </div>
      </header>

      <div className="flex-1 min-h-0">
        <AuditorShell />
      </div>
    </main>
  );
}

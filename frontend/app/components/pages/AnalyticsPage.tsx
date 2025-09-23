"use client";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">125%</div>
            <div className="text-sm text-gray-600">Crecimiento</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">8.2K</div>
            <div className="text-sm text-gray-600">Visitantes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">94%</div>
            <div className="text-sm text-gray-600">Satisfacción</div>
          </div>
        </div>

        <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Gráficos de analytics (placeholder)</p>
        </div>
      </div>
    </div>
  );
}

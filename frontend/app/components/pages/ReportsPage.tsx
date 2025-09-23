"use client";

export default function ReportsPage() {
  const reports = [
    { id: 1, name: 'Reporte de Ventas Mensual', date: '2025-09-01', status: 'Completado' },
    { id: 2, name: 'Análisis de Usuarios', date: '2025-09-15', status: 'En progreso' },
    { id: 3, name: 'Métricas de Rendimiento', date: '2025-09-18', status: 'Pendiente' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Reportes</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Nuevo Reporte
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Nombre</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Fecha</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{report.name}</td>
                  <td className="py-3 px-4">{report.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      report.status === 'Completado' ? 'bg-green-100 text-green-800' :
                      report.status === 'En progreso' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

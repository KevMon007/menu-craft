import { useEffect, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  Eye,
  FolderOpen,
  QrCode,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";

import { PageHeader } from "../../components/shared";
import { Card } from "../../components/ui";
import StatCard from "../../components/ui/StatCard";
import { getDashboardAnalytics } from "../../services/analyticsService";

const emptyAnalytics = {
  qrScansToday: 0,
  menuViewsToday: 0,
  menuViewsLast7Days: 0,
  soldOutThisMonth: 0,
  activeCategories: 0,
  inactiveCategories: 0,
  availableProducts: 0,
  unavailableProducts: 0,
  visitsByDay: [],
  topSoldOutProducts: [],
  recentEvents: [],
};

const eventLabels = {
  qr_scan: "Escaneo QR",
  menu_view: "Visita al menú",
  category_view: "Categoría consultada",
  product_view: "Platillo visto",
  product_sold_out: "Platillo agotado",
};

function Dashboard() {
  const [analytics, setAnalytics] = useState(emptyAnalytics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        setError(null);
        const data = await getDashboardAnalytics();
        setAnalytics({ ...emptyAnalytics, ...data });
      } catch (err) {
        setError(err.message || "No fue posible cargar las estadísticas.");
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  const maxDailyViews = Math.max(
    1,
    ...analytics.visitsByDay.map((day) => Number(day.views || 0))
  );

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Consulta el comportamiento del menú público y detecta oportunidades para tu restaurante."
      />

      {error && (
        <Card className="mt-6 border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </Card>
      )}

      {loading ? (
        <div className="mt-10 text-gray-500">Cargando estadísticas...</div>
      ) : (
        <div className="mt-8 space-y-8">
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Escaneos QR hoy"
              value={analytics.qrScansToday}
              icon={<QrCode size={22} />}
              color="orange"
            />
            <StatCard
              title="Visitas únicas hoy"
              value={analytics.menuViewsToday}
              icon={<Eye size={22} />}
              color="blue"
            />
            <StatCard
              title="Visitas últimos 7 días"
              value={analytics.menuViewsLast7Days}
              icon={<TrendingUp size={22} />}
              color="green"
            />
            <StatCard
              title="Agotados este mes"
              value={analytics.soldOutThisMonth}
              icon={<UtensilsCrossed size={22} />}
              color="red"
            />
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_1fr]">
            <Card className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <BarChart3 className="text-orange-500" />
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Visitas por día</h2>
                  <p className="text-sm text-gray-500">Actividad del menú durante los últimos 7 días.</p>
                </div>
              </div>

              <div className="space-y-4">
                {analytics.visitsByDay.map((day) => {
                  const views = Number(day.views || 0);
                  const width = `${Math.max(4, (views / maxDailyViews) * 100)}%`;

                  return (
                    <div key={day.date} className="grid grid-cols-[90px_1fr_42px] items-center gap-3 text-sm">
                      <span className="text-gray-500">{formatShortDate(day.date)}</span>
                      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-orange-500" style={{ width }} />
                      </div>
                      <span className="text-right font-semibold text-slate-800">{views}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-5 flex items-center gap-3">
                <FolderOpen className="text-orange-500" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Estado del menú</h2>
                  <p className="text-sm text-gray-500">Disponibilidad actual en administración.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StatusMetric label="Categorías activas" value={analytics.activeCategories} color="text-green-600" />
                <StatusMetric label="Categorías inactivas" value={analytics.inactiveCategories} color="text-gray-500" />
                <StatusMetric label="Platillos disponibles" value={analytics.availableProducts} color="text-green-600" />
                <StatusMetric label="Platillos no disponibles" value={analytics.unavailableProducts} color="text-red-600" />
              </div>
            </Card>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <RankingCard
              title="Platillos más agotados"
              description="Últimos 30 días"
              items={analytics.topSoldOutProducts}
              valueKey="times"
              emptyText="Aún no hay agotamientos registrados."
              icon={<UtensilsCrossed className="text-red-500" />}
            />
            <RecentEvents events={analytics.recentEvents} />
          </section>
        </div>
      )}
    </div>
  );
}

function StatusMetric({ label, value, color }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
}

function RankingCard({ title, description, items, valueKey, emptyText, icon }) {
  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center gap-3">
        {icon}
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-400">{emptyText}</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-orange-600">
                  {index + 1}
                </span>
                <span className="truncate font-medium text-slate-800">{item.nombre}</span>
              </div>
              <span className="shrink-0 text-sm font-semibold text-gray-500">
                {item[valueKey]}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function RecentEvents({ events }) {
  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center gap-3">
        <CalendarDays className="text-green-500" />
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Actividad reciente</h2>
          <p className="text-sm text-gray-500">Últimos eventos registrados.</p>
        </div>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-gray-400">Aún no hay actividad registrada.</p>
      ) : (
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={`${event.event_type}-${event.created_at}-${index}`} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <p className="text-sm font-medium text-slate-800">
                {eventLabels[event.event_type] || event.event_type}
              </p>
              <p className="text-xs text-gray-500">
                {event.platillo_nombre || event.categoria_nombre || "Menú público"} · {formatDateTime(event.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${date}T00:00:00`));
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default Dashboard;

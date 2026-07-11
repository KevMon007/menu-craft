import {
  FolderOpen,
  CheckCircle2,
  Circle,
  UtensilsCrossed,
} from "lucide-react";

import StatCard from "../ui/StatCard";

function CategoryStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

      <StatCard
        title="Categorías totales"
        value={stats.total}
        icon={<FolderOpen size={22} />}
        color="yellow"
      />

      <StatCard
        title="Activas"
        value={stats.active}
        icon={<CheckCircle2 size={22} />}
        color="green"
      />

      <StatCard
        title="Inactivas"
        value={stats.inactive}
        icon={<Circle size={22} />}
        color="gray"
      />

      <StatCard
        title="Platillos totales"
        value={stats.products}
        icon={<UtensilsCrossed size={22} />}
        color="orange"
      />

    </div>
  );
}

export default CategoryStats;
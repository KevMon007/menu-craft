import {
  UtensilsCrossed,
  CircleCheckBig,
  CircleX,
} from "lucide-react";

import StatCard from "../ui/StatCard";

function ProductStats({ stats }) {
  const icons = {
    total: <UtensilsCrossed size={22} />,
    available: <CircleCheckBig size={22} />,
    unavailable: <CircleX size={22} />,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

      <StatCard
        title="Total"
        value={stats.total}
        icon={icons.total}
        color="orange"
      />

      <StatCard
        title="Disponibles"
        value={stats.available}
        icon={icons.available}
        color="green"
      />

      <StatCard
        title="No disponibles"
        value={stats.unavailable}
        icon={icons.unavailable}
        color="red"
      />

    </div>
  );
}

export default ProductStats;
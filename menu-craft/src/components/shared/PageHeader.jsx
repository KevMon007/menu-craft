import { Button } from "../ui";
import { Plus } from "lucide-react";

function PageHeader({
  title,
  description,
  buttonText,
  onAction,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">

      <div>
        <h1 className="text-4xl font-bold text-slate-800">
          {title}
        </h1>

        <p className="mt-2 text-gray-500">
          {description}
        </p>
      </div>

      <Button
        icon={<Plus size={18} />}
        onClick={onAction}
      >
        {buttonText}
      </Button>

    </div>
  );
}

export default PageHeader;
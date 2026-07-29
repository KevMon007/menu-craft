import { Button } from "../ui";
import { Plus } from "lucide-react";

function PageHeader({
  title,
  description,
  buttonText,
  onAction,
  buttonDisabled = false,
  buttonHint = "",
}) {
  return (
    <div className="flex flex-col gap-5 mb-8 md:flex-row md:items-center md:justify-between md:gap-6">

      <div>
        <h1 className="text-3xl font-bold text-slate-800 md:text-4xl">
          {title}
        </h1>

        <p className="mt-2 text-gray-500">
          {description}
        </p>
      </div>

      {buttonText && onAction && (
        <div className="flex w-full flex-col items-stretch gap-2 md:w-auto md:items-end">

          <Button
            icon={<Plus size={18} />}
            onClick={onAction}
            disabled={buttonDisabled}
            className="w-full md:w-auto"
          >
            {buttonText}
          </Button>

          {buttonHint && (
            <p className="max-w-xs text-sm text-gray-500 md:text-right">
              {buttonHint}
            </p>
          )}
        </div>
      )}

    </div>
  );
}

export default PageHeader;

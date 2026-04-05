import type { EnrollmentStatus } from "@/api/studies";
import { Badge } from "@/components/ui/badge";

const config: Record<
  EnrollmentStatus,
  { label: string; className: string }
> = {
  UPCOMING: {
    label: "모집 예정",
    className:
      "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  },
  OPEN: {
    label: "모집 중",
    className:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  },
  CLOSED: {
    label: "모집 마감",
    className:
      "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  },
  ALWAYS: {
    label: "상시 모집",
    className:
      "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
  },
};

export default function EnrollmentStatusBadge({
  status,
}: {
  status: EnrollmentStatus;
}) {
  const { label, className } = config[status] ?? { label: status, className: "" };

  return (
    <Badge variant="secondary" className={`px-2.5 py-0.5 text-xs ${className}`}>
      {label}
    </Badge>
  );
}

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  showTime?: boolean;
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "날짜 선택",
  showTime = false,
}: DatePickerProps) {
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange(undefined);
      return;
    }
    if (value) {
      date.setHours(value.getHours(), value.getMinutes());
    }
    onChange(date);
  };

  const formatLabel = () => {
    if (!value) return placeholder;
    if (showTime) return format(value, "yyyy.MM.dd HH:mm", { locale: ko });
    return format(value, "yyyy년 MM월 dd일", { locale: ko });
  };

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "border-input bg-background ring-ring/50 flex h-12 w-full items-center gap-2 rounded-lg border px-3 text-sm outline-none focus:ring-2",
          !value && "text-muted-foreground",
        )}
      >
        <CalendarIcon className="size-4" />
        {formatLabel()}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          locale={ko}
        />
        {showTime && (
          <div className="border-t px-3 py-3">
            <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
              시간
            </label>
            {value ? (
              <div className="flex items-center gap-2">
                <select
                  value={value.getHours()}
                  onChange={(e) => {
                    const next = new Date(value);
                    next.setHours(Number(e.target.value));
                    onChange(next);
                  }}
                  className="border-input bg-background h-9 rounded-md border px-2 text-sm"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {String(i).padStart(2, "0")}시
                    </option>
                  ))}
                </select>
                <span className="text-muted-foreground">:</span>
                <select
                  value={value.getMinutes()}
                  onChange={(e) => {
                    const next = new Date(value);
                    next.setMinutes(Number(e.target.value));
                    onChange(next);
                  }}
                  className="border-input bg-background h-9 rounded-md border px-2 text-sm"
                >
                  {Array.from({ length: 12 }, (_, i) => i * 5).map((m) => (
                    <option key={m} value={m}>
                      {String(m).padStart(2, "0")}분
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-muted-foreground text-xs">
                날짜를 먼저 선택해주세요
              </p>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

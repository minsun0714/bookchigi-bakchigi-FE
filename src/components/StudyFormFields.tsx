import Markdown from "react-markdown";

import type { StudyCreateRequest } from "@/api/studies";
import DatePicker from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export interface StudyFormState {
  name: string;
  description: string;
  maxMembers: number;
  enrollmentStart?: Date;
  enrollmentEnd?: Date;
  isPublic: boolean;
}

type FieldErrors = Partial<Record<string, string>>;

interface StudyFormFieldsProps {
  state: StudyFormState;
  errors: FieldErrors;
  isPending: boolean;
  submitLabel: string;
  pendingLabel: string;
  onChange: (patch: Partial<StudyFormState>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function StudyFormFields({
  state,
  errors,
  isPending,
  submitLabel,
  pendingLabel,
  onChange,
  onSubmit,
  onCancel,
}: StudyFormFieldsProps) {
  const { name, description, maxMembers, enrollmentStart, enrollmentEnd, isPublic } = state;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* 스터디 이름 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground text-sm font-medium">
              스터디 이름 <span className="text-destructive">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="예: 매주 토요일 함께 읽는 독서 모임"
              className={`h-11 ${errors.name ? "border-destructive" : ""}`}
            />
            {errors.name && (
              <p className="text-destructive text-xs">{errors.name}</p>
            )}
          </div>

          {/* 설명 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                설명
                <span className="text-muted-foreground text-xs font-normal">
                  (Markdown 지원)
                </span>
              </label>
            </div>
            <div className="grid min-h-72 grid-cols-1 gap-3 sm:grid-cols-2">
              <textarea
                value={description}
                onChange={(e) => onChange({ description: e.target.value })}
                placeholder="스터디 목표, 진행 방식 등을 적어주세요. Markdown을 지원합니다."
                className="border-input bg-background placeholder:text-muted-foreground focus:ring-ring/50 min-h-72 resize-none rounded-lg border px-3 py-2.5 text-sm leading-relaxed outline-none focus:ring-2"
              />
              <div className="border-input bg-muted/30 prose prose-sm dark:prose-invert min-h-72 overflow-y-auto rounded-lg border px-3 py-2.5">
                {description ? (
                  <Markdown>{description}</Markdown>
                ) : (
                  <p className="text-muted-foreground italic">미리보기</p>
                )}
              </div>
            </div>
          </div>

          {/* 최대 인원 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground text-sm font-medium">
              최대 인원 <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              min={2}
              value={maxMembers}
              onChange={(e) => onChange({ maxMembers: Number(e.target.value) })}
              className={`h-11 w-32 ${errors.maxMembers ? "border-destructive" : ""}`}
            />
            {errors.maxMembers ? (
              <p className="text-destructive text-xs">{errors.maxMembers}</p>
            ) : (
              <p className="text-muted-foreground text-xs">최소 2명</p>
            )}
          </div>

          {/* 모집 기간 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-foreground text-sm font-medium">
                모집 시작일
              </label>
              <DatePicker
                value={enrollmentStart}
                onChange={(d) => onChange({ enrollmentStart: d })}
                placeholder="시작일 선택"
                showTime
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-foreground text-sm font-medium">
                모집 마감일
              </label>
              <DatePicker
                value={enrollmentEnd}
                onChange={(d) => onChange({ enrollmentEnd: d })}
                placeholder="마감일 선택"
                showTime
              />
              {errors.enrollmentEnd && (
                <p className="text-destructive text-xs">
                  {errors.enrollmentEnd}
                </p>
              )}
            </div>
          </div>

          {/* 공개 여부 */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-foreground text-sm font-medium">
                공개 스터디
              </span>
              <span className="text-muted-foreground text-xs">
                누구나 검색하고 참여할 수 있습니다
              </span>
            </div>
            <Switch checked={isPublic} onCheckedChange={(v) => onChange({ isPublic: v })} />
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onCancel}>
              취소
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? pendingLabel : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export { type FieldErrors, type StudyCreateRequest };

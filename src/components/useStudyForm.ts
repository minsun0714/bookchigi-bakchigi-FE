import { useState } from "react";

import { format } from "date-fns";
import { z } from "zod";

import type { StudyCreateRequest } from "@/api/studies";
import type { StudyFormState } from "@/components/StudyFormFields";

const schema = z
  .object({
    name: z.string().min(1, "스터디 이름을 입력해주세요"),
    maxMembers: z.number().min(2, "최소 2명 이상이어야 합니다"),
    enrollmentStart: z.date().optional(),
    enrollmentEnd: z.date().optional(),
  })
  .refine(
    (d) => {
      if (d.enrollmentStart && d.enrollmentEnd)
        return d.enrollmentEnd >= d.enrollmentStart;
      return true;
    },
    {
      message: "마감일은 시작일 이후여야 합니다",
      path: ["enrollmentEnd"],
    },
  );

type FieldErrors = Partial<Record<string, string>>;

function getErrors(state: StudyFormState): FieldErrors {
  const result = schema.safeParse(state);
  if (result.success) return {};
  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0]?.toString();
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}

function parseDate(value: string | undefined | null): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

interface UseStudyFormOptions {
  initialData?: {
    name?: string;
    description?: string;
    maxMembers?: number;
    enrollmentStart?: string;
    enrollmentEnd?: string;
    isPublic?: boolean;
  };
}

export function useStudyForm({ initialData }: UseStudyFormOptions = {}) {
  const [state, setState] = useState<StudyFormState>({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    maxMembers: initialData?.maxMembers ?? 4,
    enrollmentStart: parseDate(initialData?.enrollmentStart),
    enrollmentEnd: parseDate(initialData?.enrollmentEnd),
    isPublic: initialData?.isPublic ?? true,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState(false);

  const onChange = (patch: Partial<StudyFormState>) => {
    const next = { ...state, ...patch };
    setState(next);
    if (touched) setErrors(getErrors(next));
  };

  const validate = (): boolean => {
    setTouched(true);
    const fieldErrors = getErrors(state);
    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const buildRequest = (): StudyCreateRequest => ({
    name: state.name,
    description: state.description,
    maxMembers: state.maxMembers,
    enrollmentStart: state.enrollmentStart
      ? format(state.enrollmentStart, "yyyy-MM-dd'T'HH:mm:ss")
      : "",
    enrollmentEnd: state.enrollmentEnd
      ? format(state.enrollmentEnd, "yyyy-MM-dd'T'HH:mm:ss")
      : "",
    isPublic: state.isPublic,
  });

  return { state, errors, onChange, validate, buildRequest };
}

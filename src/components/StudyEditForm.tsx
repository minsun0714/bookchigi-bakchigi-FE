import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { type StudyDetail, updateStudy } from "@/api/studies";
import StudyFormFields from "@/components/StudyFormFields";
import { useStudyForm } from "@/components/useStudyForm";

interface StudyEditFormProps {
  studyId: number;
  initialData: StudyDetail;
}

export default function StudyEditForm({
  studyId,
  initialData,
}: StudyEditFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { state, errors, onChange, validate, buildRequest } = useStudyForm({
    initialData,
  });

  const mutation = useMutation({
    mutationFn: () => updateStudy(studyId, buildRequest()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study", String(studyId)] });
      toast.success("스터디가 수정되었습니다");
      navigate(`/studies/${studyId}`);
    },
    onError: () => toast.error("스터디 수정에 실패했습니다"),
  });

  const handleSubmit = () => {
    if (!validate()) return;
    mutation.mutate();
  };

  return (
    <StudyFormFields
      state={state}
      errors={errors}
      isPending={mutation.isPending}
      submitLabel="스터디 수정"
      pendingLabel="수정 중..."
      onChange={onChange}
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
    />
  );
}

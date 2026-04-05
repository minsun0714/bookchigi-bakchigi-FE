import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { createStudy } from "@/api/studies";
import StudyFormFields from "@/components/StudyFormFields";
import { useStudyForm } from "@/components/useStudyForm";

interface StudyCreateFormProps {
  isbn: string;
}

export default function StudyCreateForm({ isbn }: StudyCreateFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { state, errors, onChange, validate, buildRequest } = useStudyForm();

  const mutation = useMutation({
    mutationFn: () => createStudy(isbn, buildRequest()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studies", isbn] });
      toast.success("스터디가 생성되었습니다");
      navigate(`/books/${isbn}`);
    },
    onError: () => toast.error("스터디 생성에 실패했습니다"),
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
      submitLabel="스터디 등록"
      pendingLabel="등록 중..."
      onChange={onChange}
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
    />
  );
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

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
      navigate(`/books/${isbn}`);
    },
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

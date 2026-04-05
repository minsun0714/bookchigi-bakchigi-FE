import type { PageResponse } from "@/api/books";
import client from "@/api/client";

export interface Study {
  id: number;
  name: string;
  description: string;
  maxMembers: number;
  enrollmentStart: string;
  enrollmentEnd: string;
  isPublic: boolean;
  creatorNickname: string;
  createdAt: string;
}

export interface StudyCreateRequest {
  name: string;
  description: string;
  maxMembers: number;
  enrollmentStart: string;
  enrollmentEnd: string;
  isPublic: boolean;
}

export async function fetchStudies(
  isbn: string,
  page: number,
  size: number = 10,
): Promise<PageResponse<Study>> {
  const res = await client.get<PageResponse<Study>>(
    `/books/${isbn}/studies`,
    { params: { page: page || 0, size } },
  );
  return res.data;
}

export async function createStudy(
  isbn: string,
  body: StudyCreateRequest,
): Promise<Study> {
  const res = await client.post<Study>(`/books/${isbn}/studies`, body);
  return res.data;
}

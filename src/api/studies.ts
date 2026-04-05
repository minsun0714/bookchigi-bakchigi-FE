import type { Book, PageResponse } from "@/api/books";
import client from "@/api/client";

export type EnrollmentStatus = "UPCOMING" | "OPEN" | "CLOSED" | "ALWAYS";

export interface Study {
  id: number;
  name: string;
  description: string;
  maxMembers: number;
  enrollmentStart: string;
  enrollmentEnd: string;
  enrollmentStatus: EnrollmentStatus;
  isPublic: boolean;
  leaderNickname: string;
  createdAt: string;
}

export interface StudyMember {
  userId: number;
  nickname: string;
  isLeader: boolean;
  joinedAt: string;
}

export interface StudyDetail {
  id: number;
  name: string;
  description: string;
  maxMembers: number;
  enrollmentStart: string;
  enrollmentEnd: string;
  enrollmentStatus: EnrollmentStatus;
  isPublic: boolean;
  isCurrentUserLeader: boolean;
  isCurrentUserMember: boolean;
  createdAt: string;
  book: Book;
  members: StudyMember[];
}

export interface MyStudy {
  id: number;
  name: string;
  description: string;
  maxMembers: number;
  enrollmentStart: string;
  enrollmentEnd: string;
  enrollmentStatus: EnrollmentStatus;
  isPublic: boolean;
  myRole: "LEADER" | "MEMBER";
  joinedAt: string;
  book: Book;
}

export async function fetchMyStudies(
  role: "LEADER" | "MEMBER",
  page: number,
  size: number = 10,
): Promise<PageResponse<MyStudy>> {
  const res = await client.get<PageResponse<MyStudy>>("/users/me/studies", {
    params: { role, page: page || 0, size },
  });
  return res.data;
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

export async function fetchStudy(studyId: number): Promise<StudyDetail> {
  const res = await client.get<StudyDetail>(`/studies/${studyId}`);
  return res.data;
}

export async function updateStudy(
  studyId: number,
  body: StudyCreateRequest,
): Promise<StudyDetail> {
  const res = await client.put<StudyDetail>(`/studies/${studyId}`, body);
  return res.data;
}

export async function joinStudy(studyId: number): Promise<void> {
  await client.post(`/studies/${studyId}/join`);
}

export async function createStudy(
  isbn: string,
  body: StudyCreateRequest,
): Promise<Study> {
  const res = await client.post<Study>(`/books/${isbn}/studies`, body);
  return res.data;
}

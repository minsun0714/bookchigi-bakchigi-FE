import { BookOpenIcon, CrownIcon, UsersIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export default function MyPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8">
      <h1 className="text-foreground m-0 text-2xl font-bold tracking-tight">
        마이페이지
      </h1>

      {/* 내가 방장인 스터디 */}
      <section>
        <h2 className="text-foreground m-0 mb-4 flex items-center gap-2 text-lg font-semibold">
          <CrownIcon className="size-5" />
          내가 만든 스터디
        </h2>
        <Card>
          <CardContent className="text-muted-foreground flex flex-col items-center gap-2 py-12 text-center">
            <BookOpenIcon className="size-8 opacity-30" />
            <p className="text-sm">API 연동 예정</p>
          </CardContent>
        </Card>
      </section>

      {/* 내가 참여중인 스터디 */}
      <section>
        <h2 className="text-foreground m-0 mb-4 flex items-center gap-2 text-lg font-semibold">
          <UsersIcon className="size-5" />
          참여 중인 스터디
        </h2>
        <Card>
          <CardContent className="text-muted-foreground flex flex-col items-center gap-2 py-12 text-center">
            <BookOpenIcon className="size-8 opacity-30" />
            <p className="text-sm">API 연동 예정</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

import { type FormEvent, useState } from "react";

import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  defaultValue?: string;
}

export default function SearchBar({
  onSearch,
  defaultValue = "",
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl px-4">
      <div className="relative flex items-center">
        <SearchIcon className="text-muted-foreground pointer-events-none absolute left-3 size-5" />
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="책 제목, 저자, 출판사를 검색하세요"
          className="h-12 rounded-r-none pl-10 text-base"
        />
        <Button type="submit" className="h-12 rounded-l-none px-6">
          검색
        </Button>
      </div>
    </form>
  );
}

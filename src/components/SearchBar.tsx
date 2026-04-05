import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  defaultValue?: string;
}

export default function SearchBar({ onSearch, defaultValue = "" }: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-xl px-4">
      <div className="flex gap-2">
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="책 제목, 저자, 출판사를 검색하세요"
          className="h-12 flex-1"
        />
        <Button type="submit" className="h-12">검색</Button>
      </div>
    </form>
  );
}

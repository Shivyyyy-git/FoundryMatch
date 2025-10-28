import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search..." }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-9"
        data-testid="input-search"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={() => onChange("")}
          data-testid="button-clear-search"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

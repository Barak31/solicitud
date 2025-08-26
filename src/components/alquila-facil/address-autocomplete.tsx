"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

const mockAddresses = [
  "Calle Principal 123, Anytown, USA",
  "Avenida del Roble 456, Sometown, USA",
  "Camino del Pino 789, Yourtown, USA",
  "Paseo del Arce 101, Othertown, USA",
  "Calle del Abedul 212, Newville, USA",
  "Corte del Olmo 333, Oldtown, USA"
];

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  placeholder,
  className,
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { dictionary } = useLanguage();

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);
    onChange(newInputValue);

    if (newInputValue.length > 2) {
      const filteredSuggestions = mockAddresses.filter((address) =>
        address.toLowerCase().includes(newInputValue.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (address: string) => {
    setInputValue(address);
    onChange(address);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => {
            if (inputValue.length > 2 && suggestions.length > 0) setIsOpen(true)
        }}
        placeholder={placeholder || dictionary.rentalHistory.addressPlaceholder}
        autoComplete="off"
        suppressHydrationWarning
      />
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1">
          <Card className="shadow-lg">
            <CardContent className="p-2">
              <ul className="space-y-1">
                {suggestions.map((address, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(address)}
                    className="px-3 py-2 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground text-sm"
                  >
                    {address}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

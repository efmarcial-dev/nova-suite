'use client';

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandInput,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useState } from 'react';

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

interface StatusSelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export default function StatusSelect({ value, onChange }: StatusSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = STATUS_OPTIONS.find((s) => s.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-start relative min-h-[42px]">
          {selected ? (
            <Badge className="flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-green-100 text-green-700">
              {selected.label}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
              />
            </Badge>
          ) : (
            'Select status'
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search status..." />
          <CommandGroup>
            {STATUS_OPTIONS.map((status) => (
              <CommandItem
                key={status.value}
                value={status.label}
                onSelect={() => {
                  onChange(status.value);
                  setOpen(false);
                }}
              >
                {status.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

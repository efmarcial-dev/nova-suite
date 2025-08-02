"use client"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandInput
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {X, Plus} from 'lucide-react';
import { useState } from 'react';


interface Assignee {
    id: number;
    first_name: string;
}

interface AssigneeSelectProps {
    assignees: Assignee[];
    selectedAssigneeId: number | null;
    setSelectedAssigneeId: (id : number | null) => void;

}

export default function AssigneeSelect({
    assignees,
    selectedAssigneeId,
    setSelectedAssigneeId
}: AssigneeSelectProps) {

    const [open, setOpen] = useState(false);
    const selectedAssignee = assignees.find((a) => a.id === selectedAssigneeId);

    return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-start p-2 min-h-[42px] border-gray-300">
          {selectedAssignee ? (
            <Badge className="flex items-center gap-1 px-2 py-1 rounded-full text-sm text-sm bg-blue-100 text-blue-700">
              {selectedAssignee.first_name}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAssigneeId(null);
                }}
              />
            </Badge>
          ) : (
            "Select an assignee"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search assignees..." />
          <CommandEmpty>No projects found.</CommandEmpty>
          <CommandGroup>
            {assignees.map((assignee) => (
              <CommandItem
                key={assignee.id}
                value={assignee.first_name}
                onSelect={() => {
                  setSelectedAssigneeId(assignee.id);
                  setOpen(false);
                }}
              >
                {assignee.first_name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );


}
"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus} from "lucide-react";
import { useState } from "react";

interface Project {
  id: number;
  projectName: string;
}

interface ProjectSelectProps {
  projects: Project[];
  selectedProjectId: number | null;
  setSelectedProjectId: (id: number | null) => void;
  onAddProject?: () => void;
}

export default function ProjectSelect({
  projects,
  selectedProjectId,
  setSelectedProjectId,
  onAddProject
}: ProjectSelectProps) {
  const [open, setOpen] = useState(false);
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-start p-2 min-h-[42px] border-gray-300">
          {selectedProject ? (
            <Badge className="flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
              {selectedProject.projectName}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProjectId(null);
                }}
              />
            </Badge>
          ) : (
            "Select a project"
          )}
           {!selectedProject && onAddProject && (
            <button
              type="button"
              className="absolute right-2 top-1/2  p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              onClick={(e) => {
                e.stopPropagation();
                onAddProject();
              }}
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandEmpty>No projects found.</CommandEmpty>
          <CommandGroup>
            {projects.map((project) => (
              <CommandItem
                key={project.id}
                value={project.projectName}
                onSelect={() => {
                  setSelectedProjectId(project.id);
                  setOpen(false);
                }}
              >
                {project.projectName}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
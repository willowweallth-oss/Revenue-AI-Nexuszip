import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search } from "lucide-react";
import { useLocation } from "wouter";
import { navigationConfig } from "@/config/navigation";

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const allPages = navigationConfig.flatMap(section =>
    section.items.flatMap(item => {
      if (item.children) {
        return [item, ...item.children];
      }
      return [item];
    })
  );

  const handleSelect = (href: string) => {
    setLocation(href);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        className="h-9 px-3 text-sm text-muted-foreground hover:text-foreground justify-start gap-2 hidden md:flex rounded-xl min-w-[200px] lg:min-w-[240px]"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="md:hidden rounded-full h-9 w-9"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {navigationConfig.map((section) => (
            <CommandGroup key={section.title} heading={section.title}>
              {section.items.map((item) => (
                <div key={item.name}>
                  <CommandItem
                    onSelect={() => handleSelect(item.href)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </CommandItem>
                  {item.children?.map((child) => (
                    <CommandItem
                      key={child.name}
                      onSelect={() => handleSelect(child.href)}
                      className="flex items-center gap-2 cursor-pointer pl-8"
                    >
                      <child.icon className="h-3.5 w-3.5" />
                      <span className="text-sm">{child.name}</span>
                    </CommandItem>
                  ))}
                </div>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}

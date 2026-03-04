import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, Settings, User, LogOut, CreditCard, LifeBuoy } from "lucide-react";
import type { User as UserType } from "@shared/schema";

interface UserProfileDropdownProps {
  user: UserType;
}

export function UserProfileDropdown({ user }: UserProfileDropdownProps) {
  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12 px-2 hover:bg-secondary/50 rounded-xl"
        >
          <Avatar className="h-8 w-8 border border-border/50">
            <AvatarImage src={user.avatarUrl || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start flex-1 text-sm overflow-hidden">
            <span className="font-medium truncate w-full">{user.name}</span>
            <span className="text-xs text-muted-foreground truncate w-full">{user.company}</span>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer gap-2">
          <User className="h-4 w-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer gap-2">
          <Settings className="h-4 w-4" /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer gap-2">
          <CreditCard className="h-4 w-4" /> Billing
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer gap-2">
          <LifeBuoy className="h-4 w-4" /> Support
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer gap-2 text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

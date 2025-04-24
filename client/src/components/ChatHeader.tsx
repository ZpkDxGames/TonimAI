import { useState } from "react";
import { MoreVertical, Settings, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import profileImage from "@/assets/profile.png";

export default function ChatHeader() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };
  
  const openSettingsModal = () => {
    setIsSettingsModalOpen(true);
    setIsSettingsOpen(false);
  };
  
  return (
    <header className="flex items-center justify-between p-4 bg-primary shadow-sm">
      <div className="flex items-center">
        <Avatar className="w-10 h-10 bg-white shadow-sm">
          <AvatarImage src={profileImage} alt="Tonim Avatar" />
          <AvatarFallback className="bg-white text-primary">TM</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <h1 className="text-white font-semibold">Tonim</h1>
        </div>
      </div>
      
      <DropdownMenu open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DropdownMenuTrigger asChild>
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-light text-white"
            onClick={toggleSettings}
          >
            <MoreVertical size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>New Chat</DropdownMenuItem>
          <DropdownMenuItem>Clear History</DropdownMenuItem>
          <DropdownMenuItem onClick={openSettingsModal}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <span className="text-sm text-muted-foreground">Enable dark theme</span>
              </div>
              <Switch id="dark-mode" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="notifications">Notifications</Label>
                <span className="text-sm text-muted-foreground">Enable message notifications</span>
              </div>
              <Switch id="notifications" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="sound">Sound</Label>
                <span className="text-sm text-muted-foreground">Play sound on new messages</span>
              </div>
              <Switch id="sound" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}

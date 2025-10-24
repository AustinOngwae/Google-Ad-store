import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  progress: number;
  message: string;
}

export const LoadingScreen = ({ progress, message }: LoadingScreenProps) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50 p-4">
      <div className="flex items-center mb-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
        <h1 className="text-2xl font-bold text-foreground">Loading AdFeed</h1>
      </div>
      <div className="w-full max-w-sm">
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground mt-2 text-center">{message}</p>
      </div>
    </div>
  );
};
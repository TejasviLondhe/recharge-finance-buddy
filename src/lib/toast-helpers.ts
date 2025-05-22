
import { useToast } from "@/hooks/use-toast";

// Helper to create consistent toast message formats
export const createToastMessage = (title: string, description?: string) => {
  return {
    title,
    description,
    duration: 5000, // 5 seconds by default
  };
};

// Wrapper for the toast hook to add success/error methods
export const useToastHelper = () => {
  const { toast } = useToast();
  
  return {
    toast,
    success: (title: string, description?: string) => {
      return toast({
        ...createToastMessage(title, description),
        variant: "default",
        className: "bg-green-500 text-white border-green-600",
      });
    },
    error: (title: string, description?: string) => {
      return toast({
        ...createToastMessage(title, description),
        variant: "destructive",
      });
    }
  };
};

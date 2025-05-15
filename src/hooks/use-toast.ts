
// This file exists to re-export from the shadcn components
// so that we can use the toast functionality across the app

import { useToast as useToastUI, toast as toastUI } from "@/components/ui/use-toast";

export const useToast = useToastUI;
export const toast = toastUI;

export const useToastHandler = () => {
  const toast = useToast();

  const handleError = (message = "An error occurred") => {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 5000,
    });
  };

  const handleSuccess = (message: string) => {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 3000,
    });
  };

  const handleWarn = (message: string) => {
    toast.add({
      severity: "warn",
      detail: message,
      life: 3000,
    });
  };

  return {
    handleError,
    handleSuccess,
    handleWarn,
  };
};

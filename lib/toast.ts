import { toast } from "sonner";

const toastError = (message: string, description?: string) => {
	toast.error(message, {
		description,
		style: {
			backgroundColor: "red",
			color: "white",
		},
	});
};

const toastSuccess = (message: string, description?: string) => {
	toast.success(message, {
		description,
		style: {
			backgroundColor: "green",
			color: "white",
		},
	});
};

export { toastError, toastSuccess };

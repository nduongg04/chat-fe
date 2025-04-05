"use client";

import { toast as sonnerToast } from "sonner";

// Export toast chính từ sonner
export const toast = sonnerToast;

// Toast error với style mặc định
export const toastError = (title: string, description?: string) => {
	sonnerToast.error(title, {
		description,
		style: {
			backgroundColor: '#ef4444', // bg-red-500
			color: 'white',
			border: 'none',
		},
		className: 'toast-error',
	});
};

// Toast success với style mặc định
export const toastSuccess = (title: string, description?: string) => {
	sonnerToast.success(title, {
		description,
		style: {
			backgroundColor: '#22c55e', // bg-green-500
			color: 'white',
			border: 'none',
		},
		className: 'toast-success',
	});
};

// Toast info với style mặc định
export const toastInfo = (title: string, description?: string) => {
	sonnerToast.info(title, {
		description,
		style: {
			backgroundColor: '#3b82f6', // bg-blue-500
			color: 'white',
			border: 'none',
		},
		className: 'toast-info',
	});
};

// Toast warning với style mặc định
export const toastWarning = (title: string, description?: string) => {
	sonnerToast.warning(title, {
		description,
		style: {
			backgroundColor: '#f59e0b', // bg-yellow-500
			color: 'white',
			border: 'none',
		},
		className: 'toast-warning',
	});
};

import type { Database } from './database.types';

export type RatingObject = Database['public']['Tables']['ratings']['Row'];

export type FormInput = {
	email: string;
	password: string;
};

export type LoginFormData = {
	email: string;
	password: string;
};

export type RegisterFormData = {
	email: string;
	password: string;
};

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

export type RatingValue =
	| '1'
	| '2'
	| '3'
	| '4'
	| '5'
	| '6'
	| '7'
	| '8'
	| '9'
	| '10'
	| null
	| undefined;

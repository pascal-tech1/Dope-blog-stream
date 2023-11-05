import * as Yup from "yup";

export const formSchema = Yup.object().shape({
	title: Yup.string()
		.required("Title is required.")
		.min(3, "title is too short - should be 3 minimum"),
	description: Yup.string()
		.required("Description is required.")
		.min(100, "Description is too short - should be 50 minimum"),

	image: Yup.mixed()
		.required("Image is required")
		.test(
			"fileSize",
			"File size too large",
			(value) => value && value.size <= 1024000
		), // Adjust the file size limit as needed,
});
export const isEditingFormSchema = Yup.object().shape({
	title: Yup.string().min(3, "title is too short - should be 3 minimum"),
	description: Yup.string().min(
		100,
		"Description is too short - should be 50 minimum"
	),
});

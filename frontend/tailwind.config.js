// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				helvetica: ['"Geologica"'],
			},
			colors: {
				dark: {
					background: "#242424",
					// ... and so on for other properties
				},
			},
		},
	},
	plugins: [],
};

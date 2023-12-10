import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import customFetch from "./axios";
import { store } from "../redux/Store";
import { uptimizeCloudinaryImage } from "./imageCloudinaryOptimizer";
import { toast } from "react-toastify";

const toolbarOptions = [
	["bold", "italic", "underline", "strike"], // toggled buttons
	["blockquote", "code-block"],

	// [{ header: 1 }, { header: 2 }], // custom button values
	[{ list: "ordered" }, { list: "bullet" }],
	[{ script: "sub" }, { script: "super" }], // superscript/subscript
	[{ indent: "-1" }, { indent: "+1" }], // outdent/indent
	[{ direction: "rtl" }], // text direction

	// [{ size: ["small", false, "large", "huge"] }], // custom dropdown
	[{ header: [1, 2, 3, 4, 5, 6, false] }],

	[{ color: [] }, { background: [] }], // dropdown with defaults from theme

	[{ align: [] }],
	["link", "image", "video"],

	["clean"], // remove formatting button
];
export const modules = {
	toolbar: toolbarOptions,
	blotFormatter: {
		// see config options below
	},
	imageUploader: {
		upload: (file) => {
			return new Promise((resolve, reject) => {
				const formData = new FormData();
				formData.append("image", file);

				customFetch
					.post(
						`/posts/upload-image`,
						formData,

						{
							headers: {
								"Content-Type": "multipart/form-data",
								Authorization: `Bearer ${
									store.getState().userSlice.token
								} `,
							},
						}
					)

					.then((result) => {
						console.log(result);
						resolve(
							uptimizeCloudinaryImage(
								"f_auto,q_auto,w_400",
								result.data.url
							)
						);
					})
					.catch((error) => {
						reject("Upload failed");
						console.error("Error:", error);
						toast.error("upload failed");
					});
			});
		},
	},
};

export const formats = [
	"header",
	"bold",
	"italic",
	"underline",
	"strike",
	"blockquote",
	"list",
	"bullet",
	"indent",
	"link",
	"image",
	"imageBlot", // #5 Optinal if using custom formats
];

// modules = {
//     // #3 Add "image" to the toolbar
//     toolbar: [
//       [{ header: [1, 2, false] }],
//       ["bold", "italic", "underline", "strike", "blockquote"],
//       [
//         { list: "ordered" },
//         { list: "bullet" },
//         { indent: "-1" },
//         { indent: "+1" }
//       ],
//       ["link", "image"],
//       ["clean"]
//     ],
//     // # 4 Add module and upload function
//     imageUploader: {
//       upload: (file) => {
//         return new Promise((resolve, reject) => {
//           const formData = new FormData();
//           formData.append("image", file);

//           fetch(
//             "https://api.imgbb.com/1/upload?key=334ecea9ec1213784db5cb9a14dac265",
//             {
//               method: "POST",
//               body: formData
//             }
//           )
//             .then((response) => response.json())
//             .then((result) => {
//               console.log(result);
//               resolve(result.data.url);
//             })
//             .catch((error) => {
//               reject("Upload failed");
//               console.error("Error:", error);
//             });
//         });
//       }
//     }
//   };

// export const handleQuillChange = (content, delta, source, editor) => {
// 	// Check if the change was from user input (not programmatically)
// 	if (source === "user") {
// 		// Extract the base64 data from the inserted image
// 		const matches = content.match(
// 			/src="data:image\/[^;]+;base64,([^"]+)"/
// 		);
// 		if (matches && matches[1]) {
// 			const base64Data = matches[1];
// 			console.log(base64Data);

// 			// Send base64 image data to backend
// 		}
// 	}
// };

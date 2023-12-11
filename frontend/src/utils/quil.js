import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import customFetch from "./axios";
import { store } from "../redux/Store";
import { uptimizeCloudinaryImage } from "./imageCloudinaryOptimizer";
import { toast } from "react-toastify";
import BlotFormatter, {
	AlignAction,
	DeleteAction,
	ImageSpec,
} from "quill-blot-formatter";

const toolbarOptions = [
	["bold", "italic", "underline", "strike"], // toggled buttons
	["blockquote", "code-block"],
	[{ list: "ordered" }, { list: "bullet" }],
	[{ script: "sub" }, { script: "super" }],
	[{ indent: "-1" }, { indent: "+1" }],
	[{ direction: "rtl" }],
	[{ header: [1, 2, 3, 4, 5, 6, false] }],
	[{ color: [] }, { background: [] }],
	[{ align: [] }],
	["link", "image", "video", "iframeVideo"], // Include the new "iframeVideo" button
	["clean"],
];
class CustomImageSpec extends ImageSpec {
	getActions() {
		return [AlignAction, DeleteAction];
	}
}
export const modules = {
	toolbar: toolbarOptions,
	blotFormatter: {
		overlay: {
			style: {
				border: "2px solid blue",
			},
		},
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
						resolve(
							uptimizeCloudinaryImage(
								"f_auto,q_auto,w_800",
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

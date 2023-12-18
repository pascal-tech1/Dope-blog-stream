import customFetch from "./axios";
import { store } from "../redux/Store";
import { uptimizeCloudinaryImage } from "./imageCloudinaryOptimizer";
import { toast } from "react-toastify";
import hljs from "highlight.js";
import "highlight.js/styles/monokai-sublime.css";

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
	["link", "image", "video"], // Include the new "iframeVideo" button
	["clean"],
];

hljs.configure({
	// optionally configure hljs
	languages: ["javascript", "ruby", "python"],
});

export const modules = {
	syntax: {
		highlight: (text) => hljs.highlightAuto(text).value,
	},
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

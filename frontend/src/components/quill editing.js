

	// Insert Image(selected by user) to quill
	const insertToEditor = (url) => {
		const range = quill.getSelection();
		quill.insertEmbed(range.index, "image", url);
	};

	// Upload Image to Image Server such as AWS S3, Cloudinary, Cloud Storage, etc..
	const saveToServer = async (file) => {
		const body = new FormData();
		body.append("image", file);

		const resp = await customFetch.post(
			`/posts/upload-image`,
			body,

			{
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token} `,
				},
			}
		);

		const uptimizedImgStr = uptimizeCloudinaryImage(
			"f_auto,q_auto,w_400",
			resp.data.url
		);
		insertToEditor(uptimizedImgStr);
	};

	// Open Dialog to select Image File
	const selectLocalImage = () => {
		const input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("accept", "image/*");
		input.click();

		input.onchange = () => {
			const file = input.files[0];
			saveToServer(file);
		};
	};

	useEffect(() => {
		if (quill) {
			// Add custom handler for Image Upload
			console.log(quill.getContents());
			console.log(quill.root.innerHTML);
			quill.getModule("toolbar").addHandler("image", selectLocalImage);
		}
	}, [quill]);
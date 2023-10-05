const fetchAllPostsCtrl = expressAsyncHandler(async (req, res) => {
	let page = parseInt(req?.query?.page) || 1; // Current page,ipco
	// const seed = req?.query?.seed;
	const postNumberPerPage = parseInt(req?.query?.postNumberPerPage) || 10; // Number of items per page

	// Calculate the skip value to skip items on previous pages
	let skip = (page - 1) * postNumberPerPage;
	try {
		const seed = "humbletylameu";
		const totalPosts = await Post.countDocuments();
		const generator = seedrandom(seed);
		min = 0;
		max = totalPosts;
		const sample = Math.floor(generator() * (max - min) + min);

		const AllpostId = await Post.find({}).select("_id");
		// Get the sample document ID.
		const sampleDocumentId = AllpostId[sample];

		// Use the `find` method to generate all document IDs less than the sample document ID, limited to the page size.
		const documentsBeforeSample = await Post.find({
			_id: { $lt: sampleDocumentId },
		})
			.sort({ _id: -1 })
			.skip(skip)
			.limit(postNumberPerPage);

		// Define documentsAfterSample outside the if block
		let documentsAfterSample;
		console.log("length", documentsBeforeSample.length);
		// Use the `find` method to generate all document IDs greater than the sample document ID, limited to the page size, minus the number of documents returned by the `documentsBeforeSample` variable.
		if (documentsBeforeSample.length < postNumberPerPage) {
			const newPage = page - Math.floor(sample / postNumberPerPage);
			const newNumberPerPage =
				postNumberPerPage - documentsBeforeSample.length;
			const newSkip = (newPage - 1) * newNumberPerPage;
			documentsAfterSample = await Post.find({
				_id: { $gt: sampleDocumentId },
			})
				.sort({ _id: 1 })
				.skip(newSkip)
				.limit(postNumberPerPage - documentsBeforeSample.length);
		}

		// Define an empty array as the default value if documentsAfterSample is not set
		if (!documentsAfterSample) {
			documentsAfterSample = [];
		}

		console.log("sample", sample);
		console.log(documentsBeforeSample.length, documentsAfterSample.length);
		// Concatenate the two arrays and send the response
		res.json([...documentsBeforeSample, ...documentsAfterSample]);
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});
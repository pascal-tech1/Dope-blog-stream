const filterCriteria = (filter) => {
	if (filter === "Highest likes") return { likes: -1 };
	if (filter === "Lowest likes") return { likes: 1 };
	if (filter === "Latest") return { createdAt: 1 };
	if (filter === "Oldest") return { createdAt: -1 };
	if (filter === "A-Z") return { title: 1 };
	if (filter === "Z-A") return { title: -1 };
	if (filter === "Lowest view") return { numViews: 1 };
	if (filter === "Highest view") return { numViews: -1 };
	if (filter === "Highest dislikes") return { disLikes: -1 };
	if (filter === "Lowest dislikes") return { disLikes: 1 };
	if (filter === "Category") return { category: 1 };

	return {}; // Default case: no sorting
};
module.exports = filterCriteria;

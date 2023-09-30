import React from "react";
import {
	fetchAllPost,
	searchPost,
	setSearchPage,
} from "../redux/post/allPostSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { EditPostBtn, FollowingBtn, Spinner } from "../components";
import CategoryandLikes from "../components/CategoryandLikes";

const AllPost = () => {
	const dispatch = useDispatch();
	const { allPost, isLoading, searchQuery, hasMore } = useSelector(
		(store) => store.allPostSlice
	);
	const user = useSelector((store) => store?.userSlice?.user?.user);

	useEffect(() => {
		allPost && dispatch(fetchAllPost());
	}, []);

	const observer = useRef();
	const lastBookElementRef = useCallback(
		(node) => {
			if (isLoading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					dispatch(setSearchPage());
					if (searchQuery) {
						dispatch(searchPost());
					} else {
						dispatch(fetchAllPost());
					}
				}
			});
			if (node) observer.current.observe(node);
		},
		[isLoading, hasMore]
	);

	return (
		<>
			{allPost.map((post, index) => {
				allPost.length === index + 1;
				return (
					<div
						key={index}
						ref={allPost.length === index + 1 ? lastBookElementRef : null}
						className=" border-t my-6 flex  flex-col md:flex-row gap-4 justify-between items-centers"
					>
						<div className="flex flex-col mt-3 mb-2 justify-self-center">
							{/* user who created the post  */}
							<div className="flex text-xs gap-3 text-gray-400">
								<Link to="/user-profile">
									<img
										src={post?.user?.profilePhoto}
										alt=""
										className="w-8 h-8 rounded-full "
									/>
								</Link>
								<div className="flex gap-1 flex-col">
									<h3>
										{` ${post?.user?.firstName} ${post?.user?.lastName}  `}
									</h3>

									{user?._id !== post?.user?._id ? (
										<FollowingBtn userToFollowOrUnfollow={post?.user} />
									) : (
										<EditPostBtn postId={post?._id} />
									)}
								</div>
							</div>

							<div className="flex  flex-col md:flex-row justify-centers gap-4 mt-3">
								<div className=" self-start">
									<h3 className=" font-semibold text-lg mb-2 ">
										{post?.title}
									</h3>
									<div className=" text-xs flex ">
										<p>
											{post?.description}
											{"..."}
											<Link
												to={`/single-post/${post?._id}`}
												className="ml-1 text-blue-300 hover:text-blue-400 transition-all cursor-pointer"
											>
												Read more
											</Link>
										</p>
									</div>
									<div className="text-md md:text-sm ">
										<CategoryandLikes post={post} />
									</div>
								</div>
								<div className=" self-center md:self-start ">
									<img
										className=" max-w-xs w-52  md:w-40  rounded-md"
										src={post?.image}
										alt=""
									/>
								</div>
							</div>
						</div>
					</div>
				);
				//
			})}
			<div className=" grid place-content-center">
				{isLoading && <Spinner />}
			</div>
			<div>{!hasMore && <h3>No more Post</h3>}</div>
		</>
	);
};

export default AllPost;

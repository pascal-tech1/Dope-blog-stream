import React from "react";
import { fetchAllPost, fetchSinglePost } from "../redux/post/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/dataFormatter";

const AllPost = () => {
	const dispatch = useDispatch();
	const { allPost, isLoading } = useSelector(
		(store) => store.allPostSlice
	);
	useEffect(() => {
		dispatch(fetchAllPost());
	}, []);

	return (
		<div>
			{allPost?.map((post, index) => {
				if (!allPost) {
					return (
						<div>
							{allPost?.appErr ? (
								<h1>{allPost.appErr}</h1>
							) : (
								<h1>{allPost.serverErr}</h1>
							)}
						</div>
					);
				}

				return (
					<div
						key={index}
						className=" border-t my-6 flex flex-col md:flex-row gap-4 justify-between items-centers"
					>
						<div className="flex flex-col mt-3 mb-2 justify-self-center">
							{/* user who created the post  */}
							<Link
								to="/user-profile"
								className="flex text-xs gap-3 text-gray-400"
							>
								<img
									src={post?.user?.profilePhoto}
									alt=""
									className="w-8 h-8 rounded-full "
								/>

								<div>
									<h3 className="">{formatDate(post?.createdAt)}</h3>
									<h3>
										{` ${post?.user?.firstName} ${post?.user?.lastName}  `}
									</h3>
								</div>
							</Link>

							<div className="flex  flex-col md:flex-row justify-centers gap-8 mt-3">
								<div className=" self-start">
									<h3 className=" font-semibold text-lg mb-3 ">
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
								</div>
								<div className=" self-center md:self-start">
									<img
										className=" max-w-xs w-52 rounded-md"
										src={post?.image}
										alt=""
									/>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default AllPost;

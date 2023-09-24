import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchSinglePost } from "../redux/post/postSlice";
import { Link, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { formatDate } from "../utils/dataFormatter";

const SinglePost = () => {
	const { id } = useParams();
	const { post } = useSelector((store) => store.allPostSlice);
	const dispatch = useDispatch();
	console.log(post);
	useEffect(() => {
		dispatch(fetchSinglePost(id));
	}, []);

	return (
		<div className=" mt-16 ">
			<NavBar />
			<div className=" mx-6 mt-8 font-inter flex flex-col  lg:mx-auto max-w-[50rem] gap-[0.5rem]">
				<div>
					<h1 className=" font-bold text-2xl my-4">{post?.title}</h1>
				</div>
				{/* about the user who created the post */}
				<div className="flex flex-wrap">
					<div className="flex text-xs gap-3 text-gray-400 ">
					<Link
					to="/user-profile"
					 className="flex gap-2">
					<img
							src={post?.user?.profilePhoto}
							alt=""
							className="w-8 h-8 rounded-full "
						/>

						<div>
							<h3 className="">{formatDate(post?.createdAt)}</h3>
							<h3>{` ${post?.user?.firstName} ${post?.user?.lastName}  `}</h3>
						</div>
					</Link>
						<button className=" self-center py-1 border hover:bg-gray-600 text-md outline-none bg-gray-900 transition-all rounded-full  px-2">
							following
						</button>
					</div>
					<button className="  hover:bg-gray-100 hover:border mt-3 md:mt-0 py-1 hover:border-gray-300 transition-all md:ml-auto px-2 text-black outline-none rounded-full border border-blue-400">
						{post?.category}
					</button>
				</div>
				<div className=" rounded-md my-4">
					<img
						src={post?.image}
						alt=""
						className=" w-full h-64  rounded-lg"
					/>
				</div>
				<div
					className=" "
					dangerouslySetInnerHTML={{ __html: post?.content }}
				></div>
			</div>
		</div>
	);
};

export default SinglePost;

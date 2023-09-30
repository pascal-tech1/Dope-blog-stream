import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSinglePost } from "../redux/post/singlePostSlice";
import { Link, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { formatDate } from "../utils/dataFormatter";
import { FollowingBtn, EditPostBtn, Spinner } from "../components";
import CategoryandLikes from "../components/CategoryandLikes";
import { LoadingSpinner } from "../utils/Spinner";

const SinglePost = () => {
	const { id } = useParams();
	const { post, status } = useSelector((store) => store.singlePostSlice);
	const dispatch = useDispatch();
	const user = useSelector((store) => store?.userSlice?.user?.user);

	useEffect(() => {
		if (!post) {
			dispatch(fetchSinglePost(id));
		} else if (post.id !== id) {
			dispatch(fetchSinglePost(id));
		}
	}, [id]);
	if (status === "loading") {
		return (
			<div className=" grid place-content-center mt-8">
				<Spinner />
			</div>
		);
	}
	if (status === "error") {
		return (
			<div className=" text-red-600">failed to fetch Post try again</div>
		);
	}
	return (
		<div className="">
			<NavBar />
			<div className=" mt-16 mx-6 font-inter flex flex-col  lg:mx-auto max-w-[50rem] gap-[0.5rem]">
				<div>
					<h1 className=" font-bold text-2xl my-4">{post?.title}</h1>
				</div>
				{/* about the user who created the post */}
				<div className="flex flex-wrap   flex-col">
					<div className="flex text-xs gap-3 text-gray-400 ">
						<Link to="/user-profile" className="flex gap-2">
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
						{/* if its not the user that created the post render the follow button else render theedit button */}
						{user?._id !== post?.user?._id ? (
							<FollowingBtn userToFollowOrUnfollow={post?.user} />
						) : (
							<EditPostBtn post={post} postId={post?._id} />
						)}
					</div>
					<CategoryandLikes post={post} />
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

import { GET_POSTS } from "../queries";
import { MainModal } from "./modal";
import { Post } from "../__generated__/graphql";
import { useState } from "react";
import { useQuery } from "@apollo/client";

type ExtendedPostProps = Post & {
  isNew?: boolean;
};

type PostItemProps = {
  post: ExtendedPostProps;
  setPostId: (param: string) => void;
  handleModal: (param: string) => void;
};

const PostItem = ({ post, setPostId, handleModal }: PostItemProps) => {
  const handleClick = (id: string) => {
    setPostId(id)
    handleModal("edit")
  };

  return (
    <div
      className={`${
        post.isNew ? `bg-secondary` : `bg-white `
      } cursor-pointer rounded-md px-2 py-1 mt-4`}
      onClick={() => handleClick(post.id!)}
    >
      <h2>{`${post.id} -> ${post.title}`}</h2>
      <p className="text-dark-body text-sm m-0">{post.body}</p>
    </div>
  );
};

export const Main = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [postId, setPostId] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [purpose, setPurpose] = useState<string>("create");

  const { loading, error, data } = useQuery(GET_POSTS, {
    variables: {
      options: { slice: { limit: 10 }, sort: { field: "id", order: "DESC" } },
    },
    onCompleted: () => {
      setPosts(
        data?.posts?.data.map((post: Post) => {
          return {
            ...post,
            isNew: false,
          };
        })
      );
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const handleModal = (purpose: string) => {
    setOpenModal(true);
    setPurpose(purpose);
  };

  const sortedPosts: Post[] = posts.sort((a, b) => {
    if (Number(a.id) < Number(b.id)) {
      return 1;
    }
    if (Number(a.id) > Number(b.id)) {
      return -1;
    }
    return 0;
  });

  return (
    <>
      <div className="flex flex-col h-screen">
        <header className="h-16 bg-header p-4">
          <h2 className="text-dark-body text-lg">Posts</h2>
        </header>
        <main className="flex-grow overflow-auto flex-col-reverse bg-body">
          <div className="px-4 py-4">
            {sortedPosts.slice(0, 10).map((post) => (
              <PostItem key={post.id} post={post} setPostId={setPostId} handleModal={handleModal} />
            ))}
          </div>
        </main>
        <footer className="h-40 bg-header">
          <div className="px-2 py-4 flex flex-col gap-2">
            <div>
              <button
                className="bg-white text-dark-body text-sm px-4 py-2 border-light-body border-2 border-solid rounded-xl"
                onClick={() => handleModal("create")}
              >
                Create a new post
              </button>
            </div>
          </div>
        </footer>
      </div>
      <MainModal
        openModal={openModal}
        postId={postId}
        posts={posts}
        purpose={purpose}
        setOpenModal={setOpenModal}
        setPosts={setPosts}
        setPurpose={setPurpose}
      />
    </>
  );
};

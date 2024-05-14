import { Button, Label, Modal, TextInput, Textarea } from "flowbite-react";
import { CREATE_POST, DELETE_POST, GET_POST, UPDATE_POST } from "../queries";
import { Post } from "../__generated__/graphql";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

interface props {
  openModal: boolean;
  postId: string;
  posts: Post[];
  purpose: string;
  setOpenModal: (param: boolean) => void;
  setPosts: (param: Post[]) => void;
  setPurpose: (param: string) => void;
}

export function MainModal({
  openModal,
  postId,
  posts,
  purpose,
  setOpenModal,
  setPosts,
  setPurpose,
}: props) {
  const [createPost] = useMutation(CREATE_POST);
  const [deletePost] = useMutation(DELETE_POST);
  const [singlePost, setSinglePost] = useState<Post>({});
  const { register, handleSubmit } = useForm();
  const [updatePost] = useMutation(UPDATE_POST);

  const { error, data } = useQuery(GET_POST, {
    variables: {
      id: postId.toString(),
    },
    onCompleted: () => {
      setSinglePost(data?.post);
    },
    onError: () => {
      console.log(JSON.stringify(error, null, 2));
    },
  });

  const onCancel = () => {
    setOpenModal(false);
    setPurpose("create");
  };

  const onDelete = handleSubmit(() => {
    deletePost({ variables: { id: postId.toString() } }).then((result) => {
      const remainingPosts = posts.filter((post) => postId !== post.id)!;
      result.data.deletePost === true && setPosts(remainingPosts);
      setOpenModal(false);
    });
  });

  const onSubmit = handleSubmit((data) => {
    createPost({ variables: { input: data } }).then((result) => {
      result.data.createPost.id = (Number(posts[0]?.id) + 1).toString();
      const newItem = { ...result.data.createPost, isNew: true };
      setPosts([newItem, ...posts]);
      setOpenModal(false);
    });
  });

  const onUpdate = handleSubmit((data) => {
    updatePost({ variables: { id: postId.toString(), input: data } }).then(
      (result) => {
        const targetPost = posts.find((post) => postId === post.id)!;
        targetPost.title = result.data.updatePost.title;
        targetPost.body = result.data.updatePost.body;
        setOpenModal(false);
      }
    );
  });

  return (
    <>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>
          {purpose === "create" ? "New" : "Edit"} post
        </Modal.Header>
        <Modal.Body>
          <form className="flex flex-col gap-3 p-2.5 w-full">
            <div>
              <div className="mb-2 block">
                <Label
                  className="font-normal"
                  htmlFor="title"
                  key="label-title"
                  value="Title"
                />
              </div>
              {purpose === "create" ? (
                <TextInput
                  autoFocus
                  id="title"
                  {...register("title")}
                  required
                  type="text"
                />
              ) : (
                <TextInput
                  autoFocus
                  id="title"
                  {...register("title")}
                  required
                  type="text"
                  placeholder={singlePost?.title || ""}
                />
              )}
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  className="font-normal"
                  htmlFor="body"
                  key="label-body"
                  value="Description"
                />
              </div>
              {purpose === "create" ? (
                <Textarea
                  id="body"
                  placeholder="Write a cool description..."
                  {...register("body")}
                  required
                  rows={4}
                />
              ) : (
                <Textarea
                  id="body"
                  placeholder={singlePost?.body || ""}
                  {...register("body")}
                  required
                  rows={4}
                />
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="success"
            onClick={() => (purpose === "create" ? onSubmit() : onUpdate())}
          >
            Save
          </Button>
          <Button color="failure" onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button color="warning" onClick={() => onDelete()}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

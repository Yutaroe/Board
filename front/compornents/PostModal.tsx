import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOpenNewPost,
  resetOpenNewPost,
  fetchAsyncNewPosts,
  fetchAsyncPutPost,
} from "../src/features/post/postSlice";
import { useForm } from "react-hook-form";
import { File } from "../src/features/types";

import { Button, TextField } from "@material-ui/core";

interface Post {
  title: string;
  contents: string;
  image?: File | null;
}

const customStyles = {
  content: {
    top: "55%",
    left: "50%",

    width: 700,
    height: 700,
    padding: "50px",

    transform: "translate(-50%, -50%)",
  },
};

// Modal.setAppElement("#__next");

const PostModal = (props: any) => {
  const openNewPost = useSelector(selectOpenNewPost);
  const dispatch = useDispatch();
  const post = props.post;

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: Post) => {
    if (post.post_id) {
      dispatch(fetchAsyncPutPost({ id: post.post_id, data }));
    } else {
      dispatch(fetchAsyncNewPosts(data));
    }
    dispatch(resetOpenNewPost());
    reset();
  };

  return (
    <>
      <Modal
        isOpen={openNewPost}
        onRequestClose={() => {
          dispatch(resetOpenNewPost());
        }}
        style={customStyles}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-3xl">{post.post_id ? "編集" : "新規投稿"}</h1>
          <TextField
            fullWidth
            id="title"
            type="text"
            label="タイトル(50文字以内)"
            margin="normal"
            defaultValue={post.title ? post.title : ""}
            {...register("title", { required: true })}
          />

          <TextField
            fullWidth
            multiline
            rows={20}
            id="contents"
            label="内容"
            margin="normal"
            defaultValue={post.contents ? post.contents : ""}
            {...register("contents", { required: true })}
          />

          <div className="text-center my-5">
            <Button
              variant="contained"
              size="large"
              color="primary"
              type="submit"
            >
              {post.post_id ? "編集する" : "投稿する"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default PostModal;

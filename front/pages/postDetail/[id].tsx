import Header from "../../compornents/Header";
import { useRouter } from "next/router";
import {
  selectPosts,
  selectComments,
  fetchAsyncPostComments,
  fetchAsyncDelete,
  setOpneNewPost,
} from "../../src/features/post/postSlice";
import {
  selectProfiles,
  selectProfile,
} from "../../src/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import { Button, TextField } from "@material-ui/core";
import { useForm } from "react-hook-form";

interface COMMENT {
  contents: string;
}

const Detail = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();

  const posts = useSelector(selectPosts);
  const comments = useSelector(selectComments);
  const profiles = useSelector(selectProfiles);
  const myProf = useSelector(selectProfile);

  const post = posts.find((post) => post.post_id === id);
  const profile = profiles.find((prof) => prof.profileUser === post?.postUser);
  const comment = comments.filter((comment) => comment.post === post?.post_id);

  const { register, handleSubmit, reset } = useForm();
  const onSubmit = async (data: COMMENT) => {
    let comment = {
      contents: "",
      post: "",
    };

    comment.contents = data.contents;
    if (post && post.post_id) {
      comment.post = post.post_id;
    }
    dispatch(fetchAsyncPostComments(comment));
    reset();
  };

  const deletePost = () => {
    let result = confirm("削除してもよろしいですか？");

    if (result === true) {
      dispatch(fetchAsyncDelete(post?.post_id));
      router.push("/");
    }
  };

  return (
    <>
      <Header title="Detail" post={post}>
        <main className="w-auto">
          <div className="text-left my-5 mr-auto">
            <div className="flex">
              <Avatar src={profile?.image} className="mr-2" />
              {profile?.nickname}
            </div>
            <div>投稿日:{post?.created_on}</div>
            {post?.postUser === myProf?.profileUser && (
              <>
                <div className="flex">
                  <div className="m-2">
                    <Button
                      variant="contained"
                      size="large"
                      color="primary"
                      onClick={() => dispatch(setOpneNewPost())}
                    >
                      編集
                    </Button>
                  </div>
                  <div className="m-2">
                    <Button
                      variant="contained"
                      size="large"
                      color="secondary"
                      onClick={() => deletePost()}
                    >
                      削除
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
          <h1 className="text-4xl">{post?.title}</h1>

          <p className="whitespace-pre-wrap my-3 text-lg">{post?.contents}</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="text-center my-5 w-96">
              <TextField
                fullWidth
                multiline
                rows={3}
                id="comment"
                type="text"
                label="コメント"
                margin="normal"
                {...register("contents", { required: true })}
                className="w-52"
              />
              <div className="text-right">
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  type="submit"
                >
                  投稿
                </Button>
              </div>
            </div>
          </form>
          <div>コメント一覧</div>
          <ul>
            {comment.map((val) => (
              <li key={val.comment_id} className="my-5 border-t border-b">
                <div className="flex">
                  <Avatar src={myProf?.image} />
                  {myProf?.nickname}
                </div>
                <div className="whitespace-pre-wrap my-2">{val.contents}</div>
              </li>
            ))}
          </ul>
        </main>
      </Header>
    </>
  );
};

export default Detail;

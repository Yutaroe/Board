import Header from "../compornents/Header";
import Link from "next/link";
import { selectProfile, setOpenProfile } from "../src/features/auth/authSlice";
import { selectPosts } from "../src/features/post/postSlice";

import { useDispatch, useSelector } from "react-redux";

import { Button, TextField, Avatar } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
}));

const mypage = () => {
  const myProf = useSelector(selectProfile);
  const posts = useSelector(selectPosts);
  const classes = useStyles();
  const dispatch = useDispatch();

  const post = posts.filter((post) => post.postUser === myProf.profileUser);

  const postList = post.map((val: any) => {
    return (
      <li key={val.post_id}>
        <div className="border-t border-b">
          <div className="mb-7">
            <div className="flex my-3">
              <Avatar src={myProf.image} className="mr-2" />
              {myProf.nickname}が{val.created_on}に投稿
            </div>
            <div className="w-auto text-xl">
              <Link href={`postDetail/${val.post_id}`}>
                <a>{val.title}</a>
              </Link>
            </div>
            <div className="overflow-hidden text-gray-400">
              <p className="container w-auto">{val.contents}</p>
            </div>
          </div>
        </div>
      </li>
    );
  });

  return (
    <>
      <Header title="mypage">
        <div className="pt-3">
          <Avatar src={myProf.image} className={classes.large} />
        </div>
        <div className="py-3 text-xl">{myProf.nickname}</div>
        <Button
          variant="contained"
          size="large"
          color="primary"
          type="submit"
          onClick={() => dispatch(setOpenProfile())}
        >
          プロフィールを編集
        </Button>
        <ul className="list-none mx-20 text-left my-5">{postList}</ul>
      </Header>
    </>
  );
};

export default mypage;

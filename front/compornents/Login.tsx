import Header from "./Header";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/dist/client/router";

import {
  fetchAsyncLogin,
  fetchAsyncGetMyProf,
  selectProfile,
  fetchAsyncGetProfs,
} from "../src/features/auth/authSlice";

import {
  fetchAsyncGetPosts,
  fetchAsyncGetComments,
} from "../src/features/post/postSlice";

import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import Button from "@material-ui/core/Button";

interface User {
  email: string;
  password: string;
}

const Login = () => {
  // const myProf = useSelector(selectProfile);
  const dispatch = useDispatch();
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: User) => {
    const result: any = await dispatch(fetchAsyncLogin(data));

    if (fetchAsyncLogin.fulfilled.match(result)) {
      await dispatch(fetchAsyncGetMyProf());
      await dispatch(fetchAsyncGetProfs());
      await dispatch(fetchAsyncGetPosts());
      await dispatch(fetchAsyncGetComments());
      router.push("/");
    }
  };

  return (
    <>
      <Header title="login">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader
              title="ログイン"
              className="text-center bg-blue-900 text-white"
            />
            <CardContent>
              <div>
                <TextField
                  fullWidth
                  id="email"
                  type="email"
                  label="Email"
                  placeholder="Email"
                  margin="normal"
                  {...register("email", { required: true })}
                />

                <TextField
                  fullWidth
                  id="password"
                  type="password"
                  label="Password"
                  placeholder="Password"
                  margin="normal"
                  {...register("password", { required: true })}
                />
              </div>
            </CardContent>
            <CardActions className="flex justify-center">
              <Button
                variant="contained"
                size="large"
                color="primary"
                type="submit"
              >
                ログインする
              </Button>
            </CardActions>
            　
            <div className="text-center underline ">
              <Link href="/signup">
                <a className="text-blue-400 hover:text-blue-300">
                  新規会員登録はこちらから
                </a>
              </Link>
            </div>
          </Card>
        </form>
      </Header>
    </>
  );
};

export default Login;

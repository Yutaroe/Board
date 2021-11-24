import Header from "../compornents/Header";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/dist/client/router";

import {
  fetchAsyncRegister,
  fetchAsyncCreateProfile,
  fetchAsyncLogin,
  selectProfile,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
} from "../src/features/auth/authSlice";

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

const signUp = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: User) => {
    const result: any = await dispatch(fetchAsyncRegister(data));

    if (fetchAsyncRegister.fulfilled.match(result)) {
      await dispatch(fetchAsyncRegister(data));
      await dispatch(fetchAsyncLogin(data));
      await dispatch(fetchAsyncCreateProfile({ nickname: "新規ユーザー" }));
      await dispatch(fetchAsyncGetMyProf());
      await dispatch(fetchAsyncGetProfs());

      router.push("/");
    }
  };

  return (
    <>
      <Header title="login">
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Card>
            <CardHeader
              title="会員登録"
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
                  label="Password(8文字以上)"
                  placeholder="Password"
                  margin="normal"
                  {...register("password", { required: true, minLength: 8 })}
                />
                {errors.password && <div>パスワードは8文字以上必要です</div>}
              </div>
            </CardContent>
            <CardActions className="flex justify-center">
              <Button
                variant="contained"
                size="large"
                color="primary"
                type="submit"
              >
                登録
              </Button>
            </CardActions>
            　
          </Card>
        </form>
      </Header>
    </>
  );
};

export default signUp;

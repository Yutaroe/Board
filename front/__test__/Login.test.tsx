import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { initTestHelpers } from "next-page-tester";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import postSlice from "../src/features/post/postSlice";
import authSlice from "../src/features/auth/authSlice";
import Login from "../compornents/Login";
import LoginedHome from "../compornents/LoginedHome";

initTestHelpers();

process.env.NEXT_PUBLIC_RESTAPI_URL = "http://localhost:8000/";

const handlers = [
  rest.post(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}authen/jwt/create/`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ access: "123xyz" }));
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/myprofile/`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          profile_id: "123",
          nickname: "yu",
          profileUser: "1234",
          image: "youweaf",
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/profile/`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            profile_id: "123",
            nickname: "yu",
            profileUser: "1234",
            image: "youweaf",
          },
          {
            profile_id: "231",
            nickname: "13efe",
            profileUser: "1235",
            image: "image",
          },
        ])
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/post/`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            post_id: "123",
            title: "タイトル",
            contents: "テスト",
            postUser: "ゆ",
            image: "",
            created_on: "2021/11/21",
          },
          {
            post_id: "567",
            title: "タイトル2",
            contents: "テスト",
            postUser: "テスト",
            image: "",
            created_on: "2021/11/23",
          },
        ])
      );
    }
  ),
];

const server = setupServer(...handlers);
beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => {
  server.close();
});

describe("LoginPage test", () => {
  let store: any;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authSlice,
        post: postSlice,
      },
    });
  });
  it("表示テスト", () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    expect(screen.getByPlaceholderText("Email")).toBeTruthy();
    expect(screen.getByPlaceholderText("Password")).toBeTruthy();
    expect(screen.getByRole("button")).toBeTruthy();
    expect(screen.getByText("新規会員登録はこちらから")).toBeInTheDocument();
  });
  it("ルーティングテスト", () => {
    render(
      <Provider store={store}>
        <Login />
        <LoginedHome />
      </Provider>
    );
    userEvent.click(screen.getByText("ログインする"));
    expect(screen.getByText("検索")).toBeInTheDocument;
  });
});

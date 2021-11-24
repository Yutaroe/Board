import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { initTestHelpers } from "next-page-tester";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import postSlice from "../src/features/post/postSlice";
import authSlice from "../src/features/auth/authSlice";
import Header from "../compornents/Header";

afterEach(() => {
  cleanup();
});

describe("Header test", () => {
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
        <Header title="" />
      </Provider>
    );
    expect(screen.getByText("ログイン")).toBeInTheDocument();
  });
});

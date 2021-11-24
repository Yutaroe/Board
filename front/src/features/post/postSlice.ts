import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { NEWPOST, COMMENT } from "../types";

const apiUrl = process.env.NEXT_PUBLIC_RESTAPI_URL;

export const fetchAsyncGetPosts = createAsyncThunk("post/get", async () => {
  const res = await axios.get(`${apiUrl}api/post`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});

export const fetchAsyncNewPosts = createAsyncThunk(
  "post/post",
  async (post: NEWPOST) => {
    const res = await axios.post(`${apiUrl}api/post/`, post, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

export const fetchAsyncGetComments = createAsyncThunk(
  "comments/get",
  async () => {
    const res = await axios.get(`${apiUrl}api/comment/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

export const fetchAsyncPostComments = createAsyncThunk(
  "comments/post",
  async (comment: COMMENT) => {
    const res = await axios.post(`${apiUrl}api/comment/`, comment, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

export const fetchAsyncDelete = createAsyncThunk(
  "post/delete",
  async (id: string | undefined) => {
    await axios.delete(`${apiUrl}api/post/${id}/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return id;
  }
);

export const fetchAsyncPutPost = createAsyncThunk(
  "post/put",
  async (arg: { id: string | undefined; data: any }) => {
    const { id, data } = arg;
    console.log(id);
    const res = await axios.put(`${apiUrl}api/post/${id}/`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    console.log(res.data);
    return res.data;
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState: {
    openNewPost: false,
    posts: [
      {
        post_id: "",
        title: "",
        contents: "",
        postUser: "",
        image: "",
        created_on: "",
      },
    ],
    comments: [
      {
        comment_id: "",
        contents: "",
        commentUser: "",
        post: "",
      },
    ],
  },
  reducers: {
    setOpneNewPost(state) {
      state.openNewPost = true;
    },
    resetOpenNewPost(state) {
      state.openNewPost = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
    });
    builder.addCase(fetchAsyncNewPosts.fulfilled, (state, action) => {
      state.posts = [...state.posts, action.payload];
    });
    builder.addCase(fetchAsyncNewPosts.rejected, (state, action) => {
      if ((action.error.message = "Request failed with status code 401")) {
        alert(
          "トークンの認証期限が切れました、記載したものを別で保存し、再ログインをお願いします。"
        );
      }
    });
    builder.addCase(fetchAsyncGetComments.fulfilled, (state, action) => {
      state.comments = action.payload;
    });
    builder.addCase(fetchAsyncPostComments.fulfilled, (state, action) => {
      state.comments = [...state.comments, action.payload];
    });
    builder.addCase(fetchAsyncPostComments.rejected, (state, action) => {
      if ((action.error.message = "Request failed with status code 401")) {
        alert(
          "トークンの認証期限が切れました、記載したものを別で保存し、再ログインをお願いします。"
        );
      }
    });
    builder.addCase(fetchAsyncDelete.fulfilled, (state, action) => {
      let newPost = state.posts.filter((post) => {
        return post.post_id !== action.payload;
      });
      state.posts = newPost;
    });
    builder.addCase(fetchAsyncDelete.rejected, (state, action) => {
      if ((action.error.message = "Request failed with status code 401")) {
        alert("トークンの認証期限が切れました。再ログインをお願いします。");
      }
    });
    builder.addCase(fetchAsyncPutPost.fulfilled, (state, action) => {
      let posts: any[] = [];
      state.posts.forEach((val) => {
        if (val.post_id === action.payload.post_id) {
          val = action.payload;
          posts.push(val);
        } else {
          posts.push(val);
        }
      });
      state.posts = posts;
    });
    builder.addCase(fetchAsyncPutPost.rejected, (state, action) => {
      if ((action.error.message = "Request failed with status code 401")) {
        alert(
          "トークンの認証期限が切れました、記載したものを別で保存し、再ログインをお願いします。"
        );
      }
    });
  },
});

export const { setOpneNewPost, resetOpenNewPost } = postSlice.actions;

export const selectOpenNewPost = (state: RootState) => state.post.openNewPost;
export const selectPosts = (state: RootState) => state.post.posts;
export const selectComments = (state: RootState) => state.post.comments;

export default postSlice.reducer;

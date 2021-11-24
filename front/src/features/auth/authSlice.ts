// エラーハンドリングを忘れずに

import { AUTHEN, PROFILE, NICKNAME } from "../types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_RESTAPI_URL;

export const fetchAsyncLogin = createAsyncThunk(
  "auth/post",
  async (authen: AUTHEN) => {
    const res = await axios.post(`${apiUrl}authen/jwt/create/`, authen, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.data;
  }
);

export const fetchAsyncRegister = createAsyncThunk(
  "auth/register",
  async (auth: AUTHEN) => {
    const res = await axios.post(`${apiUrl}api/register/`, auth, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }
);

export const fetchAsyncCreateProfile = createAsyncThunk(
  "profile/post",
  async (nickname: NICKNAME) => {
    const res = await axios.post(`${apiUrl}api/profile/`, nickname, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

export const fetchAsyncUpdateProf = createAsyncThunk(
  "profile/put",
  async (profile: PROFILE) => {
    const uploadDate = new FormData();
    uploadDate.append("nickname", profile.nickname);
    profile.image &&
      uploadDate.append("image", profile.image, profile.image.name);
    const res = await axios.put(
      `${apiUrl}api/profile/${profile.profile_id}/`,
      uploadDate,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncGetMyProf = createAsyncThunk("profile/get", async () => {
  const res = await axios.get(`${apiUrl}api/myprofile/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data[0];
});

export const fetchAsyncGetProfs = createAsyncThunk("profiles/get", async () => {
  const res = await axios.get(`${apiUrl}api/profile/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    openProfile: false,
    myprofile: {
      profile_id: "",
      nickname: "",
      profileUser: "",
      image: "",
    },
    profiles: [
      {
        profile_id: "",
        nickname: "",
        profileUser: "",
        image: "",
      },
    ],
    token: "",
  },
  reducers: {
    setOpenProfile(state) {
      state.openProfile = true;
    },
    resetOpenProfile(state) {
      state.openProfile = false;
    },
    editNickname(state, action) {
      state.myprofile.nickname = action.payload;
    },
    resetMyProfile(state, action) {
      state.myprofile = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
      localStorage.setItem("localJWT", action.payload.access);
      state.token = action.payload;
    });
    builder.addCase(fetchAsyncLogin.rejected, (state, action) => {
      if ((action.error.message = "Request failed with status code 401")) {
        alert("Emailもしくはパスワードが違います");
      }
    });
    builder.addCase(fetchAsyncCreateProfile.fulfilled, (state, action) => {
      state.myprofile = action.payload;
    });
    builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
    });
    builder.addCase(fetchAsyncGetProfs.fulfilled, (state, action) => {
      state.profiles = action.payload;
    });
    builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
      const profiles: any[] = [];
      state.profiles.forEach((val) => {
        if (val.profile_id === action.payload.profile_id) {
          val = action.payload;
          profiles.push(val);
        } else {
          profiles.push(val);
        }
      });
      state.profiles = profiles;
    });
    builder.addCase(fetchAsyncUpdateProf.rejected, (state, action) => {
      if ((action.error.message = "Request failed with status code 401")) {
        alert("トークンの認証期限が切れました、再ログインをお願いします。");
      }
    });
  },
});

export const {
  setOpenProfile,
  resetOpenProfile,
  editNickname,
  resetMyProfile,
} = authSlice.actions;

export const selectOpenProfile = (state: RootState) => state.auth.openProfile;
export const selectProfile = (state: RootState) => state.auth.myprofile;
export const selectProfiles = (state: RootState) => state.auth.profiles;
export const selectToken = (state: RootState) => state.auth.token;

export default authSlice.reducer;

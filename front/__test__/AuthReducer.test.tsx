import reducer, {
  setOpenProfile,
  resetOpenProfile,
  editNickname,
  resetMyProfile,
  fetchAsyncLogin,
  fetchAsyncCreateProfile,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
} from "../src/features/auth/authSlice";

describe("Reducer of ReduxToolkit", () => {
  describe("action", () => {
    let initialState = {
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
    };
    it("openProfileがtrueになる", () => {
      const action = { type: setOpenProfile };
      const state = reducer(initialState, action);
      expect(state.openProfile).toEqual(true);
    });
    it("openProfileがfalseになる", () => {
      const action = { type: resetOpenProfile };
      const state = reducer(initialState, action);
      expect(state.openProfile).toEqual(false);
    });
    it("editNicknameの編集", () => {
      const action = { type: editNickname.type, payload: "yu" };
      const state = reducer(initialState, action);
      expect(state.myprofile.nickname).toEqual("yu");
    });
    it("myProfileの情報をからにする", () => {
      const action = {
        type: resetMyProfile.type,
        payload: {
          profile_id: "",
          nickname: "",
          profileUser: "",
          image: "",
        },
      };
      const state = reducer(initialState, action);
      expect(state.myprofile).toEqual({
        profile_id: "",
        nickname: "",
        profileUser: "",
        image: "",
      });
    });
    describe("extraReducer Test", () => {
      let initialState = {
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
      };
      it("fetchAsyncLogin when fulfilled", () => {
        const action = {
          type: fetchAsyncLogin.fulfilled.type,
          payload: "123qwe",
        };
        const state = reducer(initialState, action);
        expect(state.token).toEqual("123qwe");
      });
      it("fetchAsyncCreateProfile when fulfilled", () => {
        const action = {
          type: fetchAsyncCreateProfile.fulfilled.type,
          payload: {
            profile_id: "123",
            nickname: "新規ユーザー",
            profileUser: "234",
            image: "",
          },
        };
        const state = reducer(initialState, action);
        expect(state.myprofile).toEqual({
          profile_id: "123",
          nickname: "新規ユーザー",
          profileUser: "234",
          image: "",
        });
      });
      it("fetchAsyncGetMyProf when fulfilled", () => {
        const action = {
          type: fetchAsyncGetMyProf.fulfilled.type,
          payload: {
            profile_id: "123",
            nickname: "新規ユーザー",
            profileUser: "234",
            image: "",
          },
        };
        const state = reducer(initialState, action);
        expect(state.myprofile).toEqual({
          profile_id: "123",
          nickname: "新規ユーザー",
          profileUser: "234",
          image: "",
        });
      });
      it("fetchAsyncGetProfs when fulfilled", () => {
        const action = {
          type: fetchAsyncGetProfs.fulfilled.type,
          payload: [
            {
              profile_id: "",
              nickname: "",
              profileUser: "",
              image: "",
            },
          ],
        };
        const state = reducer(initialState, action);
        expect(state.profiles).toEqual([
          {
            profile_id: "",
            nickname: "",
            profileUser: "",
            image: "",
          },
        ]);
      });
    });
  });
});

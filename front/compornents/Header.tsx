import Head from "next/head";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { selectProfile, resetMyProfile } from "../src/features/auth/authSlice";
import { setOpneNewPost } from "../src/features/post/postSlice";

import ProfileModal from "./ProfileModal";
import PostModal from "./PostModal";

import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import AddIcon from "@material-ui/icons/Add";

interface TITLE {
  title: string;
  post?: {};
}

const Header: React.FC<TITLE> = ({ children, title = "Nextjs", post = {} }) => {
  const myProf = useSelector(selectProfile);
  const dispatch = useDispatch();
  return (
    <div className="flex justify-center flex-col min-h-screen font-mono">
      <ProfileModal />
      <PostModal post={post} />
      <Head>
        <title>{title}</title>
      </Head>
      <header>
        <nav className="bg-gray-800 w-screen">
          <div className="flex items-center pl-8 h-14">
            <div className="flex space-x-4">
              <Link href="/">
                <a className="text-gray-300 hover:bg-gray-700 px-3 py-4 rounded">
                  ホーム
                </a>
              </Link>
              {myProf.nickname === "" && (
                <Link href="/login">
                  <a className="text-gray-300 hover:bg-gray-700 px-3 py-4 rounded">
                    ログイン
                  </a>
                </Link>
              )}
              {myProf.nickname !== "" && (
                <>
                  <button>
                    <AddIcon
                      className="text-white hover:bg-gray-700 rounded mx-3"
                      onClick={() => dispatch(setOpneNewPost())}
                    />
                  </button>
                  <Link href="/">
                    <Button
                      onClick={() => {
                        dispatch(
                          resetMyProfile({
                            profile_id: "",
                            nickname: "",
                            userProfile: "",
                            image: "",
                          })
                        );
                        localStorage.removeItem("redux_localstorage_simple");
                        localStorage.removeItem("localJWT");
                      }}
                    >
                      <span className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded">
                        ログアウト
                      </span>
                    </Button>
                  </Link>
                  <Link href="/mypage">
                    <a className="hover:bg-gray-700 py-2 srounded">
                      <Avatar src={myProf.image} />
                    </a>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className="flex flex-1 justify-center items-center flex-col w-screen">
        {children}
      </main>
    </div>
  );
};

export default Header;

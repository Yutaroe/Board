import Header from "./Header";
import { selectPosts } from "../src/features/post/postSlice";
import { selectProfiles } from "../src/features/auth/authSlice";
import { useSelector } from "react-redux";
import { MYPROFILE } from "../src/features/types";
import Link from "next/link";
import ReactPaginate from "react-paginate";

import SearchIcon from "@material-ui/icons/Search";
import Avatar from "@material-ui/core/Avatar";
import { useState, useEffect } from "react";

const LoginedHome = () => {
  let posts = useSelector(selectPosts);
  const profiles = useSelector(selectProfiles);

  const [post, setPost] = useState(posts);
  const [word, setWord] = useState("");
  const [offset, setOffset] = useState(0);
  const perPage = 5;

  const handlePageChange = (data: any) => {
    let page_number = data["selected"];
    setOffset(page_number * perPage);
  };

  useEffect(() => {
    let sort = [...posts];
    let result = sort.sort((a, b) => {
      return a.created_on > b.created_on ? -1 : 1;
    });
    setPost(result);
  }, [posts]);

  const search = () => {
    let searchedPost = post.filter((val) => {
      return val.title.includes(word);
    });

    searchedPost.length === 0 && alert("一致するものはありません");
    if (searchedPost.length > 0) {
      setPost(searchedPost);
    }
    if (word === "") {
      let sort = [...posts];
      let result = sort.sort((a, b) => {
        return a.created_on > b.created_on ? -1 : 1;
      });
      setPost(result);
    }
  };

  const postList = post.slice(offset, offset + perPage).map((val: any) => {
    let profile: MYPROFILE = {
      profile_id: "",
      nickname: "",
      profileUser: "",
      image: "",
    };
    profiles.forEach((val1) => {
      if (val.postUser === val1.profileUser) {
        profile = val1;
      }
    });
    return (
      <li key={val.post_id}>
        <div className="border-t border-b">
          <div className="mb-7">
            <div className="flex my-3">
              <Avatar src={profile.image} className="mr-2" />
              {profile.nickname}が{val.created_on}に投稿
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
    <div>
      <Header title="Home">
        <div>
          <input
            className="m-3 w-80 h-10 border border-gray-800"
            onChange={(e) => setWord(e.target.value)}
          />
          <button
            className="m-3 w-24 h-10 text-white  bg-gray-800 rounded "
            onClick={() => search()}
          >
            <span className="m-1">検索</span>
            <SearchIcon className="m-1" />
          </button>
        </div>
        <div>
          <ul className="list-none mx-20 text-left">{postList}</ul>
        </div>
        <ReactPaginate
          previousLabel={""}
          nextLabel={""}
          breakLabel={"..."}
          pageCount={Math.ceil(post.length / perPage)} // 全部のページ数。端数の場合も考えて切り上げに。
          marginPagesDisplayed={2} // 一番最初と最後を基準にして、そこからいくつページ数を表示するか
          pageRangeDisplayed={5} // アクティブなページを基準にして、そこからいくつページ数を表示するか
          onPageChange={handlePageChange} // クリック時のfunction
          containerClassName={"pagination"} // ページネーションであるulに着くクラス名
          // subContainerClassName={'pages pagination'}
          activeClassName={"active"} // アクティブなページのliに着くクラス名
          previousClassName={"pagination__previous"} // 「<」のliに着けるクラス名
          nextClassName={"pagination__next"} // 「>」のliに着けるクラス名
          disabledClassName={"pagination__disabled"} // 使用不可の「<,>」に着くクラス名
        />
      </Header>
    </div>
  );
};

export default LoginedHome;

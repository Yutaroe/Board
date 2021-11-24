export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}

// authSlice.ts
export interface AUTHEN {
  email: string;
  password: string;
}

export interface PROFILE {
  profile_id: string;
  nickname: string;
  image: File | null;
}

export interface NICKNAME {
  nickname: string;
}

// postSlice.ts
export interface NEWPOST {
  title: string;
  contents: string;
  image?: File | null;
}

export interface COMMENT {
  contents: string;
  post: string;
}

export interface POSTS {
  post_id: string;
  title: string;
  contents: string;
  image: string | null;
  post_user: string;
  created_on: string;
}

export interface MYPROFILE {
  profile_id: string;
  nickname: string;
  profileUser: string;
  image: string;
}

import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOpenProfile,
  resetOpenProfile,
  selectProfile,
  fetchAsyncUpdateProf,
} from "../src/features/auth/authSlice";
import { useForm } from "react-hook-form";

import { Button, TextField, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";

interface Profile {
  profile_id: string;
  nickname: string;
  image: File | null;
}

const customStyles = {
  content: {
    top: "55%",
    left: "50%",

    width: 480,
    height: 360,
    padding: "50px",

    transform: "translate(-50%, -50%)",
  },
};

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
}));

// Modal.setAppElement("#__next");

const ProfileModal = () => {
  const openProfile = useSelector(selectOpenProfile);
  const myProf = useSelector(selectProfile);

  //   const [prof, setProf] = useState(myProf);
  const [img, setImg] = useState<File | null>(null);

  const classes = useStyles();
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: Profile) => {
    data.profile_id = myProf.profile_id;
    data.image = img;
    dispatch(fetchAsyncUpdateProf(data));
    dispatch(resetOpenProfile());
  };

  return (
    <>
      <Modal
        isOpen={openProfile}
        onRequestClose={() => {
          dispatch(resetOpenProfile());
        }}
        style={customStyles}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            id="nickname"
            type="text"
            label="ニックネーム"
            defaultValue={myProf.nickname}
            margin="normal"
            {...register("nickname", { required: true })}
          />

          <div className="flex justify-center my-4">
            <Avatar src={myProf.image} className={classes.large} />
          </div>

          <input
            type="file"
            accept=".jpg, .png, .gif"
            onChange={(e) => setImg(e.target.files![0])}
          />
          <div className="text-center my-5">
            <Button
              variant="contained"
              size="large"
              color="primary"
              type="submit"
            >
              プロフィールを編集する
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ProfileModal;

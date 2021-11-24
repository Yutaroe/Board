import { useSelector } from "react-redux";
import Header from "../compornents/Header";
import { selectProfile } from "../src/features/auth/authSlice";
import LoginedHome from "../compornents/LoginedHome";
import LogoutedHome from "../compornents/LogoutedHome";

const Home: React.FC = () => {
  const myProf = useSelector(selectProfile);
  return (
    <div className="min-h-screen font-mono">
      {myProf.nickname !== "" ? <LoginedHome /> : <LogoutedHome />}
    </div>
  );
};
export default Home;

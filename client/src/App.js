import {format} from "date-fns"
import Profile from "./components/Profile";
import {BrowserRouter, Route,Routes} from 'react-router-dom'
import Login from "./components/Login"
import SignUp from "./components/Register";
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import HomePage from "./components/Home";
import AccountCreationForm from "./components/Account";
import PINPage from "./components/Pin";
import BalancePopup from "./components/Balance";
function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-center"/>
        <Routes>
          <Route path="/pin" Component={PINPage}></Route>
          <Route path="/account" Component={AccountCreationForm}></Route>
          <Route path="/home" Component={HomePage}></Route>
          <Route path="/login" Component={Login}></Route>
          <Route path="/register" Component={SignUp}></Route>
          <Route path="/profile" Component={Profile}></Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;

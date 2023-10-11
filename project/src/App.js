import Login from "./login";
import Profile from "./profile";
import {
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Register from "./register";
import Forgotpass from "./forgotpass";

function App() {
  return (
    <div >
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="login" element={<Login/>}/> 
        <Route path="profile" element={<Profile/>}/>  
        <Route path="register" element={<Register/>}/>  
        <Route path="forgot" element={<Forgotpass/>}/>  
      </Routes>
    </div>
  );
}

export default App;

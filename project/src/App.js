import Login from "./login";
import Profile from "./profile";
import {
  Routes,
  Route,
} from "react-router-dom";
import Register from "./register";
import Changepass from "./changepass";
import Forgotpass from "./forgotpass";
function App() {
  return (
    <div >
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="login" element={<Login/>}/> 
        <Route path="profile" element={<Profile/>}/>  
        <Route path="register" element={<Register/>}/>  
        <Route path="changepass" element={<Changepass/>}/>  
        <Route path="forgot" element={<Forgotpass/>}/>  
      </Routes>
    </div>
  );
}

export default App;

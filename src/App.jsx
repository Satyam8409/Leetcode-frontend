import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Homepage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { checkAuth } from "./authSlice";
import {useDispatch,useSelector} from 'react-redux';
import { useEffect } from "react";
import ProblemPage from "./pages/ProblemPage";
import Admin from "./pages/Admin";
import AdminPanel from "./components/AdminPanel";
import AdminDelete from './components/AdminDelete';

/*isAuthenticated
    -kavi v agar user aaya to usko ek baar check kr lete hai ki kahi o authenticated user to nhi 
    -agar hoga to direct homepage pe redirect kr denge
    -nhi hua to signup ya login page pe redirect kr denge
    -to ye possible hai through checkAuth
*/

/*CORS policy issue
    -our backend is hosted io port no 3000
    -and frontend hosted on port no 5173
    -this CORS issue arrise bcz of
        -both F & B are hosted on diff port no. ,jiske wajh se browser(postman ye error nhi deta tha) restriction laga de raha hai ,agar ye dono same port(jo ki possible nhi hai) pe hota to ye issue aata hi nhi 
        -browser restriction kyu lga raha hai jki postman nhi krta tha
            -reason maan lo chrome se SBI ka backend ko request maare or badle me o response diya sath me token(session) v share kiya, (tkki jb dusra baar ye fir request kre to firse login na krna pre direct access mil jaye)
             or ye token browser me store ho gaya in cookie
            -or agar ek or koi evil web chrome pe hi hai or o v SBI ka backend ko request bheja to agar CORS policy nhi hota to chrome 
             SBI ka token iske request ke sath attach krwa deta ,fir isse evil ko v access mil jata or ye to kand kr dena tha tb
            -to isse prbm se bachne ke liye jb v Backend token sahre krta hai to ,bata deta hai isse token ko konsa
             website access kr skta hai->or isse wajh se 5173 ka req ko fullfill nhi kr raha tha F bcz backend me aisa 
             kuch mention hi nhi kiye the ki konsa isko use kr skta hai
*/

function App(){
    const {isAuthenticated, loading, user}= useSelector((state)=>state.auth);
    const dispatch=useDispatch();
    
    useEffect(()=>{
        dispatch(checkAuth());
    },[])

    if(loading){
        return(
            <div className="min-h-screen flex justify-center items-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    return(
        <>
            <Routes>
                <Route path="/" element={isAuthenticated?<Homepage></Homepage>:<Navigate to="/signup"></Navigate>}></Route>
                <Route path="/login" element={isAuthenticated?<Navigate to="/"></Navigate>:<Login></Login>}></Route>
                <Route path="/signup" element={isAuthenticated?<Navigate to="/"></Navigate>:<Signup></Signup>}></Route>
                <Route path="/admin" element={isAuthenticated && user?.role==='admin' ? <Admin></Admin> : <Navigate to='/'></Navigate>}></Route>
                <Route path="/admin/create" element={isAuthenticated && user?.role==='admin'? <AdminPanel></AdminPanel> :<Navigate to='/'></Navigate>}></Route>
                <Route path="/admin/delete" element={isAuthenticated && user?.role==='admin'? <AdminDelete></AdminDelete> :<Navigate to='/'></Navigate>}></Route>
                <Route path="/problem/:problemId" element={<ProblemPage></ProblemPage>}></Route>
            </Routes>
        </>
    )
}
export default App;

/* admin panel pe jane wala agar admin hai fir v usko jane nhi de raha hai aisa kyu
    -kyuki iss route ko manually /admin likh ke jane ka try kr rahe hai jisse pura site refresh ho jata hai 
    -isliye agar isse bachna hai to NavaLink ka use krne se ho jayega kyuki tvi page refresh nhii hota hai 
    -ye new kuch sikhne ko mila
*/
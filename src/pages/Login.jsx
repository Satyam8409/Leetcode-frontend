import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {z} from 'zod';
import { useDispatch,useSelector } from "react-redux";
import { loginUser } from "../authSlice";
import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router";

const loginSchema=z.object({
    emailId:z.string().email('Invalid Email'),
    password:z.string().min(8,'Minimum character should be 3'),
})

export default function Login(){
    const {register, handleSubmit, formState:{errors}} =useForm({resolver:zodResolver(loginSchema)})
    const dispatch=useDispatch();
    const {isAuthenticated, loading, error}=useSelector((state)=>state.auth)
    const navigate=useNavigate();
    const [showPassword, setShowPassword]=useState(false);

    useEffect(()=>{
        if(isAuthenticated){
            navigate('/')
        }
    },[isAuthenticated])

    const onSubmit=(data)=>{
        dispatch(loginUser(data))//credentials sent to backend // console.log(data);
    }


    return(
        <>
        <div className=" min-h-screen flex justify-center items-center p-4">
            <div className="card w-96 shadow-2xl bg-white ">
                <div className="card-body">
                    <h2 className="card-title text-3xl flex justify-center">Leetcode</h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control mt-4">
                            <label className="label mb-1"><span className="label-text">Email</span></label>
                            <input className={`input input-bordered ${errors.emailId && 'input-error'}`} {...register('emailId')} type="email" placeholder="enter email" />
                            {errors.emailId && <span className="text-error">{errors.emailId.message}</span>}
                        </div>


                        <div className="form-control mt-4">
                            <label className="label mb-1"><span className="label-text">Password</span></label>
                            {/* <input className={`input input-bordered ${errors.password && 'text-error'}`} {...register('password')} placeholder="••••••••" /> */}
                            
                            <div className="relative">
                                <input type={showPassword?'text':'password'} className={`input input-bordered ${errors.password && 'text-error'}`} {...register('password')} placeholder="••••••••" />
                                <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-8 top-2.5 text-gray-500 hover:text-gray-800">
                                    {showPassword?(
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    ):(
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            
                            {errors.password && <span className="text-error">{errors.password.message}</span>}
                        </div>
                        
                         <div className="form-control mt-6 flex justify-center">
                            <button type="submit" disabled={loading} className={`btn btn-primary ${loading?'loading':'' }`}>Login</button>
                        </div>

                        <NavLink to='/signup'>signup</NavLink>


                    </form>
                </div>

            </div>
                
        </div>
        

            
        </>
    )
}


/*sir code*/
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';

// const signupSchema = z.object({
//   emailId: z.string().email("Invalid Email"),
//   password: z.string().min(8, "Password is to weak")
// });

// function Login() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ resolver: zodResolver(signupSchema) });

//   const onSubmit = (data) => {
//     console.log(data);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4"> {/* Centering container */}
//       <div className="card w-96 bg-base-100 shadow-xl"> {/* Existing card styling */}
//         <div className="card-body">
//           <h2 className="card-title justify-center text-3xl">Leetcode</h2> {/* Centered title */}
//           <form onSubmit={handleSubmit(onSubmit)}>
//             {/* Existing form fields */}

//             <div className="form-control  mt-4">
//               <label className="label mb-1">
//                 <span className="label-text">Email</span>
//               </label>
//               <input
//                 type="email"
//                 placeholder="john@example.com"
//                 className={`input input-bordered ${errors.emailId && 'input-error'}`}
//                 {...register('emailId')}
//               />
//               {errors.emailId && (
//                 <span className="text-error">{errors.emailId.message}</span>
//               )}
//             </div>

//             <div className="form-control mt-4">
//               <label className="label mb-1">
//                 <span className="label-text">Password</span>
//               </label>
//               <input
//                 type="password"
//                 placeholder="••••••••"
//                 className={`input input-bordered ${errors.password && 'input-error'}`}
//                 {...register('password')}
//               />
//               {errors.password && (
//                 <span className="text-error">{errors.password.message}</span>
//               )}
//             </div>

//             <div className="form-control mt-6 flex justify-center">
//               <button
//                 type="submit"
//                 className="btn btn-primary"
//               >
//                 Login
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;





// */

import {useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; 
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../authSlice';
import { useNavigate,Navigate, NavLink } from 'react-router';
import { useEffect, useState } from 'react';

/*data jo backend as a response bhejega usko kaha store krna hai or ky bhejna chaiye   //ky actual me ye data yaha se Backend ko send kar dena chaiye? -->ans is no
        -backend uder se do data bhej raha hai token & register successfully msg(iske place pe user ka data bhejna aacha rahega-->isko global data banana prega kyki boht place pe iska use hai) 
        -agar hum kisi website me login hai, pr tab close krne ke baad v login rhte hai jbki redux me tab close hote hi data remove ho jata hai ,ye kaise possible hota hai i.e., through token 
        -qn ye hai token(vvi data) ko kon store krega , ans is browser khud hi isse token ko cookie me store kra dega
          -local stoage ka v option tha or redux ka state variable ka v but browser ke cookie ko choose kiye
            -bcz local storage pe attack ka khatra hai
            -redux ka state var tab close hote hi value loose kr deta hai, to isse tab close hote hi fir se ogin krna prega ye prbm hai
        -cookie boht secure hai isliye isme token ko store kr rahe hai, cookie me se token ko, koi v js fn se v nhi nikal skte hai//manually user nikal skta hai but code se krna not possible isliye itna secure hai  //browser khud hi user ka request ke sath token ko attach krke bhej dega

      user ka jo data bhej rahe hai backend se usko redux me store krna prega kyuki ye data baar baar use me aayega
      now the Qn is usse store me kon kon sa state var hoga 
        1.user:isme to user data store krege 
        2.loading:koi v api ko hit krge tvi loading T nhi to F //isse ek hi api ko user baar baar hit na kre usse bacha skte hai
        3.isAuthenticated:ye batayega ky user authenticated hai ki nhi, boolean val, iska use se user agar website kholega to direct usko login/signup page pe le ja skte hai ,or authenticated hua to direct homepage pe
          but ye possible sirf isse var se nhi ho payega kyuki redux var data loose kr deta hai tb close hote hi ,isko possible krne ke liye ek 
          api hit krwayege check-auth(isme token browser khud se dal dega) or bkend se token verify krwa lenge 
        4.error:user related error jo backend se aayega

    */
    
/*SchemaValidation using zod*/
const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3").max(20,'atmost character should be 20'),
  emailId: z.string().email("Invalid Email"),
  password: z.string()
    .min(8, "Password is to weak")
    .max(57,'atmost character should be 57')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/, "Password must include at least one uppercase letter, one lowercase letter, and one special character")

});


function Signup() {
  const {register,handleSubmit,formState: { errors },} = useForm({ resolver: zodResolver(signupSchema) });
  const [showPassword,setShowPassword]=useState(false);
  const dispatch =useDispatch()
  const navigate=useNavigate()
  const {isAuthenticated, loading, error}=useSelector((state)=>state.auth)

  //loading kyu ki loading ka val T kr dete hai jb v kisi API ko hit kiye hai to ,//isse ek hi api ko user baar baar hit na kre usse bacha skte hai
  //agar user direct signup page pe aa gaya to usko homepage pe redirect kr denge if authenticated  
  useEffect(()=>{
    if(isAuthenticated){
      navigate('/')
    }
  },[isAuthenticated,navigate])

  const onSubmit = (data) => {
    console.log(data);
    //ye store ke pas jayega ,CAT fn hai to mw isko registerUser ke pas bhej dega fir oha execution start hoga
    dispatch(registerUser(data))//yaha se backend ke pass ye data bhej rahe hai through axios.post method defined in authSlice         // console.log(data);//testing ke liye log me print kra rahe hai 
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"> {/* Centering container */}
      <div className="card w-96 bg-white shadow-xl "> {/* Existing card styling */}
        <div className="card-body">

          <h2 className="card-title justify-center text-3xl">Leetcode</h2> {/* Centered title */}

          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Existing form fields */}
            <div className="form-control">
              <label className="label mb-1"><span className="label-text">First Name</span></label>
              <input className={`input input-bordered ${errors.firstName && 'input-error'}`} type="text" placeholder="John"  {...register('firstName')}/>
              {errors.firstName && (<span className="text-error">{errors.firstName.message}</span>)}
            </div>

            <div className="form-control  mt-4">
              <label className="label mb-1"><span className="label-text">Email</span></label>
              <input className={`input input-bordered ${errors.emailId && 'input-error'}`} type="email" placeholder="john@example.com" {...register('emailId')}/>
              {errors.emailId && (<span className="text-error">{errors.emailId.message}</span>)}
            </div>

            {/* password field */}
              <div className="form-control mt-4">
                <label className="label mb-1"><span className="label-text">Password</span></label>
                  {/* <input type='password' className={`input input-bordered ${errors.password && 'input-error'}`}  placeholder="••••••••"  {...register('password')}/> */}
                
                <div className="relative">
                    <input type={showPassword ? "text" : "password"} placeholder="••••••••" className={`input input-bordered ${errors.password && 'input-error'}`}  {...register('password')}/>
                    <button type='button' onClick={()=>setShowPassword(!showPassword)} className="absolute top-2.5 right-8  text-gray-500 hover:text-gray-700" >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                        ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        )}
                    </button>
                </div>
                {errors.password && (<span className="text-error">{errors.password.message}</span>)}
            </div>

            {/* submit button field -->yahi pe loading kaam aayega */} 
            <div className="form-control mt-6 flex justify-center">
              <button type="submit" disabled={loading} className={`btn btn-primary ${loading?'loading':''}`}>Sign Up</button>{/* jaise hi loading true hua css loading apply ho jayega or button pe ek spinner aa jayega */}
            </div>

            {/* link to go on logiin page */}
            <div className="text-center mt-6">
              <span className="text-sm">Already have an account?{' '}
                <NavLink to="/login" className="link link-primary">
                  Login
                </NavLink>
              </span>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;


/*NavLink:-User clicks
Renders a clickable link (<a>)
User clicks to navigate
Used in menus, buttons, etc.

Navigate:-Instant redirect
Automatically redirects as soon as it renders
No click needed
Used for programmatic redirects (e.g., after login)
*/













/*khud se likha hua code without css
const signupSchema=z.object({
    firstName:z.string().min(3,'atleast 3 character').max(7,'atmost 7 character'),
    emailId:z.string().email(),
    password:z.string().min(8,'atleat 8 character'),
})

export default function Signup(){
    const {register, handleSubmit, formState: { errors },} = useForm({resolver:zodResolver(signupSchema)}); //signupSchema ko isse trika se attach krana hota hai form se zodResolver ke help se

    const submittedData=(data)=>{
        console.log(data)
    }

    return(
        <>
            <form onSubmit={handleSubmit(submittedData)}>
                <input {...register('firstName')} placeholder='enter first name'/> 
                {errors.firstName && <span>{errors.firstName.message}</span>}
                <input {...register('emailId')} placeholder='enter your email'/>
                {errors.emailId && <span>{errors.emailId.message}</span>}
                <input {...register('password')} type='password' placeholder='enter password'/>
                {errors.password && <span>{errors.password.message}</span>}
                <button className='btn btn-primary' type='submit'>Submit</button>
            </form>
        </>
    )
     
}
*/



/*//benefit of react form over normal form

import { useState } from "react"

export default function Signup(){
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    function handleSubmit(e){
        e.preventDefault();
        console.log(name, email, password);

        //yaha pe khud se validation krna prega normal form use krne se etc 
        // to ye na krna pre uske liye react form ka use krge isme state var banane ka need nhi hai, also validation ke liye zord use kr skte hia 

    }

    return(
        <>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="enter your name" name="firstName" value={name} onChange={(e)=>setName(e.target.value)} />
                <input type="email" placeholder="enter your email id" name="emailId" value={email} onChange={(e)=>setEmail(e.target.value)} />
                <input type="password" placeholder="enter your password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                <button type="submit">Submit</button>
            </form>
        </>
    )
}
*/


/*data jo backend as a response bhejega usko kaha store krna hai or ky bhejna chaiye   //ky actual me ye data yaha se Backend ko send kar dena chaiye? -->ans is no
    -backend uder se do data bhej raha hai token & register successfully msg(iske place pe user ka data bhejna aacha rahega-->isko global data banana prega kyki boht place pe iska use hai) 
    -agar hum kisi website me login hai, pr tab close krne ke baad v login rhte hai jbki redux me tab close hote hi data remove ho jata hai ,ye kaise possible hota hai i.e., through token 
    -qn ye hai token(vvi data) ko kon store krega , ans is browser khud hi isse token ko cookie me store kra dega
        -local stoage ka v option tha or redux ka state variable ka v but browser ke cookie ko choose kiye
            -bcz local storage pe attack ka khatra hai
            -redux ka state var tab close hote hi value loose kr deta hai, to isse tab close hote hi fir se ogin krna prega ye prbm hai
    -cookie boht secure hai isliye isme token ko store kr rahe hai, cookie me se token ko, koi v js fn se v nhi nikal skte hai//manually user nikal skta hai but code se krna not possible isliye itna secure hai  //browser khud hi user ka request ke sath token ko attach krke bhej dega

    -user ka jo data bhej rahe hai backend se usko redux me store krna prega kyuki ye data baar baar use me aayega
        -now the Qn is usse store me kon kon sa state var hoga 
            1.user:isme to user data store krege 
            2.loading:koi v api ko hit krge tvi loading T nhi to F //isse ek hi api ko user baar baar hit na kre usse bacha skte hai
            3.isAuthenticated:ye batayega ky user authenticated hai ki nhi, boolean val, iska use se user agar website kholega to direct usko login/signup page pe le ja skte hai ,or authenticated hua to direct homepage pe
              but ye possible sirf isse var se nhi ho payega kyuki redux var data loose kr deta hai tb close hote hi ,isko possible krne ke liye ek 
              api hit krwayege check-auth(isme token browser khud se dal dega) or bkend se token verify krwa lenge 
            4.error:user related error jo backend se aayega

*/

import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClien';

export const registerUser=createAsyncThunk(
    'auth/register',
    async(userData,{rejectWithValue})=>{
        try{
            const response=await axiosClient.post('/user/register',userData);
            return response.data.user;//payload me chala jayega
        }
        catch(err){
            return rejectWithValue(err.response?.data?.message || err.message || "Unknown error");
        }
    }
)

export const loginUser=createAsyncThunk(
    'auth/login',
    async(credentials, {rejectWithValue})=>{
        try{
            const response=await axiosClient.post('/user/login',credentials);
            return response.data.user;
        } 
        catch(err){
            return rejectWithValue(err.response?.data?.message || err.message || "Unknown error");
        }
    }
)

export const checkAuth=createAsyncThunk(
    'auth/check',
    async(_,{rejectWithValue})=>{
        try{
            const response=await axiosClient.get('/user/check');
            return response.data.user;
        } 
        catch(err){
            return rejectWithValue(err.response?.data?.message || err.message || "Unknown error");
        }
    }
)

export const logoutUser=createAsyncThunk(
    'auth/logout',
    async(_,{rejectWithValue})=>{
        try{
            const response=await axiosClient.post('/user/logout');
            return null;
        }
        catch(err){
            return rejectWithValue(err.response?.data?.message || err.message || "Unknown error")
        }
    }
)

const authSlice=createSlice({
    name:'auth',
    initialState:{
        user:null,
        isAuthenticated:false,
        loading:false,
        error:null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
            //Register User cases
            .addCase(registerUser.pending, (state)=>{
                state.loading=true;
                state.error = null;

            })
            .addCase(registerUser.fulfilled, (state,action)=>{
                state.user=action.payload;
                state.loading=false;
                state.isAuthenticated=!!action.payload;

            })
            .addCase(registerUser.rejected ,(state,action)=>{
                state.loading=false;
                state.error=action?.payload || 'some error occured';
                state.isAuthenticated=false;
                state.user=null;
            })


            // Login User Cases
            .addCase(loginUser.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
              state.loading = false;
              state.isAuthenticated = !!action.payload;
              state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload || 'Something went wrong';
              state.isAuthenticated = false;
              state.user = null;
            })

            // Check Auth Cases
            .addCase(checkAuth.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
              state.loading = false;
              state.isAuthenticated = !!action.payload;
              state.user = action.payload;
            })
            .addCase(checkAuth.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload || 'Something went wrong';
              state.isAuthenticated = false;
              state.user = null;
            })

            // Logout User Cases
            .addCase(logoutUser.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
              state.loading = false;
              state.user = null;
              state.isAuthenticated = false;
              state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload || 'Something went wrong';
              state.isAuthenticated = false;
              state.user = null;
            });
    }
})

export default authSlice.reducer;


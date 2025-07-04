// import axios from 'axios'

// const axiosClient=axios.create({
//     baseURL:'http://localhost:3000',
//     withCredentials:true,  //iske sath cookie ko attach kr dena browser ko bata rahe hai isse
//     headers:{
//         'Content-Type': 'application/json'
//     }
// });
// export default axiosClient;

// //isse benefit ye hai ki backend ko request krne ke liye pura url likhna nhi prega 
// //axiosClient.post('/user/register', data)


import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;

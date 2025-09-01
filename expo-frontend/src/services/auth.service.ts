// import apiCaller from "./api.service"

// export const signInUser = async(email: string, password: string) => {
//     try {
//         const response = await apiCaller.post("/user/signup", {
//             email,
//             password
//         })
//         if (response.data.token) {
//             return response.data;
//         }
//     } catch (error) {
//         console.error('Sign in error:', error);
//         throw error;
//     }
// }
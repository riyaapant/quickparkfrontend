    import { createSlice } from "@reduxjs/toolkit";

    export const credSlice = createSlice({
        name: 'cred',
        initialState: {
            isLoggedIn: false,
            role: 'user',
            token: '',
            refreshToken: '',
            documentsSubmitted: false,
            userLocation: {
                lat: null,
                lng: null,
            }
        },
        reducers: {
            // setCred: (state, action) => {
            //     state.isLoggedIn = action.payload.isLoggedIn
            //     state.token = action.payload.token
            //     state.role = action.payload.role
            //     state.refreshToken = action.payload.refreshToken
            //     state.documentsSubmitted = action.payload.documentsSubmitted
            //     // state.userLocation = action.payload.userLocation
            // }
            setCred: (state, action) => {
                return {
                    ...state,
                    ...action.payload,
                };
            }
        }
    })

    export const { setCred } = credSlice.actions
    export default credSlice.reducer
import { createSlice } from "@reduxjs/toolkit";

export const credSlice = createSlice({
    name: 'cred',
    initialState: {
        isLoggedIn: false,
        role: 'user',
        token: '',
        refreshToken: '',
        customerDocumentsSubmitted: false,
        customerDocumentsVerified: false,
        ownerDocumentsSubmitted: false,
        ownerDocumentsVerified: true,
        userLocation: {
            lat: null,
            lng: null,
        },
        isCustomer: false,
        isOwner: false,
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

// export const featureSlice = createSlice({
//     name: 'feature',
//     initialState: {
//         customerDocumentsSubmitted: false,
//         customerDocumentsVerified: false,
//         ownerDocumentsSubmitted: false,
//         ownerDocumentsVerified: false,
//         userLocation: {
//             lat: null,
//             lng: null,
//         },
//         isUser: false,
//         isOwner: false,
//     },
//     reducers: {
//         setFeature: (state, action) => {
//             return {
//                 ...state,
//                 ...action.payload,
//             };
//         }
//     }
// })
export const { setCred } = credSlice.actions;
// export const { setFeature } = featureSlice.actions;

// export const featureReducer = featureSlice.reducer;
export default credSlice.reducer;
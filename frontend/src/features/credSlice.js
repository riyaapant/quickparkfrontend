import { createSlice } from "@reduxjs/toolkit";

export const credSlice = createSlice({
    name: 'cred',
    initialState: {
        isLoggedIn: false,
        is_owner: false,
        token: '',
        refreshToken: '',
        // customerDocumentsSubmitted: false,
        // customerDocumentsVerified: false,
        // ownerDocumentsSubmitted: false,
        // ownerDocumentsVerified: false,
        userLocation: {
            lat: null,
            lng: null,
        },
        // isCustomer: false,
        // isOwner: false,
    },
    reducers: {
        setCred: (state, action) => {
            return {
                ...state,
                ...action.payload,
            };
        }
    }
})

export const { setCred } = credSlice.actions;
export default credSlice.reducer;
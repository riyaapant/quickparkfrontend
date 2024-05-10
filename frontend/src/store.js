import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import credReducer from './features/credSlice'

const persistConfig = {
    key: 'cred',
    storage,
}


const persistedReducer = persistReducer(persistConfig, credReducer)

let store = configureStore({
    reducer: persistedReducer,
})
let mypersistor = persistStore(store)

export { store, mypersistor }
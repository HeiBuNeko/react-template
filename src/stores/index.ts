import { configureStore } from "@reduxjs/toolkit"
import counterReducer from "./counter"

const store = configureStore({
  reducer: {
    conter: counterReducer,
  },
})

export default store

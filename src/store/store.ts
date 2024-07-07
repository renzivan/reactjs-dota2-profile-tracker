import { configureStore } from "@reduxjs/toolkit"
import heroesReducer from "./reducer/heroes"

const store = configureStore({
  reducer: {
    heroes: heroesReducer
  }
})

export type RootState = ReturnType<typeof store.getState>

export default store

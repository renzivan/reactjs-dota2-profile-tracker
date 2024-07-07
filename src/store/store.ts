import { configureStore } from "@reduxjs/toolkit"
import heroesReducer from "./reducer/heroes"
import itemsReducer from "./reducer/items"

const store = configureStore({
  reducer: {
    heroes: heroesReducer,
    items: itemsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>

export default store

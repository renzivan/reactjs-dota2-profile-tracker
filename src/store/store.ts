import { configureStore } from "@reduxjs/toolkit"
import heroesReducer from "./reducer/heroes"
import itemsReducer from "./reducer/items"
import lobbiesReducer from "./reducer/lobbies"

const store = configureStore({
  reducer: {
    heroes: heroesReducer,
    items: itemsReducer,
    lobbies: lobbiesReducer
  }
})

export type RootState = ReturnType<typeof store.getState>

export default store

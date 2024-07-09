import { configureStore } from "@reduxjs/toolkit"
import darkModeReducer from "./reducer/darkMode"
import gameModesReducer from "./reducer/gameModes"
import heroesReducer from "./reducer/heroes"
import itemsReducer from "./reducer/items"
import lobbiesReducer from "./reducer/lobbies"

const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    gameModes: gameModesReducer,
    heroes: heroesReducer,
    items: itemsReducer,
    lobbies: lobbiesReducer
  }
})

export type RootState = ReturnType<typeof store.getState>

export default store

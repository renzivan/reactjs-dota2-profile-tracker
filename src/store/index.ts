import { configureStore } from "@reduxjs/toolkit"
import abilitiesReducer from "./reducer/abilities"
import darkModeReducer from "./reducer/darkMode"
import gameModesReducer from "./reducer/gameModes"
import heroesReducer from "./reducer/heroes"
import itemsReducer from "./reducer/items"
import lobbiesReducer from "./reducer/lobbies"
import playerIdReducer from "./reducer/playerId"

const store = configureStore({
  reducer: {
    abilities: abilitiesReducer,
    darkMode: darkModeReducer,
    gameModes: gameModesReducer,
    heroes: heroesReducer,
    items: itemsReducer,
    lobbies: lobbiesReducer,
    playerId: playerIdReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>

export default store

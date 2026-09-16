import { configureStore } from "@reduxjs/toolkit"
import abilitiesReducer from "./reducer/abilities"
import heroesReducer from "./reducer/heroes"
import itemsReducer from "./reducer/items"
import playerIdReducer from "./reducer/playerId"

const store = configureStore({
  reducer: {
    abilities: abilitiesReducer,
    heroes: heroesReducer,
    items: itemsReducer,
    playerId: playerIdReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>

export default store

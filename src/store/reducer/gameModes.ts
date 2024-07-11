import { createSlice } from "@reduxjs/toolkit"

type GameModeType = {
  id: number,
  name: string
}

interface GameModesState {
  value: GameModeType[];
}

const initialState: GameModesState = {
  value: [],
}

export const gameModesSlice = createSlice({
  name: 'gameModes',
  initialState,
  reducers: {
    setGameModes: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setGameModes } = gameModesSlice.actions

export default gameModesSlice.reducer

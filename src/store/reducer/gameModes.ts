import { createSlice } from "@reduxjs/toolkit"

export const gameModesSlice = createSlice({
  name: 'gameModes',
  initialState: {
    value: []
  },
  reducers: {
    setGameModes: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setGameModes } = gameModesSlice.actions

export default gameModesSlice.reducer

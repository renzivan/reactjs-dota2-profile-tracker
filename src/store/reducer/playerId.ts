import { createSlice } from "@reduxjs/toolkit"

export const playerIdSlice = createSlice({
  name: 'playerId',
  initialState: {
    value: []
  },
  reducers: {
    setPlayerId: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setPlayerId } = playerIdSlice.actions

export default playerIdSlice.reducer

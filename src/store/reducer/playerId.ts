import { createSlice } from "@reduxjs/toolkit"

interface playerIdState {
  value: string;
}

const initialState: playerIdState = {
  value: '',
}

export const playerIdSlice = createSlice({
  name: 'playerId',
  initialState,
  reducers: {
    setPlayerId: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setPlayerId } = playerIdSlice.actions

export default playerIdSlice.reducer

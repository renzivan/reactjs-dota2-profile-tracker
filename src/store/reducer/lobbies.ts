import { createSlice } from "@reduxjs/toolkit"

export const lobbiesSlice = createSlice({
  name: 'lobbies',
  initialState: {
    value: []
  },
  reducers: {
    setLobbies: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setLobbies } = lobbiesSlice.actions

export default lobbiesSlice.reducer

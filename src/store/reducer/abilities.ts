import { createSlice } from "@reduxjs/toolkit"

export const abilitiesSlice = createSlice({
  name: 'abilities',
  initialState: {
    value: []
  },
  reducers: {
    setAbilities: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setAbilities } = abilitiesSlice.actions

export default abilitiesSlice.reducer

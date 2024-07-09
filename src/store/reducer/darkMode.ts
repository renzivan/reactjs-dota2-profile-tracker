import { createSlice } from "@reduxjs/toolkit"

export const darkModeSlice = createSlice({
  name: 'darkMode',
  initialState: {
    value: true
  },
  reducers: {
    setDarkMode: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setDarkMode } = darkModeSlice.actions

export default darkModeSlice.reducer

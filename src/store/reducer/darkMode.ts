import { createSlice } from "@reduxjs/toolkit"
interface DarkModeState {
  value: boolean;
}

const initialState: DarkModeState = {
  value: true,
}

export const darkModeSlice = createSlice({
  name: 'darkMode',
  initialState,
  reducers: {
    setDarkMode: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setDarkMode } = darkModeSlice.actions

export default darkModeSlice.reducer

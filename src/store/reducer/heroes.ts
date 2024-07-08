import { createSlice } from "@reduxjs/toolkit"

export const heroesSlice = createSlice({
  name: 'heroes',
  initialState: {
    value: []
  },
  reducers: {
    setHeroes: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setHeroes } = heroesSlice.actions

export default heroesSlice.reducer

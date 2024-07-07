import { createSlice } from "@reduxjs/toolkit"

export const heroesSlice = createSlice({
  name: 'heroes',
  initialState: {
    value: []
  },
  reducers: {
    getHeroes: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { getHeroes } = heroesSlice.actions

export default heroesSlice.reducer

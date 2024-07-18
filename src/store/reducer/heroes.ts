import { createSlice } from "@reduxjs/toolkit"
import { HeroType } from "../../lib/types"

type HeroesState = {
  value: HeroType[]
}

const initialState: HeroesState = {
  value: [],
}

export const heroesSlice = createSlice({
  name: 'heroes',
  initialState,
  reducers: {
    setHeroes: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setHeroes } = heroesSlice.actions

export default heroesSlice.reducer

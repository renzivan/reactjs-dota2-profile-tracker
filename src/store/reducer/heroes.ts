import { createSlice } from "@reduxjs/toolkit"
type Talent = {
  abilityId: number,
  slot: number
}

type HeroType = {
  id: number,
  talents: Talent[],
  shortName: string,
  displayName: string
}

interface HeroesState {
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

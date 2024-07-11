import { createSlice } from "@reduxjs/toolkit"

type AbilityType = {
  id: number,
  abilityId: number,
  name: string,
  isTalent: boolean,
  language: {
    displayName: string
  }
}

interface AbilitiesState {
  value: AbilityType[];
}

const initialState: AbilitiesState = {
  value: [],
}

export const abilitiesSlice = createSlice({
  name: 'abilities',
  initialState,
  reducers: {
    setAbilities: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setAbilities } = abilitiesSlice.actions

export default abilitiesSlice.reducer

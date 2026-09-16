import { createSlice } from "@reduxjs/toolkit"
import { AbilityConstantType } from "../../lib/types"

interface AbilitiesState {
  value: AbilityConstantType[]
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

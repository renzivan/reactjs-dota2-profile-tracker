import { createSlice } from "@reduxjs/toolkit"
import { ItemType } from "../../lib/types"

interface ItemsState {
  value: ItemType[]
}

const initialState: ItemsState = {
  value: [],
}

export const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setItems } = itemsSlice.actions

export default itemsSlice.reducer

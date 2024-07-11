import { createSlice } from "@reduxjs/toolkit"

type ItemType = {
  id: number,
  shortName: string,
  displayName: string
}

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

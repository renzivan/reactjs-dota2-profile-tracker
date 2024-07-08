import { createSlice } from "@reduxjs/toolkit"

export const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    value: []
  },
  reducers: {
    setItems: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setItems } = itemsSlice.actions

export default itemsSlice.reducer

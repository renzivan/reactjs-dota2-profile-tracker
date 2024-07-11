import { createSlice } from "@reduxjs/toolkit"
type LobbyType = {
  id: number,
  name: string
}

interface LobbiesState {
  value: LobbyType[]
}

const initialState: LobbiesState = {
  value: [],
}

export const lobbiesSlice = createSlice({
  name: 'lobbies',
  initialState,
  reducers: {
    setLobbies: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setLobbies } = lobbiesSlice.actions

export default lobbiesSlice.reducer

import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    incremented: (state) => {
      state.value += 1
    },
    decremented: (state) => {
      state.value -= 1
    },
    addToNum(state, action) {
      state.value = action.payload
    },
  },
})

export const { incremented, decremented, addToNum } = counterSlice.actions
export default counterSlice.reducer

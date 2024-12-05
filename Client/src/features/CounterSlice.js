import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const updateTree = createAsyncThunk('data/updateTree', async (data) => {
  return data;
});


// Slice
const treeSlice = createSlice({
  name: 'data',
  initialState: {
    tree: [],
    loading: false,
    error: null,
  },
  reducers: {}, // No regular reducers are needed for async thunks
  extraReducers: (builder) => {
    builder
      .addCase(updateTree.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTree.fulfilled, (state, action) => {
        state.monthlySummary = action.payload;
        state.loading = false;
      })
      .addCase(updateTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default treeSlice.reducer;

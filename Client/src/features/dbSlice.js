import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = "http://localhost:8080";

// Async thunks for API calls
export const fetchFormulae = createAsyncThunk('data/fetchFormulae', async () => {
  const response = await axios.get(BASE_URL + '/db/formulae');
  return response.data;
});

export const fetchMonthlySummary = createAsyncThunk('data/fetchMonthlySummary', async (data) => {
  const response = await axios.post( BASE_URL + '/db/monthly_summary', data);
  return response.data;
});

export const fetchTopLevelParents = createAsyncThunk('data/fetchTopLevelParents', async (data) => {
  console.log("Slice", JSON.stringify(data, null, 2));
  const response = await axios.post( BASE_URL + '/db/monthly_summary/top-level-parent', data);
  return response.data;
});

export const updateTree = createAsyncThunk('data/updateTree', async (data) => {
  console.log("SLICE TREE", JSON.stringify(data, null, 2));
  return data;
});


export const fetchMonthlySummaryByParams = createAsyncThunk('data/fetchMonthlySummaryByParams', async (data) => {
  console.log("Slice", JSON.stringify(data, null, 2));
  const response = await axios.post( BASE_URL + '/db/monthly-summary/selected-params', data);
  return response.data;
});


// Slice
const dataSlice = createSlice({
  name: 'data',
  initialState: {
    formulae: [],
    monthlySummary: [],
    loading: false,
    error: null,
  },
  reducers: {}, // No regular reducers are needed for async thunks
  extraReducers: (builder) => {
    builder
      .addCase(fetchFormulae.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFormulae.fulfilled, (state, action) => {
        state.formulae = action.payload;
        state.loading = false;
      })
      .addCase(fetchFormulae.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMonthlySummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMonthlySummary.fulfilled, (state, action) => {
        state.monthlySummary = action.payload;
        state.loading = false;
      })
      .addCase(fetchMonthlySummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTopLevelParents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopLevelParents.fulfilled, (state, action) => {
        state.monthlySummary = action.payload;
        state.loading = false;
      })
      .addCase(fetchTopLevelParents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
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

export default dataSlice.reducer;

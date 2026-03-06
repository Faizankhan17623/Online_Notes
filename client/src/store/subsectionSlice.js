import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchSubsections = createAsyncThunk('subsections/fetchAll', async (sectionId, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/subsections', { params: { sectionId } });
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch subsections'); }
});

export const addSubsection = createAsyncThunk('subsections/add', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/subsections', payload);
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to add subsection'); }
});

export const updateSubsection = createAsyncThunk('subsections/update', async ({ id, ...rest }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/subsections/${id}`, rest);
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to update subsection'); }
});

export const deleteSubsection = createAsyncThunk('subsections/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/subsections/${id}`);
    return id;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to delete subsection'); }
});

const subsectionSlice = createSlice({
  name: 'subsections',
  initialState: { subsections: [], loading: false, error: null },
  reducers: { clearSubsections(state) { state.subsections = []; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubsections.pending, (s) => { s.loading = true; s.error = null; s.subsections = []; })
      .addCase(fetchSubsections.fulfilled, (s, a) => { s.loading = false; s.subsections = a.payload; })
      .addCase(fetchSubsections.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(addSubsection.fulfilled, (s, a) => { s.subsections.unshift(a.payload); })
      .addCase(updateSubsection.fulfilled, (s, a) => {
        const i = s.subsections.findIndex(x => x._id === a.payload._id);
        if (i !== -1) s.subsections[i] = { ...s.subsections[i], ...a.payload };
      })
      .addCase(deleteSubsection.fulfilled, (s, a) => {
        s.subsections = s.subsections.filter(x => x._id !== a.payload);
      });
  },
});

export const { clearSubsections } = subsectionSlice.actions;
export default subsectionSlice.reducer;

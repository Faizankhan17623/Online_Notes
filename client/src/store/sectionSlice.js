import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchSections = createAsyncThunk('sections/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/sections');
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch sections'); }
});

export const addSection = createAsyncThunk('sections/add', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/sections', payload);
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to add section'); }
});

export const updateSection = createAsyncThunk('sections/update', async ({ id, ...rest }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/sections/${id}`, rest);
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to update section'); }
});

export const deleteSection = createAsyncThunk('sections/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/sections/${id}`);
    return id;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to delete section'); }
});

const sectionSlice = createSlice({
  name: 'sections',
  initialState: { sections: [], loading: false, error: null },
  reducers: { clearError(state) { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSections.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchSections.fulfilled, (s, a) => { s.loading = false; s.sections = a.payload; })
      .addCase(fetchSections.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(addSection.fulfilled, (s, a) => { s.sections.unshift(a.payload); })
      .addCase(updateSection.fulfilled, (s, a) => {
        const i = s.sections.findIndex(x => x._id === a.payload._id);
        if (i !== -1) s.sections[i] = { ...s.sections[i], ...a.payload };
      })
      .addCase(deleteSection.fulfilled, (s, a) => {
        s.sections = s.sections.filter(x => x._id !== a.payload);
      });
  },
});

export const { clearError } = sectionSlice.actions;
export default sectionSlice.reducer;

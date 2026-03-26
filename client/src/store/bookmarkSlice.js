import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchBookmarks = createAsyncThunk('bookmarks/fetchAll', async ({ subsectionId, search }, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/bookmarks', { params: { subsectionId, search } });
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch bookmarks'); }
});

export const fetchDirectLinks = createAsyncThunk('bookmarks/fetchDirect', async ({ search } = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/bookmarks', { params: { direct: 'true', search } });
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch links'); }
});

export const addBookmark = createAsyncThunk('bookmarks/add', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/bookmarks', payload);
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to add bookmark'); }
});

export const addDirectLink = createAsyncThunk('bookmarks/addDirect', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/bookmarks', { ...payload, direct: true });
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to add link'); }
});

export const updateBookmark = createAsyncThunk('bookmarks/update', async ({ id, ...rest }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/bookmarks/${id}`, rest);
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to update bookmark'); }
});

export const deleteBookmark = createAsyncThunk('bookmarks/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/bookmarks/${id}`);
    return id;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to delete bookmark'); }
});

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState: { bookmarks: [], directLinks: [], loading: false, directLoading: false, error: null },
  reducers: { clearBookmarks(state) { state.bookmarks = []; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchBookmarks.fulfilled, (s, a) => { s.loading = false; s.bookmarks = a.payload; })
      .addCase(fetchBookmarks.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchDirectLinks.pending, (s) => { s.directLoading = true; s.error = null; })
      .addCase(fetchDirectLinks.fulfilled, (s, a) => { s.directLoading = false; s.directLinks = a.payload; })
      .addCase(fetchDirectLinks.rejected, (s, a) => { s.directLoading = false; s.error = a.payload; })
      .addCase(addBookmark.fulfilled, (s, a) => { s.bookmarks.unshift(a.payload); })
      .addCase(addDirectLink.fulfilled, (s, a) => { s.directLinks.unshift(a.payload); })
      .addCase(updateBookmark.fulfilled, (s, a) => {
        const i = s.bookmarks.findIndex(b => b._id === a.payload._id);
        if (i !== -1) s.bookmarks[i] = a.payload;
        const j = s.directLinks.findIndex(b => b._id === a.payload._id);
        if (j !== -1) s.directLinks[j] = a.payload;
      })
      .addCase(deleteBookmark.fulfilled, (s, a) => {
        s.bookmarks = s.bookmarks.filter(b => b._id !== a.payload);
        s.directLinks = s.directLinks.filter(b => b._id !== a.payload);
      });
  },
});

export const { clearBookmarks } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;

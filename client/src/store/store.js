import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import sectionReducer from './sectionSlice';
import subsectionReducer from './subsectionSlice';
import bookmarkReducer from './bookmarkSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sections: sectionReducer,
    subsections: subsectionReducer,
    bookmarks: bookmarkReducer,
  },
});

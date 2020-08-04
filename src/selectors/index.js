import { createSelector } from 'reselect';

export const selectDummy = state => state.dummy;

export const selectDummyAndAppend = createSelector(
  [selectDummy, (state, text) => text],
  (dummy, text) => dummy + ' ' + text
);
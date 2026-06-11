import axios from 'axios'

const API =
  'http://localhost:3000/subjects'

// GET
export const getSubjects = () =>
  axios.get(API)

// CREATE
export const createSubject = (data) =>
  axios.post(API, data)

// UPDATE
export const updateSubject = (id, data) =>
  axios.patch(`${API}/${id}`, data)

// DELETE
export const removeSubject = (id) =>
  axios.delete(`${API}/${id}`)
import axios from 'axios'

const API = 'http://localhost:3000/classes'

export const getClasses = () =>
  axios.get(API)

export const createClass = (data) =>
  axios.post(API, data)

export const updateClass = (id, data) =>
  axios.patch(`${API}/${id}`, data)

export const removeClass = (id) =>
  axios.delete(`${API}/${id}`)

// Alias for AttendanceView
export const deleteClass = (id) =>
  axios.delete(`${API}/${id}`)
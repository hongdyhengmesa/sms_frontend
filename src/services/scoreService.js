import axios from 'axios'

const API =
  `${import.meta.env.VITE_API_URL}/scores`

// GET
export const getScores = () =>
  axios.get(API)

// CREATE
export const createScore = (data) =>
  axios.post(API, data)

// UPDATE
export const updateScore = (id, data) =>
  axios.patch(
    `${API}/${id}`,
    data
  )

// DELETE
export const removeScore = (id) =>
  axios.delete(
    `${API}/${id}`
  )
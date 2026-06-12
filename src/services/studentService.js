import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_URL}/students`

export const getStudents = () => {
  return axios.get(API_URL)
}

export const getStudentsByClass = (classId) => {
  return axios.get(API_URL, {
    params: {
      class_id: classId
    }
  })
}

export const createStudent = (data) => {
  return axios.post(API_URL, data)
}

export const updateStudent = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data)
}

export const removeStudent = (id) => {
  return axios.delete(`${API_URL}/${id}`)
}

export default {
  getStudents,
  getStudentsByClass,
  createStudent,
  updateStudent,
  removeStudent
}
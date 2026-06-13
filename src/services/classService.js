import axios from 'axios'

const API = `${import.meta.env.VITE_API_URL}/classes`

export const getClasses = async () => {
  try {
    const response = await axios.get(API)
    // Ensure all classes have numeric IDs
    if (response.data && Array.isArray(response.data)) {
      response.data = response.data.map(c => ({
        ...c,
        id: Number(c.id),
        grade_level: Number(c.grade_level),
        students: Number(c.students) || 0,
        capacity: Number(c.capacity) || 40,
        gpa: Number(c.gpa) || 0,
      }))
    }
    console.log('📚 Classes loaded:', response.data.map(c => ({ name: c.name, id: c.id })))
    return response
  } catch (error) {
    console.error('Error fetching classes:', error)
    throw error
  }
}

export const createClass = (data) => {
  const payload = {
    ...data,
    grade_level: Number(data.grade_level),
    students: Number(data.students) || 0,
    capacity: Number(data.capacity) || 40,
    gpa: Number(data.gpa) || 0,
  }
  return axios.post(API, payload)
}

export const updateClass = (id, data) => {
  const payload = {
    ...data,
    grade_level: Number(data.grade_level),
    students: Number(data.students) || 0,
    capacity: Number(data.capacity) || 40,
    gpa: Number(data.gpa) || 0,
  }
  return axios.patch(`${API}/${id}`, payload)
}

export const removeClass = (id) => {
  return axios.delete(`${API}/${id}`)
}

export const deleteClass = (id) => {
  return axios.delete(`${API}/${id}`)
}

export default {
  getClasses,
  createClass,
  updateClass,
  removeClass,
  deleteClass
}
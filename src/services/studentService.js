import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_URL}/students`

export const getStudents = async () => {
  try {
    const response = await axios.get(API_URL)
    // Ensure all numeric fields are numbers
    if (response.data && Array.isArray(response.data)) {
      response.data = response.data.map(s => ({
        ...s,
        id: Number(s.id),
        class_id: Number(s.class_id),
        gpa: Number(s.gpa) || 0,
      }))
    }
    return response
  } catch (error) {
    console.error('Error fetching students:', error)
    throw error
  }
}

export const getStudentsByClass = (classId) => {
  return axios.get(API_URL, {
    params: {
      class_id: Number(classId)
    }
  })
}

export const createStudent = (data) => {
  // CRITICAL: Ensure class_id is a number and all fields are properly typed
  const payload = {
    first_name: String(data.first_name || ''),
    last_name: String(data.last_name || ''),
    student_code: String(data.student_code || `STU${Date.now()}`),
    gender: String(data.gender || 'Male'),
    email: String(data.email || `student${Date.now()}@school.com`),
    phone: String(data.phone || '000000000'),
    address: String(data.address || 'School'),
    class_id: Number(data.class_id), // Convert to number!
    gpa: Number(data.gpa) || 0,
    status: String(data.status || 'Active'),
  }
  
  console.log('📤 Creating student with payload:', payload)
  console.log('Class ID type:', typeof payload.class_id, 'Value:', payload.class_id)
  
  return axios.post(API_URL, payload)
}

export const updateStudent = (id, data) => {
  const payload = {
    ...data,
    class_id: Number(data.class_id),
    gpa: Number(data.gpa) || 0,
  }
  return axios.put(`${API_URL}/${id}`, payload)
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
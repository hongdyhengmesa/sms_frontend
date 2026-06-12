// src/services/attendance.js
import axios from 'axios'

const API_URL =
  `${import.meta.env.VITE_API_URL}/attendance`

// Get all attendance records
export const getAttendances = () => {
  return axios.get(API_URL)
}

// Get attendance by ID
export const getAttendanceById = (id) => {
  return axios.get(`${API_URL}/${id}`)
}

// Create new attendance record
export const createAttendance = (data) => {
  return axios.post(API_URL, data)
}

// Update attendance record
export const updateAttendance = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data)
}

// Delete attendance record
export const removeAttendance = (id) => {
  return axios.delete(`${API_URL}/${id}`)
}

// ============================================
// Student Specific Operations
// ============================================

// Get attendance by student ID
export const getAttendanceByStudent = (studentId) => {
  return axios.get(`${API_URL}/student/${studentId}`)
}

// Get student attendance history with limit
export const getStudentHistory = (studentId, limit = 30) => {
  return axios.get(`${API_URL}/student/${studentId}/history`, {
    params: { limit }
  })
}

// Mark attendance for a single student (create or update)
export const markAttendance = (
  studentId,
  status,
  checkInTime = null,
  date = null,
  ) => {
  console.log(
    'MARK ATTENDANCE:',
    {
      studentId,
      status,
      checkInTime,
      date,
    }
  )
  return axios.post(
    `${API_URL}/mark/${studentId}`,
    {
      status,
      checkInTime,
      date,
    }

  )
}

// Mark present with auto late detection
export const markPresentWithLateDetection = (studentId, date = null) => {
  const nowTime = getCurrentFormattedTime()
  const isLate = isLateTime(nowTime)
  const status = isLate ? 'late' : 'present'
  return markAttendance(studentId, status, nowTime, date)
}

// ============================================
// Class Specific Operations
// ============================================

// Get attendance by class ID (with optional date)
export const getAttendanceByClass = (classId, date = null) => {
  const params = date ? { date } : {}
  return axios.get(`${API_URL}/class/${classId}`, { params })
}

// Get today's attendance for a class
export const getTodayAttendance = (classId) => {
  return axios.get(`${API_URL}/class/${classId}/today`)
}

// Bulk mark attendance for entire class
export const bulkMarkAttendance = (classId, status, checkInTime = null, date = null) => {
  return axios.post(`${API_URL}/bulk/${classId}`, {
    status,
    checkInTime,
    date
  })
}

// Reset attendance for a class on a specific date
export const resetClassAttendance = (classId, date = null) => {
  return axios.post(`${API_URL}/reset/${classId}`, { date })
}

// ============================================
// Search Operations
// ============================================

// Search attendance by class, name, or student code
export const searchAttendance = (classId, query, date = null) => {
  const params = { classId, query }
  if (date) params.date = date
  return axios.get(`${API_URL}/search`, { params })
}

// ============================================
// Statistics Operations
// ============================================

// Get class statistics
export const getClassStats = (classId, date = null) => {
  const params = date ? { date } : {}
  return axios.get(`${API_URL}/stats/class/${classId}`, { params })
}

// Get global statistics (all classes)
export const getGlobalStats = (date = null) => {
  const params = date ? { date } : {}
  return axios.get(`${API_URL}/stats/global`, { params })
}

// ============================================
// Batch Operations
// ============================================

// Delete all attendance records for a date
export const deleteAttendanceByDate = (date) => {
  return axios.delete(`${API_URL}/date/${date}`)
}

// ============================================
// Helper Functions
// ============================================

// Get current time formatted as HH:MM:SS AM/PM
export const getCurrentFormattedTime = () => {
  const now = new Date()
  let hours = now.getHours()
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${hours}:${minutes}:${seconds} ${ampm}`
}

// Check if time is late (after 9:00 AM)
export const isLateTime = (timeStr) => {
  if (!timeStr) return false
  const match = timeStr.match(/(\d+):(\d+):(\d+)\s+(AM|PM)/i)
  if (!match) return false
  let hours = parseInt(match[1])
  const minutes = parseInt(match[2])
  const ampm = match[4].toUpperCase()
  if (ampm === 'PM' && hours !== 12) hours += 12
  if (ampm === 'AM' && hours === 12) hours = 0
  const totalMinutes = hours * 60 + minutes
  return totalMinutes > 540 // 9:00 AM = 540 minutes
}

// Format date to YYYY-MM-DD
export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0]
}

// Format display date
export const formatDisplayDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// ============================================
// Default export for convenience
// ============================================

const attendanceAPI = {
  // Basic CRUD
  getAttendances,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  removeAttendance,
  
  // Student specific
  getAttendanceByStudent,
  getStudentHistory,
  markAttendance,
  markPresentWithLateDetection,
  
  // Class specific
  getAttendanceByClass,
  getTodayAttendance,
  bulkMarkAttendance,
  resetClassAttendance,
  
  // Search
  searchAttendance,
  
  // Statistics
  getClassStats,
  getGlobalStats,
  
  // Batch operations
  deleteAttendanceByDate,
  
  // Helpers
  getCurrentFormattedTime,
  isLateTime,
  getTodayDate,
  formatDisplayDate
}

export default attendanceAPI
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/teachers`

export const getTeachers = () => axios.get(API_URL)

export const createTeacher = (data) => axios.post(API_URL, data)

export const updateTeacher = (
    id,
    data,
) => axios.put(`${API_URL}/${id}`, data)

export const removeTeacher = (id) => axios.delete(`${API_URL}/${id}`)
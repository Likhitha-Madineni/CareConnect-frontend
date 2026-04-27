import api from './api';

export async function registerUser(payload) {
  const { data } = await api.post('/auth/register', {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role,
  });
  return data;
}

export async function loginUser(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data;
}

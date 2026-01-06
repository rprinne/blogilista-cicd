import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = newToken => {
  token = `bearer ${newToken}`;
};

const create = async newBlog => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const getAll = () => {
  const res = axios.get(baseUrl);
  return res.then(response => response.data);
};

const update = async (id, newObject) => {
  const request = await axios.put(`${ baseUrl }/${id}`, newObject);
  return request.data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  try {
    return await axios.delete(`${ baseUrl }/${id}`, config);
  } catch (error) {
    return error.message;
  }
};

export default { getAll, create, update, remove, setToken };
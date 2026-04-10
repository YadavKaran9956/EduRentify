import axios from 'axios';

// For Login:
const authApi = axios.create({
  baseURL: 'https://dummyjson.com/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// For Pokemon APIs:
const pokemonApi = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (username: string, password: string) => {
    const response = await authApi.post('auth/login', { username, password });
    return response.data;
  },
};

export const pokemonService = {
  getPokeList: async (limit = 20) => {
    const response = await pokemonApi.get(`pokemon?limit=${limit}`);
    return response.data;
  },

  getPokemonDetails: async (url: string) => {
    const response = await axios.get(url);
    return response.data;
  },
};

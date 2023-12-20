import axios from "axios";

const customFetch = axios.create({
	baseURL: "https://backendblogvana.onrender.com/api",
});

export default customFetch;

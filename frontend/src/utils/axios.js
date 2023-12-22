import axios from "axios";

const customFetch = axios.create({
	baseURL: "https://backendblogvana.onrender.com/api",
});

export default customFetch;

// const customFetch = axios.create({
// 	baseURL: " http://localhost:5100/api",
// });

// export default customFetch;

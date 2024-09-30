import axios from "../axiosConfig";
async function getEnableLike() {
  const rs = await axios.get('/mo-khoa-like')
  return rs.data.data.mo_like
}
export default getEnableLike

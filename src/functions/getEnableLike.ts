import axios from "../axiosConfig";
async function getEnableLike() {
  const rs = await axios.get('/dmst-mo-khoa-like')
  return rs.data.data.attributes.mo
}
export default getEnableLike

import axios from "../axiosConfig";
async function getNews(id?:string) {
  const rs = await axios.get(id ? `/bai-viets/${id}` : '/bai-viets')
  return rs
}
export default getNews

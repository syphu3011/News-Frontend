import axios from "../axiosConfig";
async function getNews(id?:string) {
  const rs = await axios.get(id ? `/dmst-bai-viets/${id}` : '/dmst-bai-viets')
  return rs
}
export default getNews

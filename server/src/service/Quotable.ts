import axios from "axios";
const uri = "http://api.quotable.io/random";

export const getData = () => {
  return axios.get(uri).then((response) => response.data.content.split(" "));
};

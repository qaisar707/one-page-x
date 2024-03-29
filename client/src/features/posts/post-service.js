import axios from "../../config/axios";
const API_URL = "post";

const createPost = async (postData, token) => {
  const createPostsConfig = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    API_URL + "/make-with-may",
    postData,
    createPostsConfig
  );
  return response.data;
};

const postService = {
  createPost,
};
export default postService;

import axios from 'axios';

const fetcher = async () => {
    const { data } = await axios.get(`/api/homepage`);
    return { page: data };
};

export default fetcher;

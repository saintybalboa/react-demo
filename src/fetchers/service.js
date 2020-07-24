import axios from 'axios';

// Get data for a service by the id.
const fetcher = async ({ id }) => {
    const { data } = await axios.get(`/api/services/${id}`);
    return { service: data && data[0] };
};

export default fetcher;

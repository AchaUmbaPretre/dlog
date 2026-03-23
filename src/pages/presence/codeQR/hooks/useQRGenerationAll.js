import { useState, useEffect } from "react"; // Added useEffect import
import { getGenerateQRAll } from "../../../../services/presenceService";

export const useQRGenerationAll = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchGeneration = async () => {
        try {
            setLoading(true);
            const response = await getGenerateQRAll();
            setData(response.data);
        } catch (error) {
            console.error('Error fetching generation : ', error);
        } finally {
            setLoading(false);
        }
    };

    const reload = () => {
        fetchGeneration();
    };

    useEffect(() => {
        fetchGeneration();
    }, []);

    return {
        loading,
        data,
        reload
    };
};
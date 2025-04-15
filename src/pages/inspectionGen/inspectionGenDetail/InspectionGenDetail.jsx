import React from 'react'

const InspectionGenDetail = ({ inspectionId }) => {
    const [data, setData] = useState([]);
    const scroll = { x: 400 };
    const [loading, setLoading] = useState(false);

        const fetchDatas = async() => {
            try {
                const { data } = await getSubInspection(inspectionId);
                setData(data)
    
            } catch (error) {
                notification.error({
                    message: 'Erreur de chargement',
                    description: 'Une erreur est survenue lors du chargement des données.',
                });
                setLoading(false);
            }
        }
    
        useEffect(()=> {
            fetchDatas()
        }, [inspectionId])

  return (
    <>

    </>
  )
}

export default InspectionGenDetail
import { useEffect, useState } from 'react'
import './validationDemandeForm.scss'
import { getBandeSortieOne } from '../../../../../services/charroiService';
import { notification } from 'antd';

const ValidationDemandeForm = ({closeModal, fetchData, id_bon}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await getBandeSortieOne(id_bon);
                setData(data[0]);
                setLoading(false);
            } catch (error) {
                notification.error({
                    message: 'Erreur de chargement',
                    description: 'Une erreur est survenue lors du chargement des données.',
                });
                setLoading(false);
            }
        }

        fetchData()
    }, [id_bon]);

  return (
    <>
        <div className="validationDemandeForm">
            <div className="validationDemandeForm_wrapper">

            </div>
        </div>
    </>
  )
}

export default ValidationDemandeForm
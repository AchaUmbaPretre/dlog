import { useEffect, useState } from 'react'
import { notification, Button } from 'antd';
import './securiteSortie.scss'
import { getSortieVehicule } from '../../../../services/charroiService';

const SecuriteSortie = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async() => {
        try {
            const { data } = await getSortieVehicule();
            setData(data)
            setLoading(false);
        } catch (error) {
            notification.error({
            message: 'Erreur de chargement',
            description: 'Une erreur est survenue lors du chargement des données.',
            });
            setLoading(false);
        }
    }

    useEffect(()=> {
        fetchData()
    }, [])

    const onFinish = () => {
        try {
            const value = {

            }
        } catch (error) {
            
        }
    }

  return (
    <>
        <div className='securiteSortie'>
            <div className="securiteSortie_wrapper">
                <h2 className="securite_sortie_h2">Liste des véhicules à sortir</h2>
                <div className="securite_sortie_rows">
                    <div className="securite_sortie_row">
                        <div className="row">
                            <strong className="securite_strong">Véhicule : <span className="securite_desc">12BD1</span></strong>
                            <strong className="securite_strong">Chauffeur : <span className="securite_desc">Héritier</span></strong>
                        </div>

                        <Button type='primary' className='securite_btn'>
                            Sortie
                        </Button>

                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default SecuriteSortie
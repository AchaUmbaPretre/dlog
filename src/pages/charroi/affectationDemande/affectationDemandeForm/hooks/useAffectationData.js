import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { Form } from "antd";
import { getChauffeur, getDemandeVehiculeOne, getDestination, getMotif, getServiceDemandeur, getVehiculeDispo } from "../../../../../services/charroiService";
import { getClient } from "../../../../../services/clientService";
import { useSelector } from "react-redux";

export const useAffectationData = ({ id_demande_vehicule }) => {
    const [form] = Form.useForm();
    const [ destination, setDestination ] = useState([]);
    const [ loadingData, setLoadingData ] = useState(false);
    const [ vehicule, setVehicule ] = useState([]);
    const [ chauffeur, setChauffeur ] = useState([]);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const [ motif, setMotif ] = useState([]);
    const [ service, setService ] = useState([]);
    const [ client, setClient ] = useState([]);

    const load = useCallback( async() => {
            setLoadingData(true);
            try {
                const [vehiculeData, chaufferData, serviceData, motifData, clientData, localData] = await Promise.all([
                    getVehiculeDispo(),
                    getChauffeur(),
                    getServiceDemandeur(),
                    getMotif(),
                    getClient(),
                    getDestination()
                ]);
    
                setVehicule(vehiculeData.data);
                setChauffeur(chaufferData.data?.data);
                setService(serviceData.data);
                setMotif(motifData.data);
                setClient(clientData.data);
                setDestination(localData.data);
    
                if(id_demande_vehicule) {
                    const { data : d } = await getDemandeVehiculeOne(id_demande_vehicule);
                    form.setFieldsValue({
                        date_prevue : moment(d[0].date_prevue),
                        date_retour : moment(d[0].date_retour),
                        id_type_vehicule : d[0].id_type_vehicule,
                        id_motif_demande : d[0].id_motif_demande,
                        id_demandeur : d[0].id_demandeur,
                        id_client : d[0].id_client,
                        id_destination : d[0].id_destination,
                        personne_bord : d[0].personne_bord
                    })
                }
                
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoadingData(false);
            }
    }, [])

    useEffect(() => {
        load();
    }, [load, id_demande_vehicule]);

    return {
        destination,
        loadingData,
        vehicule,
        chauffeur,
        userId,
        motif,
        service,
        client,
        reload: load
    }
}
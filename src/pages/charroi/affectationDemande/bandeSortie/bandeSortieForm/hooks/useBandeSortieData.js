import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { Form } from "antd";
import { useSelector } from "react-redux";
import { 
    getAffectationDemandeOne, 
    getChauffeur, 
    getDestination, 
    getMotif, 
    getTypeVehicule, 
    getVehicule, 
    getServiceDemandeur 
} from "../../../../../../services/charroiService";
import { getClient } from "../../../../../../services/clientService";
import { getSociete } from "../../../../../../services/userService";

export const useBandeSortieData = (affectationId) => {
    const [form] = Form.useForm();
    const [loadingData, setLoadingData] = useState(false);
    const [vehicule, setVehicule] = useState([]);
    const [chauffeur, setChauffeur] = useState([]);
    const [type, setType] = useState([]);
    const [motif, setMotif] = useState([]);
    const [service, setService] = useState([]);
    const [client, setClient] = useState([]);
    const [destination, setDestination] = useState([]);
    const [societe, setSociete] = useState([]);
    const userId = useSelector(state => state.user?.currentUser?.id_utilisateur);

    const load = useCallback(async () => {
        try {
            setLoadingData(true);

            const [
                vehiculeData,
                chauffeurData,
                serviceData,
                typeData,
                motifData,
                clientData,
                destinationData,
                societeData
            ] = await Promise.all([
                getVehicule(),
                getChauffeur(),
                getServiceDemandeur(),
                getTypeVehicule(),
                getMotif(),
                getClient(),
                getDestination(),
                getSociete()
            ]);

            setVehicule(vehiculeData.data?.data || []);
            setChauffeur(chauffeurData.data?.data || []);
            setService(serviceData.data || []);
            setType(typeData.data || []);
            setMotif(motifData.data || []);
            setClient(clientData.data || []);
            setDestination(destinationData.data || []);
            setSociete(societeData.data || []);

            if (affectationId) {
                const { data: d } = await getAffectationDemandeOne(affectationId);
                if (d?.length) {
                    const affectation = d[0];
                    form.setFieldsValue({
                        id_vehicule: affectation.id_vehicule,
                        id_chauffeur: affectation.id_chauffeur,
                        date_prevue: moment(affectation.date_prevue),
                        date_retour: moment(affectation.date_retour),
                        id_type_vehicule: affectation.id_type_vehicule,
                        id_motif_demande: affectation.id_motif_demande,
                        id_demandeur: affectation.id_demandeur,
                        id_client: affectation.id_client,
                        id_destination: affectation.id_destination,
                        personne_bord: affectation.personne_bord,
                        commentaire: affectation.commentaire
                    });
                }
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoadingData(false);
        }
    }, [form, affectationId]);

    useEffect(() => {
        load();
    }, [load]);

    return {
        form,
        loadingData,
        vehicule,
        chauffeur,
        userId,
        type,
        motif,
        service,
        client,
        destination,
        societe,
        reload: load
    };
};

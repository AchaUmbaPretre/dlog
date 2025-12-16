import { notification } from "antd";
import { postRepGenerateur } from "../../../../../services/generateurService";

export function useReparationGenSubmit({ onSuccess } = {}) {
    const [submitting, setSubmitting] = useState(false);
    
    const submit = async({ payload }) => {
        setSubmitting(true);

        try {
            await postRepGenerateur(payload);
            notification.success({ message: 'Succès', description :'Enregistrement réussi.'})
            
            onSuccess && onSuccess();
            return { ok: true };
        } catch (error) {
            console.error('usePleinGenerateurSubmit.submit', err);
            notification.error({ message: 'Erreur', description: 'Échec de lopération.' });
            return { ok: false, error: err }
        } finally {
            setSubmitting(false);
        }
    };
    return { submitting, submit }
}
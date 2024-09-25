import React, { useState } from 'react';
import axios from 'axios';
import { postTacheDocExcel } from '../../../services/tacheService';

const UploadTacheExcel = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('chemin_document', file);

        try {
            const response = await postTacheDocExcel(formData);
            alert(response.data.message);
        } catch (error) {
            console.error('Erreur lors de l\'upload du fichier', error);
        }
    };

    return (
        <div>
            <h2>Importer des Tâches via Excel</h2>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            <button onClick={handleUpload}>Uploader</button>
        </div>
    );
};

export default UploadTacheExcel;

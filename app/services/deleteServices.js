import api from '@/lib/api';

export const deleteCons = async ({ id }) => {
    console.log("id di deletCons", id)
    console.log("id di deletCons", id)
    console.log("id di deletCons", id)
    return api.delete(`/legal-consultation/delBySp/${id}`, {
        
    });
};

export const deleteVio = async ({ id }) => {
    console.log("id di deleteVio", id)
    console.log("id di deleteVio", id)
    console.log("id di deleteVio", id)
    return api.delete(`/disciplinary-report/delBySp/${id}`, {
    });
};


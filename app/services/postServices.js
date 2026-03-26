import api from '@/lib/api';

export const postConsultationByKabkoKatim = async (data) => {
  const res = await api.post(`/legal-consultation/postConsultationByKabkoKatim`, {
    data, 
  });
  return res.data;
};

export const postDisciplineByKabkoKatim = async ( data) => {
  const res = await api.post(`/disciplinary-report/postDisciplineByKabkoKatim/`, {
    data, 
  });
  return res.data;
};

export const postFollowUps = async ( data) => {
  const res = await api.post(`/monitoring/postFollowUps/`, {
    data, 
  });
  return res.data;
};
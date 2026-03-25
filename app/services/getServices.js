import api from '@/lib/api';

export const getAllConsultation  = async() => {
  const res = await api.get(`/legal-consultation/getAllConsultation`);
  return res.data;
};

export const getAllDiscipline  = async() => {
  const res = await api.get(`/disciplinary-report/getAllDiscipline`);
  return res.data;
};
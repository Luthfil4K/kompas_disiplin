import api from '@/lib/api';

export const patchStatus = async ({ id, data }) => {
  return api.patch(`/monitoring/patchStatus/${id}`, {
    data,
  });
};

export const patchFollowUps = async ({ id, data }) => {
  
  return api.patch(`/monitoring/patchFollowUps/${id}`, {
   data
  });
};
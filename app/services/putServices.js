import api from "../lib/api";

export const updateStatusByKabagTu = async ({ id, status, role }) => {
  return api.patch(`/monitoring/updateStatus/${id}`, {
    status,
    role,
  });
};
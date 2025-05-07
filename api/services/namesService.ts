import apiClients from '../clients/globalClient';
import { API_ENDPOINTS } from '../config/apiConfig';

export interface NameData {
  native: string;
  latin: string;
}

export interface NamesResponse {
  [key: string]: NameData;
}

export const fetchAllNames = async (): Promise<NamesResponse> => {
  const response = await apiClients.ISLAMIC_DEVELOPERS.get(API_ENDPOINTS.NAMES_OF_ALLAH);
  return response.data;
};

export const fetchNameByNumber = async (number: number): Promise<NameData> => {
  const response = await apiClients.ISLAMIC_DEVELOPERS.get(API_ENDPOINTS.NAMES_OF_ALLAH, {
    params: { number },
  });
  return response.data[number.toString()];
};

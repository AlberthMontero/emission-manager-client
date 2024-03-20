import axios from "axios";

const API_BASE_URL = "http://localhost:8080"; // Replace with your BackEnd API URL

export const apiService = axios.create({
  baseURL: API_BASE_URL,
});

export interface Company {
  id: number;
  companyName: string;
  naceCode: string;
  gva: number;
  scope1Emissions: number;
  scope2Emissions: number;
  scope3Emissions: number;
}

export const fetchCompanyEmissions = async (): Promise<Company[]> => {
  try {
    const response = await apiService.get("/companies");
    return response.data;
  } catch (error) {
    console.error("Error fetching company emissions:", error);
    throw error;
  }
};

export const deleteCompany = async (companyId: number): Promise<void> => {
  try {
    await apiService.delete(`/companies/${companyId}`);
  } catch (error) {
    console.error("Error deleting company:", error);
    throw error;
  }
};

export const updateCompany = async (
  companyId: number,
  updatedCompany: Company
): Promise<Company> => {
  try {
    const response = await apiService.put(
      `/companies/${companyId}`,
      updatedCompany
    );
    return response.data;
  } catch (error) {
    console.error("Error updating company:", error);
    throw error;
  }
};

export const addCompany = async (newCompany: Company): Promise<Company> => {
  try {
    const response = await apiService.post("/companies", newCompany);
    return response.data;
  } catch (error) {
    console.error("Error adding company:", error);
    throw error;
  }
};

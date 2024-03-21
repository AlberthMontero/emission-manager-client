<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { fetchCompany, deleteCompany, addCompany, updateCompany } from '../services/apiService';
import type { Company } from '../services/apiService';

// Define reactive vars for company data
const companies = ref<Company[]>([]);
const selected = ref<Company>()
const id = ref<number>()
const companyName = ref<string>('')
const naceCode = ref<string>('')
const gva = ref<number>()
const scope1Emissions = ref<number>()
const scope2Emissions = ref<number>()
const scope3Emissions = ref<number>()

// Load company data from the API using ApiService
const loadCompanies = async () => {
  try {
    companies.value = await fetchCompany();
  } catch (error) {
    console.error('Error fetching companies:', error);
  }
};

// Call loadCompanies function when component is mounted
onMounted(loadCompanies);

// Update selected company details when selection changes
watch(selected, (companyId) => {
  const selectedCompany = companies.value.find((company) => company.id === companyId as unknown as number)
  if (selectedCompany) {
    id.value = selectedCompany.id;
    companyName.value = selectedCompany.companyName;
    naceCode.value = selectedCompany.naceCode;
    gva.value = selectedCompany.gva;
    scope1Emissions.value = selectedCompany.scope1Emissions;
    scope2Emissions.value = selectedCompany.scope2Emissions;
    scope3Emissions.value = selectedCompany.scope3Emissions;
  }
})

// Create a new company
async function createCompany() {
  if (hasValidInput()) {
    const newCompany: Company = getCompanyObj();
    // Call ApiService to create a new company
    await addCompany(newCompany);
    clearInput()
  }
}

// Update the selected company
async function changeCompany() {
  if (hasValidInput() && selected.value !== undefined) {
    const idx = companies.value.findIndex((company) => company.id === selected.value)
    if (idx !== -1) {
      const updatedCompany: Company = getCompanyObj();
      // Call ApiService to update the selected company
      await updateCompany(id.value as number, updatedCompany);
      clearInput()
    }

  }
}

// Delete the selected company
async function removeCompany() {
  if (selected.value !== undefined) {
    // Call ApiService to delete the selected company
    await deleteCompany(id.value as number)
    clearInput()
  }
}

// Generate company object with input data
function getCompanyObj(): Company {
  return {
    companyName: companyName.value,
    naceCode: naceCode.value,
    gva: gva.value,
    scope1Emissions: scope1Emissions.value,
    scope2Emissions: scope2Emissions.value,
    scope3Emissions: scope3Emissions.value
  }
}

// Check if input fields are valid
function hasValidInput() {
  return companyName.value.trim() !== ''
    && naceCode.value.trim() !== ''
    && gva.value as number > 0
    && scope1Emissions.value as number > 0
    && scope2Emissions.value as number > 0
    && scope3Emissions.value as number > 0
}

// Clear input fields
async function clearInput() {
  id.value = undefined;
  companyName.value = ''
  naceCode.value = '';
  gva.value = undefined;
  scope1Emissions.value = undefined;
  scope2Emissions.value = undefined;
  scope3Emissions.value = undefined;
  selected.value = undefined
  // Reload companies after deletion
  await loadCompanies();
}
</script>

<template>
  <div>
    <h2>Company Emissions List</h2>

    <select size="5" v-model="selected">
      <option v-for="company in companies" :key="company.id" :value="company.id">{{ company.companyName }}</option>
    </select>
    <span>Selected id: {{ selected }}</span>
  </div>

  <div>
    <label>Company Name: <input v-model="companyName"></label><br>
    <label>NACE: <input v-model="naceCode"></label><br>
    <label>GVA: <input type="number" v-model.number="gva"></label><br>
    <label>Scope 1 Emissions: <input type="number" v-model.number="scope1Emissions"></label><br>
    <label>Scope 2 Emissions: <input type="number" v-model.number="scope2Emissions"></label><br>
    <label>Scope 3 Emissions: <input type="number" v-model.number="scope3Emissions"></label><br>
  </div>

  <div class="buttons">
    <button @click="createCompany">Create</button>
    <button @click="changeCompany">Update</button>
    <button @click="removeCompany">Delete</button>
    <button style="background-color: #a94dfe;" @click="clearInput">Clear</button>
  </div>
</template>

<style>
* {
  font-size: inherit;
}

input {
  margin-bottom: 10px;
  width: 100%;
}

select {
  width: 100%;
  margin-bottom: 10px;
}

.buttons {
  clear: both;
  margin-top: 5px;
}

.buttons>button {
  background-color: #35495e;
}

button+button {
  margin-left: 5px;
}
</style>
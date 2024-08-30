import { DEAL_SUB_SOURCE, CLUSTER_AREA } from "./constants";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateClusterLeads = (uploadedClusterData) => {
  const validItems = [];
  const gstinMap = new Map();
  const pocContactMap = new Map();
  const invalidItems = [];

  uploadedClusterData.forEach((item, index) => {
    const gstin = item.gstin?.trim() || "";
    const pocContact = item.poc_contact
      ? typeof item.poc_contact === "string"
        ? item.poc_contact.trim()
        : String(item.poc_contact).trim()
      : "";

    if (gstin) {
      if (!gstinMap.has(gstin)) {
        gstinMap.set(gstin, [index]);
      } else {
        gstinMap.get(gstin).push(index);
      }
    }

    if (pocContact) {
      if (!pocContactMap.has(pocContact)) {
        pocContactMap.set(pocContact, [index]);
      } else {
        pocContactMap.get(pocContact).push(index);
      }
    }
  });
  for (const item of uploadedClusterData) {
    const pocContactNumber = item.poc_contact
      ? typeof item.poc_contact === "string"
        ? item.poc_contact.trim()
        : String(item.poc_contact).trim()
      : "";

    const gstin = item.gstin?.trim() || "";
    const pocName = item.poc_name?.trim() || "";
    const pocEmail = item.poc_email?.trim() || "";
    const clusterArea = item.cluster_area?.trim() || "";
    const dealSubSource = item.deal_sub_source?.trim() || "";
    const companyName = item.company_name?.trim() || "";

    let errorMesage = "";
    if (!companyName) {
      errorMesage += "Company name is required | ";
    }
    if (!dealSubSource || !DEAL_SUB_SOURCE.includes(dealSubSource)) {
      errorMesage += "Invalid Deal sub source | ";
    }
    if (!gstin) {
      errorMesage += "GSTIN is required | ";
    }
    if (gstin && gstin.length !== 15) {
      errorMesage += "GSTIN must be 15 characters | ";
    }
    if (!pocContactNumber || pocContactNumber.length !== 10) {
      errorMesage += "Invalid POC contact | ";
    }
    if (!pocName || pocName.length === 0) {
      errorMesage += "POC name is required | ";
    }
    if (clusterArea && !CLUSTER_AREA.includes(clusterArea)) {
      errorMesage += "Invalid Cluster area | ";
    }
    if (pocEmail && pocEmail.length > 0 && !emailRegex.test(pocEmail)) {
      errorMesage += "Invalid POC email format | ";
    }
    if (gstin && gstinMap.get(gstin).length > 1) {
      errorMesage += "Duplicate GSTIN found | ";
    }
    if (pocContactNumber && pocContactMap.get(pocContactNumber).length > 1) {
      errorMesage += "Duplicate POC contact found | ";
    }

    if (errorMesage.length > 0) {
      invalidItems.push({ ...item, invalidMessage: errorMesage });
    } else {
      validItems.push(item);
    }
  }
  return { validItems, invalidItems };
};

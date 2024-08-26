import { DEAL_SUB_SOURCE, CLUSTER_AREA } from "./constants";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateClusterLeads = (uploadedClusterData) => {
  const validItems = [];
  const gstinMap = new Map();
  const pocContactMap = new Map();
  const invalidItems = [];

  uploadedClusterData.forEach((item, index) => {
    const gstin = item.gstin?.trim() || "";
    const pocContact =
      typeof item.poc_contact === "string"
        ? item.poc_contact.trim()
        : String(item.poc_contact).trim();

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
    const pocContactNumber =
      typeof item.poc_contact === "string"
        ? item.poc_contact.trim()
        : String(item.poc_contact).trim();

    const gstin = item.gstin?.trim() || "";
    const pocName = item.poc_name?.trim() || "";
    const pocEmail = item.poc_email?.trim() || "";
    const clusterArea = item.cluster_area?.trim() || "";
    const dealSubSource = item.deal_sub_source?.trim() || "";
    const companyName = item.company_name?.trim() || "";

    let errorMesage = "";
    if (!!companyName || companyName.trim().length === 0) {
      errorMesage += "Company name is required | ";
    }
    if (
      !!item.deal_sub_source ||
      item.deal_sub_source.trim().length === 0 ||
      !DEAL_SUB_SOURCE.includes(dealSubSource)
    ) {
      errorMesage += "Deal sub source is required | ";
    }
    if (!!gstin || gstin.trim().length === 0 || gstin.length !== 15) {
      errorMesage += "GSTIN is required | ";
    }
    if (
      !!pocContactNumber ||
      pocContactNumber.trim().length === 0 ||
      pocContactNumber.length !== 10
    ) {
      errorMesage += "POC contact is required | ";
    }
    if (!!pocName || pocName.trim().length === 0) {
      errorMesage += "POC name is required | ";
    }
    if (!!clusterArea && !CLUSTER_AREA.includes(clusterArea.trim())) {
      errorMesage += "Invalid Cluster area | ";
    }
    if (!!pocEmail && pocEmail.trim().length > 0) {
      if (!emailRegex.test(pocEmail)) {
        errorMesage += "Invalid POC email format | ";
      }
    }
    if (gstin && gstinMap.get(gstin.trim()).length > 1) {
      errorMesage += "Duplicate GSTIN found | ";
    }
    if (
      pocContactNumber &&
      pocContactMap.get(pocContactNumber.trim()).length > 1
    ) {
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

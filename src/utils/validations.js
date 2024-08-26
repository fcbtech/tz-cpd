import { DEAL_SUB_SOURCE, CLUSTER_AREA } from "./constants";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateClusterLeads = (uploadedClusterData) => {
  const validItems = [];
  const gstinMap = new Map();
  const pocContactMap = new Map();
  const invalidItems = [];

  uploadedClusterData.forEach((item, index) => {
    const gstin = item.gstin?.trim();
    const pocContact =
      typeof item.poc_contact === "string"
        ? item.poc_contact.trim()
        : item.poc_contact;

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
    const errorMesage = "";
    if (!!item.company_name || item.company_name.trim().length === 0) {
      errorMesage += "Company name is required | ";
    }
    if (
      !!item.deal_sub_source ||
      item.deal_sub_source.trim().length === 0 ||
      !DEAL_SUB_SOURCE.includes(item.deal_sub_source)
    ) {
      errorMesage += "Deal sub source is required | ";
    }
    if (
      !!item.gstin ||
      item.gstin.trim().length === 0 ||
      item.gstin.length !== 15
    ) {
      errorMesage += "GSTIN is required | ";
    }
    if (
      !!item.poc_contact ||
      item.poc_contact.trim().length === 0 ||
      item.poc_contact.length !== 10
    ) {
      errorMesage += "POC contact is required | ";
    }
    if (!!item.poc_name || item.poc_name.trim().length === 0) {
      errorMesage += "POC name is required | ";
    }
    if (item.cluster_area && !CLUSTER_AREA.includes(item.cluster_area.trim())) {
      errorMesage += "Invalid Cluster area | ";
    }
    if (item.poc_email && item.poc_email.trim().length > 0) {
      if (!emailRegex.test(item.poc_email)) {
        errorMesage += "Invalid POC email format | ";
      }
    }
    if (item.gstin && gstinMap.get(item.gstin.trim()).length > 1) {
      errorMesage += "Duplicate GSTIN found | ";
    }
    if (
      item.poc_contact &&
      pocContactMap.get(item.poc_contact.trim()).length > 1
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

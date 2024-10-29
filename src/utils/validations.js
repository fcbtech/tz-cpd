import { DEAL_SUB_SOURCE } from "./constants";

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
        ? String(item.poc_contact.trim().replace(/\D/g, ""))
        : String(item.poc_contact).trim().replace(/\D/g, "")
      : "";

    const pincode = item.pincode
      ? typeof item.pincode === "string"
        ? item.pincode.trim().replace(/\D/g, "")  // Keep only digits
        : String(item.pincode).trim().replace(/\D/g, "")
      : "";

    const gstin = item.gstin?.trim() || "";
    const pocName = item.poc_name?.trim() || "";
    const pocEmail = item.poc_email?.trim() || "";
    const dealSubSource = item.deal_sub_source?.trim() || "";
    const companyName = item.company_name?.trim() || "";
    const address = item.address?.trim() || "";
    const manufactured_product = item.manufactured_product?.trim() || "";
    const website_link = item.website_link?.trim() || "";
    const indiamart_link = item.indiamart_link?.trim() || "";

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
    if (!pincode || pincode.length !== 6) {
      errorMesage += "Invalid pincode | ";
    }
    if (!address || address.length === 0) {
      errorMesage += "Address is required | ";
    }
    if (!manufactured_product || manufactured_product.length === 0) {
      errorMesage += "manufactured_product is required | ";
    }
    if ((!website_link || website_link.length === 0) && (!indiamart_link || indiamart_link.length === 0)) {
      errorMesage += "At least one of Website link or Indiamart link is required | ";
    }
    if (pocEmail && pocEmail.length > 0 && !emailRegex.test(pocEmail)) {
      errorMesage += "Invalid POC email format | ";
    }
    if (gstin && gstinMap.get(gstin).length > 1) {
      errorMesage += "Duplicate GSTIN found | ";
    }
    if (pocContactNumber && pocContactMap.has(pocContactNumber) && pocContactMap.get(pocContactNumber).length > 1) {
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

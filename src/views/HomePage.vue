<template>
  <div>
    <div>
      <NavBar :userType="userType" :showAllotDataBtn="fetchedProspects.length === 0 && !isLoading" @allotData="initialize(1)" @uploadData="dialogUpload=true"/>
    </div>
    <v-snackbar class="text-center" location="bottom center" v-model="snackbar" :timeout="timeout" :color="snackbarColor">
      {{  snackbarMessage }}
    </v-snackbar>
      <div :style="[ isLoading ? {'margin-top' : '64px', 'filter' : 'blur(2px)' } : { 'margin-top' : '64px' }]">
      <Loader :loading='isLoading'/>
      <v-data-table :row-props="rowBackground" hover fixed-header height="500" density="compact" item-key="name" :search="search" :headers="headers" :items="filteredData" :sort-by="[{ key: 'company_name', order: 'asc' }]">
        <template
          v-for="(header, i) in headers.slice(1, headers.length)"
          v-slot:[`header.${header.key}`]="{ }"
        >
          <span>
            {{ header.title }}
          </span>
          <div @click.stop :key="i">
            <v-text-field
              :key="i"
              v-model="multiSearch[header.key]"
              class="text-capitalize pa"
              type="text"
              :placeholder="header.title"
            ></v-text-field>
          </div>
        </template>
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Cluster Prospect</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="1200px" max-height="1200px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Edit</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="3" sm="6">
                        <v-text-field v-model="editedItem['company_name']" label="Company Name"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3" sm="6">
                        <v-text-field v-model="editedItem['city']" label="City"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3" sm="6">
                        <SelectMenu :menu-text="State" :menu-list="statesList" :current-value="editedItem['state']" @menuUpdated="editedItem['state']=$event"/>
                      </v-col>
                      <v-col cols="12" md="3" sm="6">
                        <v-text-field v-model="editedItem['gstin']" label="GSTIN"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3" sm="6">
                        <SelectMenu :menu-text="Sector" :menu-list="sectorList" :current-value="editedItem['sector']" @menuUpdated="editedItem['sector']=$event"/>
                      </v-col>
                      <v-col cols="12" md="3" sm="6">
                        <SelectMenu :menu-text="Turnover" :menu-list="turnoverList" :current-value="editedItem['turnover']" @menuUpdated="editedItem['turnover']=$event"/>
                      </v-col>
                      <v-col cols="12" md="3" sm="6">
                        <SelectMenu :menu-text="Industry" :menu-list="industryList" :current-value="editedItem['industry']" @menuUpdated="editedItem['industry']=$event"/>
                      </v-col>
                      <v-col cols="12" md="3" sm="6">
                        <v-text-field v-model="editedItem['poc_name']" label="POC Name"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3" sm="6">
                        <v-text-field v-model="editedItem['poc_contact_no']" label="POC Contact No"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3" sm="6">
                        <v-text-field v-model="editedItem['poc_email']" label="POC Email"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3" sm="6">
                        <v-text-field v-model="editedItem['poc_designation']" label="POC Designation"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3" sm="6">
                        <v-text-field v-model="editedItem['indiamart_link']" label="Indiamart Link"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3" sm="6">
                        <v-text-field v-model="editedItem['website']" label="Website"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3" sm="6">
                        <v-text-field v-model="editedItem['mfg_product']" label="Product"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="3" sm="6">
                        <v-text-field v-model="editedItem['quality_tag']" label="Quality Tag"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue-darken-1" variant="text" @click="save">
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogPickDeal" max-width="500px">
              <v-card loading max-height="200px">
                <v-card-text class="text-center text-h5">Are you sure you want to pick this deal?</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="closePickDeal">No</v-btn>
                  <v-btn color="blue-darken-1" variant="text" @click="pickDeal">Yes</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogUpload" max-width="800px">
              <template v-slot:activator="{ props }">
                <!-- <v-btn class="mb-2" color="primary" dark v-bind="props">
                  Bulk Upload (Create/Update)
                </v-btn> -->
              </template>
              <v-card>
                <v-card-title class="text-center">
                  <span class="text-h6"> Upload Data for Creation/Updation </span>
                </v-card-title>

                <v-card-text>
                  <v-file-input @change="handleFileUpload" accept=".xlsx" :rules="rules"  label="Upload excel file" prepend-icon="mdi-file"/>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="closeUpload">
                    Cancel
                  </v-btn>
                  <v-btn color="blue-darken-1" variant="text" @click="uploadExcel" :disabled="isDisabled">
                    Upload to Database
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn v-if="userType === 'Cluster Team' && item['ase_processed_sts'] !== 2" class="mr-5" color="blue-darken-1" variant="tonal" size="small" roudned="sm" @click="this.dialogPickDeal = true; this.pickDealIndex = this.fetchedProspects.indexOf(item)">
            Pick Deal
          </v-btn>
          <v-icon v-if="userType === 'Cluster Team' && item['ase_processed_sts'] !== 2" class="me-2" size="x-small" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-btn v-if="userType === 'Data Team'" class="mr-5" color="blue-darken-1" variant="tonal" size="small" roudned="sm" @click="editItem(item)">
            Edit
            <v-icon class="me-2" size="x-small">
              mdi-pencil
            </v-icon>
          </v-btn>
        </template>
        <template v-slot:item.hb_deal_id="{ item }">
          <a :href="`https://app.hubspot.com/contacts/22031796/record/0-3/`+ item['hb_deal_id']" target="_blank">
            {{ item['hb_deal_id'] }}
          </a>
        </template>
        <template v-slot:item.hb_deal_creation_date="{ item }">
          {{ getDateInFormat(item['hb_deal_creation_date'].value) }}
        </template>
        <!-- <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">
            Allot Data
          </v-btn>
        </template> -->
      </v-data-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { checkAuthentication, getJWTTokenFromLocalStorage } from '@/utils/authentication'
import { DEAL_SUB_SOURCE, CLUSTER_AREA } from '@/utils/constants'
import router from '@/router'
import * as XLSX from 'xlsx';
import { validateClusterLeads } from '@/utils/validations'

export default {
  data: () => ({
    isLoading: false,
    userType: '',
    snackbar: false,
    snackbarMessage: 'Something Went Wrong',
    snackbarColor: 'red-lighten-3',
    timeout: 6000,
    rules: [
      value => {
        return (
          !value ||
          !value.length ||
          value[0].size < 2000000 ||
          'Avatar size should be less than 2 MB!'
        )
      },
    ],
    multiSearch: {},
    search: '',
    dialog: false,
    dialogUpload: false,
    dialogPickDeal: false,
    pickDealIndex: -1,
    uploadedFile: [],
    headers: [
      { title: 'Actions', key: 'actions', sortable: false, align:'center',
        fixed: true, minWidth: '200', nowrap: true  },
      {
        title: 'Company Name',
        align: 'start',
        sortable: true,
        key: 'company_name',
        minWidth: '200'
      },
      { title: 'Deal ID', key: 'hb_deal_id',
        minWidth: '200' },
      { title: 'Sector', key: 'sector',
        minWidth: '200' },
      { title: 'Turnover', key: 'turnover',
        minWidth: '200' },
      { title: 'Industry', key: 'industry',
        minWidth: '200' },
      { title: 'POC', key: 'poc_name',
        minWidth: '200' },
      { title: 'POC Contact', key: 'poc_contact_no',
        minWidth: '200' },
      { title: 'Product', key: 'mfg_product',
        minWidth: '200' },
      { title: 'City', key: 'city',
        minWidth: '200' },
      { title: 'State', key: 'state',
        minWidth: '200' },
      { title: 'GSTIN', key: 'gstin',
        minWidth: '200' },
      { title: 'POC Email', key: 'poc_email',
        minWidth: '200' },
      { title: 'POC Designation', key: 'poc_designation',
        minWidth: '200' },
      { title: 'IndiaMart', key: 'indiamart_link',
        minWidth: '200' },
      { title: 'Website', key: 'website',
        minWidth: '200' },
      { title: 'Quality Tag', key: 'quality_tag',
        minWidth: '200' },
      { title: 'Deal Creation Date', key: 'hb_deal_creation_date',
        minWidth: '200' }
    ],
    fetchedProspects: [],
    editedIndex: -1,
    editedItem: {},
    defaultItem: {},
    uploadedExcelFile: null,
    invalidItems: [],
    validItems: [],
    apiResponse: [
      // Example API response data structure
      { rowNumber: 2, invalidMessage: 'Invalid email address' },
      { rowNumber: 5, invalidMessage: 'Missing phone number' }
    ],
    statesList: [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jammu and Kashmir",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttarakhand",
      "Uttar Pradesh",
      "West Bengal",
      "Andaman and Nicobar Islands",
      "Chandigarh",
      "Dadra and Nagar Haveli",
      "Daman and Diu",
      "Delhi",
      "Lakshadweep",
      "Puducherry"
    ],
    industryList:
    [
      'Fashion Accessories & Supplies',
      'Food and Beverage',
      'Gems, Jewellery & Astrology',
      'Industrial Machinery and Supplies',
      'Mechanical Tools and Supplies',
      'Automotive, Parts & Spares',
      'Electrical and Electronics',
      'Chemicals and Solvents',
      'Plastic and Polymers',
      'Packaging Machines and Materials',
      'Metals, Alloys & Minerals',
      'Instruments and Equipments',
      'Petroleum',
      'Drugs and Medical',
      'Building and Construction',
      'Apparel and Garments',
      'Textiles, Yarn & Fabrics',
      'Paper and Paper Products',
      'Agriculture and Farming',
      'Cosmetics and Personal care',
      'FMCG',
      'Handicrafts and Decoratives',
      'Furniture & Supplies',
      'House and Office Supplies',
      'Others'
    ],
    sectorList: [
      "Manufacturing",
      "Service",
      "Retail",
      "Trading",
      "Projects",
      "Other"
    ],
    turnoverList:
    [
      "1) Rs 0 to 40 Lakhs",
      "2) Rs 40 Lakhs to 1.5 Cr",
      "3) Rs 1.5 Cr to 5 Cr",
      "4) Rs 5 Cr to 25 Cr",
      "5) Rs 25 Cr to 100 Cr",
      "6) Rs 100 Cr to 500 Cr",
      "7) Rs 500 Cr and above",
      "8) Other"
    ]
  }),

  computed: {
    filteredData() {
        if (this.multiSearch) {
            return this.fetchedProspects.filter((item) => {
                return Object.entries(this.multiSearch).every(([key, value]) => {
                    if (value.includes("|") && !value.includes("!")) {
                        let el = value.split("|");
                        return el.some((elem) =>
                            (item[key] || "").toString().toUpperCase().startsWith(elem.toString().toUpperCase())
                        );
                    }
                    if (value.substring(0, 1) === "!" && !value.includes("|")) {
                        let el = value.split("!");
                        return el.some((elem) =>
                            !(item[key] || "").toString().toUpperCase().startsWith(elem.toString().toUpperCase())
                        );
                    }
                    if (value.includes("|") && value.substring(0, 1) === "!") {
                        let el = value.split("!")[1].split("|");
                        return !el.some((elem) =>
                            (item[key] || "").toString().toUpperCase().startsWith(elem.toString().toUpperCase())
                        );
                    }
                    if (value.substring(0, 1) === ">") {
                        let el = value.split(">");
                        if (item[key] !== " ") {
                          return Number(item[key] || "") > el[1];
                        }
                    }
                    if (value.substring(0, 1) === "<") {
                        let el = value.split("<");
                        if (item[key] !== " ") {
                          return Number(item[key] || "") < el[1];
                        }
                    }
                    if (value.substring(0, 1) === "=") {
                        let el = value.split("=");
                        return (item[key] || "").toString().toUpperCase() === el[1].toString().toUpperCase();
                    }
                    return (item[key] || "").toString().toUpperCase().includes(value.toString().toUpperCase());
                });
            });
        } else {
        return this.fetchedProspects;
        }
    },
    isDisabled() {
      return this.uploadedFile.length === 0;
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogPickDeal(val) {
      val || this.closePickDeal()
    }
  },

  created() {
    this.initialiseEditedItem()
    this.initialize(0)
  },

  methods: {
    rowBackground(item) {
      if(this.userType === 'Data Team' && item.item['dt_processed_sts'] === 2) {
        return { style: 'background: rgb(191 255 191);' };
      }
    },
    initialiseEditedItem() {
      this.editedItem = {}

      for(var i=0; i<this.headers.length; ++i) {
        const key = this.headers[i].key
        this.editedItem.key = ''
      }

      this.defaultItem = this.editedItem

    },
    async initialize(isNew, showMessage = true) {
      try {
        this.isLoading = true
        const isAuthenticated = await checkAuthentication()
        if(!isAuthenticated) {
          router.push('/')
          return;
        }
        let config = {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${getJWTTokenFromLocalStorage()}`,
          },
        };
        const fetchedTokenResponse = await axios.get(`https://asia-south1-tranzact-production.cloudfunctions.net/tz-cpd-api/tz-cpd/get-prospect?isNew=${isNew}`, config);
        // const fetchedTokenResponse = await axios.get(`http://localhost:56777/tz-cpd/get-prospect?isNew=${isNew}`, config);
        this.fetchedProspects = fetchedTokenResponse.data.data;
        if(fetchedTokenResponse.data.userType === 'dt')
          this.userType = 'Data Team'
        else if(fetchedTokenResponse.data.userType === 'ase')
          this.userType = 'Cluster Team'
        else
          this.userType = 'Unauthorised User'
        this.isLoading = false
        this.snackbarMessage = fetchedTokenResponse.data.message
        if(fetchedTokenResponse.data.success) {
          this.snackbarColor = 'blue-darken-1'
        } else {
          this.snackbarColor = 'red-lighten-3'
        }
        this.snackbar = showMessage
      } catch(error) {
        this.snackbar = true
        this.snackbarMessage = 'Error in Fetching Prospects'
        console.log('Error in fetching prospects', error)
      } finally {
        this.isLoading = false
      }
    },

    editItem(item) {
      if(this.userType === 'Data Team' && item['dt_processed_sts'] === 2) {
        this.snackbarMessage = 'Cannot Edit Enriched Prospect'
        this.snackbarColor = 'red-lighten-3'
        this.snackbar = true
        return
      }

      if(this.userType === 'Cluster Team' && item['ase_processed_sts'] === 2) {
        this.snackbarMessage = 'Cannot Edit Picked Deal'
        this.snackbarColor = 'red-lighten-3'
        this.snackbar = true
        return
      }
      this.editedIndex = this.fetchedProspects.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closePickDeal() {
      this.dialogPickDeal = false
      this.$nextTick(() => {
        this.pickDealIndex = -1
      })
    },

    async save() {
      try {
        this.isLoading = true
        if (this.editedIndex > -1) {
          if(!this.isObjectUpdated(this.fetchedProspects[this.editedIndex], this.editedItem)) {
            this.snackbarMessage = 'No Fields Edited'
            this.snackbarColor = 'red-lighten-3'
            this.snackbar = true
            this.isLoading = false
            return
          }
          Object.assign(this.fetchedProspects[this.editedIndex], this.editedItem)
          const updateProspectResponse = await this.updateProspectinDB(this.fetchedProspects[this.editedIndex])
          await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
          this.close()
          this.snackbarMessage = updateProspectResponse.data.message
          this.snackbarColor = 'blue-darken-1'
          this.snackbar = true
          this.isLoading = false
        } else {
          this.fetchedProspects.push(this.editedItem)
        }
        this.isLoading = false
      } catch(error) {
        this.snackbarMessage = 'Error in Updation'
        this.snackbarColor = 'red-lighten-3'
        this.snackbar = true
      } finally {
        this.close()
        this.isLoading = false
        await this.initialize(0, false)
      }
    },

    closeUpload() {
      this.dialogUpload = false
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      this.uploadedExcelFile = file
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        this.uploadedFile = XLSX.utils.sheet_to_json(worksheet);
      };
      reader.readAsArrayBuffer(file);
    },

    async uploadExcel() {
      this.isLoading = true
      //TODO: Trigger API for adding data to database and 
      //get the data for fields not added
      this.closeUpload();
      
      const { validItems, invalidItems } = validateClusterLeads(this.uploadedFile)
      this.invalidItems = invalidItems
      try {
        const isAuthenticated = await checkAuthentication()
        if(!isAuthenticated) {
          router.push('/')
          return;
        }
        let config = {
          api: {
            bodyParser: false
          },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${getJWTTokenFromLocalStorage()}`
          },
        };
        // const formData = new FormData();
        // formData.append('excelFile', this.uploadedFile);
        // const payload = formData
        const fetchedTokenResponse = await axios.post("https://asia-south1-tranzact-production.cloudfunctions.net/tz-cpd-api/tz-cpd/bulk-insert", validItems, config);
        // const fetchedTokenResponse = await axios.get("http://localhost:56777/tz-cpd-api/tz-cpd/bulk-insert", config);
        this.apiResponse = fetchedTokenResponse.data.data
        if(fetchedTokenResponse.data.code === 'insert_partial') {
          this.downloadErrorExcel()
        }
      } catch(error) {
        this.snackbar = true
        this.invalidItems = this.invalidItems.concat(this.apiResponse)
      }
      finally {
        this.isLoading = false
        if(this.invalidItems.length > 0) {
          this.downloadErrorExcel()
        }
      }

      this.uploadedFile = []
    },

    async downloadErrorExcel () {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert the worksheet to JSON for easier manipulation
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Add new columns headers if they don't exist
        if (sheetData[0].indexOf('invalid') === -1) {
          sheetData[0].push('invalid', 'invalidMessage');
        }

        // Add invalid and invalidMessage to the corresponding rows
        this.apiResponse.forEach(({ rowNumber, invalidMessage }) => {
          if (sheetData[rowNumber]) {
            // Ensure the row has enough columns to accommodate new data
            sheetData[rowNumber][sheetData[0].length - 2] = 'true';
            sheetData[rowNumber][sheetData[0].length - 1] = invalidMessage;
          }
        });

        // Convert the updated JSON back to worksheet
        const updatedWorksheet = XLSX.utils.aoa_to_sheet(sheetData);

        // Update the worksheet in the workbook
        workbook.Sheets[firstSheetName] = updatedWorksheet;

        // Create a new Excel file and trigger download
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
        const blob = new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'updated_file.xlsx';
        link.click();
      };

      reader.readAsArrayBuffer(this.uploadedExcelFile);
    },

    s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    },
    async updateProspectinDB(enrichedProspect) {
      const isAuthenticated = await checkAuthentication()
      if(!isAuthenticated) {
        router.push('/')
        return;
      }
      let config = {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${getJWTTokenFromLocalStorage()}`,
        },
      };
      const payload = [enrichedProspect]
      const fetchedTokenResponse = await axios.post("https://asia-south1-tranzact-production.cloudfunctions.net/tz-cpd-api/tz-cpd/enrich", payload, config);
      return fetchedTokenResponse
    },

    async pickDeal() {
      try {
        const prospect = this.fetchedProspects[this.pickDealIndex]
        
        if(prospect['ase_processed_sts'] === 2) {
          this.snackbarMessage = 'Deal Already Picked'
          this.snackbarColor = 'red-lighten-3'
          this.snackbar = true
          return
        }

        this.closePickDeal()
        this.isLoading = true
        const isAuthenticated = await checkAuthentication()
        if(!isAuthenticated) {
          router.push('/')
          return;
        }
        let config = {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${getJWTTokenFromLocalStorage()}`,
          },
        };
        const payload = [prospect]
        const fetchedTokenResponse = await axios.post("https://asia-south1-tranzact-production.cloudfunctions.net/tz-cpd-api/tz-cpd/create-deal", payload, config);
        this.snackbarMessage = fetchedTokenResponse.data.message
        this.snackbarColor = 'blue-darken-1'
        this.snackbar = true
      } catch(error) {
        this.snackbar = true
        this.snackbarMessage = 'Error in Creating Deal'
        this.closePickDeal()
        console.log('Error in creating deal', error)
      } finally {
        this.closePickDeal()
        this.isLoading = false
        this.initialize(0, false)
      }
    },

    isObjectUpdated (prospect, enrichedProspect) {
      for(const field of Object.keys(prospect)) {
        prospect[field] = this.removeSpaces(prospect[field])
        prospect[field] = this.removeSpaces(prospect[field])

        if(prospect[field] !== enrichedProspect[field]) {
          return true
        }
      }

      return false
    },

    removeSpaces(str) {
      if(typeof str !== 'string') {
        return str 
      }
      let start = 0
      let end = str.length - 1

      while(start < str.length && str[start] === ' ')
        ++start

      while(end > start && end >= 0 && str[end] === ' ')
        --end

      return str.slice(start, end+1)
    },

    getDateInFormat (dateStamp) {
      const date = new Date(dateStamp)
      const dateString = date.toString().split(' ')
      return dateString[2] + ' ' + dateString[1] + ' ' + dateString[3] + '(' + dateString[4] + ')'
    }
  },
}
</script>
<style scoped>
.allot-data {
  width: 100%;
  height: 100%;
  position: relative;
  /* background: rgba(255, 255, 255, 0.8); */
  /* padding-top: 200px; */
  /* font-size: 30px; */
}

.allot-data-btn {
  position: fixed;
  top: 50%;
  left: 45%;
  z-index: 9999;
}
</style>
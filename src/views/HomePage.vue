<template>
  <div>
    <div>
      <NavBar />
    </div>
    <!-- <SnackBar :snack-bar="snackbar" message-text="SOME ERROR" /> -->
    <!-- <v-snackbar v-model="snackbar" :timeout="timeout" color="red-lighten-3">
      'Error '
    </v-snackbar> -->
    <div style="margin-top:100px;">
      <!-- <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field> -->
      <v-data-table hover fixed-header height="500" density="compact" item-key="name" :search="search" :headers="headers" :items="filteredData" :sort-by="[{ key: 'company_name', order: 'asc' }]">
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
              :placeholder="header.key.charAt(0).toUpperCase() + header.key.slice(1)"
            ></v-text-field>
          </div>
        </template>
        <!-- <template v-slot:text>
          <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            single-line
          ></v-text-field>
        </template> -->
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Cluster Prospect</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!-- <v-dialog v-model="dialog" max-width="500px"> -->
            <v-dialog v-model="dialog" max-width="1000px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Edit</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col  cols="12" md="3" sm="6" v-for="(header) in headers.slice(1, headers.length)">
                        <v-text-field v-model="editedItem[header.key]" :label="header.title" />
                      </v-col>
                      <!-- <v-col cols="12" md="4" sm="6">
                        <v-text-field v-model="editedItem.name" label="Dessert name"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4" sm="6">
                        <v-text-field v-model.number="editedItem.calories" label="Calories"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4" sm="6">
                        <v-text-field v-model.number="editedItem.fat" label="Fat (g)"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4" sm="6">
                        <v-text-field v-model.number="editedItem.carbs" label="Carbs (g)"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4" sm="6">
                        <v-text-field v-model.number="editedItem.protein" label="Protein (g)"></v-text-field>
                      </v-col> -->
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
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                  <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogUpload" max-width="800px">
              <template v-slot:activator="{ props }">
                <v-btn class="mb-2" color="primary" dark v-bind="props">
                  Bulk Upload (Create/Update)
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="text-center">
                  <span class="text-h6"> Upload Data for Creation/Updation </span>
                </v-card-title>

                <v-card-text>
                  <v-file-input @change="handleFileUpload" accept=".xlsx" :rules="rules"  label="Upload excel file"
                    placeholder="Pick AYUSHSHHH" prepend-icon="mdi-camera"></v-file-input>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="closeUpload">
                    Cancel
                  </v-btn>
                  <v-btn color="blue-darken-1" variant="text" @click="uploadExcel" :disabled="isDisabled"
>
                    Upload to Database
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <!-- TODO: show 'Create Deal' button for Data Team -->
          <v-btn class="mr-5" color="blue-darken-1" variant="tonal" size="small" roudned="sm" @click="uploadExcel">
            Create Deal
          </v-btn>
          <v-icon class="me-2" size="x-small" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <!-- <v-icon size="small" @click="deleteItem(item)">
            mdi-delete
          </v-icon> -->
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">
            Allot Data
          </v-btn>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { checkAuthentication, getJWTTokenFromLocalStorage } from '@/utils/authentication'
import router from '@/router'
import * as XLSX from 'xlsx';


export default {
  data: () => ({
    snackbar: false,
    timeout: 5000,
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
    dialogDelete: false,
    dialogUpload: false,
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
      { title: 'City', key: 'city',
        minWidth: '200' },
      { title: 'State', key: 'state',
        minWidth: '200' },
      { title: 'GSTIN', key: 'gstin',
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
      { title: 'POC Email', key: 'poc_email',
        minWidth: '200' },
      { title: 'POC Designation', key: 'poc_designation',
        minWidth: '200' },
      { title: 'IndiaMart', key: 'indiamart_link',
        minWidth: '200' },
      { title: 'Website', key: 'website',
        minWidth: '200' },
      { title: 'Product', key: 'mfg_product',
        minWidth: '200' },
      { title: 'Quality Tag', key: 'quality_tag',
        minWidth: '200' },
      { title: 'Deal ID', key: 'hb_deal_id',
        minWidth: '200' },
      { title: 'Deal Creation Date', key: 'hb_deal_creation_date',
        minWidth: '200' }
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {},
    defaultItem: {},
    uploadedExcelFile: null,
    apiResponse: [
        // Example API response data structure
        { rowNumber: 2, invalidMessage: 'Invalid email address' },
        { rowNumber: 5, invalidMessage: 'Missing phone number' }
        // Add more rows as needed
      ]
  }),

  computed: {
    filteredData() {
        if (this.multiSearch) {
            return this.desserts.filter((item) => {
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
        return this.desserts;
        }
    },
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    isDisabled() {
      return this.uploadedFile.length === 0;
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.initialiseEditedItem()
    this.initialize()
  },

  methods: {
    initialiseEditedItem() {
      this.editedItem = {}

      for(var i=0; i<this.headers.length; ++i) {
        const key = this.headers[i].key
        this.editedItem.key = ''
      }

      this.defaultItem = this.editedItem

    },
    async initialize() {
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
      // const fetchedTokenResponse = await axios.get("https://asia-south1-tranzact-production.cloudfunctions.net/tz-cpd-api/tz-cpd/get-prospect", config);
      const fetchedTokenResponse = await axios.get("http://localhost:56777/tz-cpd/get-prospect", config);
      // console.log('DUBEY: ', JSON.stringify(fetchedTokenResponse))
      this.desserts = fetchedTokenResponse.data.data;
    },

    editItem(item) {
      // console.log('DUBEY: desserts: ', this.desserts)
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      // console.log('DUBEY: editedItem before save: ', this.editedItem)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save() {
      this.close()
      if (this.editedIndex > -1) {
        // console.log('DUBEY: items in desserts being edited: ', this.desserts[this.editedIndex])
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
        // console.log('DUBEY: items in desserts being edited: ', this.desserts[this.editedIndex])
        await this.updateProspectinDB(this.desserts[this.editedIndex])
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        console.log('Calling initialize')
        await this.initialize()
        console.log('Calling initialize Done')
      } else {
        this.desserts.push(this.editedItem)
      }
    },

    closeUpload() {
      this.dialogUpload = false
      console.log('DUBEY: closeUpload() uploaded file: ', this.uploadedFile)
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
        console.log("Converted JSON:", this.uploadedFile);
      };
      reader.readAsArrayBuffer(file);
    },
    async uploadExcel() {
      console.log("Dubey uploading excel file")
      console.log('DUBEY: uploaded file: ', this.uploadedFile)
      console.log('DUBEY: length uploaded file: ', this.uploadedFile.length)
      //TODO: Trigger API for adding data to database and 
      //get the data for fields not added
      this.closeUpload();


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
        // const fetchedTokenResponse = await axios.post("https://asia-south1-tranzact-production.cloudfunctions.net/tz-cpd-api/tz-cpd/bulk-insert", this.uploadedFile, config);
        const fetchedTokenResponse = await axios.get("http://localhost:56777/tz-cpd-api/tz-cpd/bulk-insert", config);
        // console.log('DUBEY: ', JSON.stringify(fetchedTokenResponse.data.data))
        this.apiResponse = fetchedTokenResponse.data.data
        if(fetchedTokenResponse.data.code === 'insert_partial') {
          this.downloadErrorExcel()
        }
      } catch(error) {

        this.snackbar = true

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
      // const fetchedTokenResponse = await axios.post("https://asia-south1-tranzact-production.cloudfunctions.net/tz-cpd-api/tz-cpd/enrich", payload, config);
      const fetchedTokenResponse = await axios.post("http://localhost:56777/tz-cpd/enrich", payload, config);
      console.log('DUBEY: ', JSON.stringify(fetchedTokenResponse))
      // this.desserts = fetchedTokenResponse.data.data;
    }
  },
}
</script>
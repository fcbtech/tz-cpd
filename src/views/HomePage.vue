<template>
  <div>
    <div>
      <NavBar />
    </div>
    <div style="margin-top:100px;">
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>
      <v-data-table :search="search" :headers="headers" :items="desserts" :sort-by="[{ key: 'calories', order: 'asc' }]">
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
            <v-toolbar-title>My CRUD</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Edit</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="4" sm="6">
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
            <v-dialog v-model="dialogUpload" max-width="500px">
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
                  <v-file-input v-model="uploadedFile" :rules="rules" accept=".xlsx, text/csv" label="Upload excel file"
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
export default {
  data: () => ({
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
    search: '',
    dialog: false,
    dialogDelete: false,
    dialogUpload: false,
    uploadedFile: [],
    headers: [
      {
        title: 'Dessert (100g serving)',
        align: 'start',
        sortable: false,
        key: 'name',
      },
      { title: 'Calories', key: 'calories' },
      { title: 'Fat (g)', key: 'fat' },
      { title: 'Carbs (g)', key: 'carbs' },
      { title: 'Protein (g)', key: 'protein' },
      { title: 'Actions', key: 'actions', sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
    defaultItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
  }),

  computed: {
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
    this.initialize()
  },

  methods: {
    initialize() {
      this.desserts = [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
        },
      ]
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      console.log('DUBEY: editedItem before save: ', this.editedItem)
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

    save() {
      if (this.editedIndex > -1) {
        console.log('DUBEY: items in desserts being edited: ', this.desserts[this.editedIndex])
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
        console.log('DUBEY: items in desserts being edited: ', this.desserts[this.editedIndex])
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    },

    closeUpload() {
      this.dialogUpload = false
      console.log('DUBEY: closeUpload() uploaded file: ', this.uploadedFile)
    },

    uploadExcel() {
      console.log("Dubey uploading excel file")
      console.log('DUBEY: uploaded file: ', this.uploadedFile)
      console.log('DUBEY: length uploaded file: ', this.uploadedFile.length)
      //TODO: Trigger API for adding data to database and 
      //get the data for fields not added
      this.closeUpload();
    }
  },
}
</script>
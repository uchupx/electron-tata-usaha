<template>
  <div class="container-fluid">
    <p>Home</p>
    <button class="btn btn-success" @click="printPage">Test print</button>
    <form>
      <div class="form-group">
        <label for="fname">First Name</label>
        <input
          type="text"
          class="form-control"
          id="fname"
          placeholder="Enter First Name"
          v-model="user.firstName"
        />
      </div>
      <div class="form-group">
        <label for="lname">Last Name</label>
        <input
          type="text"
          class="form-control"
          id="lname"
          placeholder="Last Name"
          v-model="user.lastName"
        />
      </div>
    </form>
    <button class="btn btn-primary" @click.prevent="submituser">
      Submit User
    </button>
    <button class="button px-4 bg-red-300" @click="showModal">
      Show Modal
    </button>
    <br />
    <br />
    <table class="table">
      <thead>
        <tr>
          <td>firstName</td>
          <td>LastName</td>
          <td>id</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in allData" :key="user.id">
          <td>{{ user.firstName }}</td>
          <td>{{ user.lastName }}</td>
          <td>{{ user.id }}</td>
        </tr>
      </tbody>
    </table>
    <template v-if="isModalOpen">
      <Modal/>
    </template>
  </div>
</template>

<script lang="ts">
//todo options for printing
const options = {
  silent: false,
  printBackground: true,
  color: false,
  margin: {
    marginType: "printableArea",
  },
  landscape: true,
  pagesPerSheet: 1,
  collate: false,
  copies: 1,
  header: "Header of the Page",
  footer: "Footer of the Page",
};
// todo user model
interface NewUser {
  firstName: string | null;
  lastName: string | null;
  id?: number | null;
}

// ** imports
import { mapActions, mapState } from "vuex";
import { remote, ipcRenderer } from "electron";
import {
  defineComponent,
  EmitsOptions,
  onMounted,
  reactive,
  SetupContext,
} from "vue";
import { getAllUsers, createUser } from "../db/action/user";
import Modal from "@/views/components/Modal.vue";
import path from 'path'
import fs from 'fs'
//todo component instance
export default defineComponent({
  name: "Home",
  computed: {
    ...mapState("app", ["isModalOpen"]),
  },
  components: {
    Modal,
  },
  methods: {
    ...mapActions("app", ["openModal"]),
    showModal() {
      this.openModal();
    },
  },
  setup() {
    //todo the reactive state for binding to form
    const user = reactive({
      firstName: "",
      lastName: "",
    });
    //todo reactive repo of all users
    const allData = reactive<NewUser[]>([]);
    //todo try printing
    const printPage = () => {
      // const win: any = remote.BrowserWindow.getFocusedWindow();
      // win.webContents.print(options, (success: any, failureReason: any) => {
      //   if (!success) console.log(failureReason);
      //   console.log("Print Initiated");
      // });
      // console.log(ipcRenderer.sendSync('ping'))
      const dialog = remote.dialog;
      dialog
        .showSaveDialog({
          title: "Select the File Path to save",
          defaultPath: path.join(__dirname, "../assets/sample.txt"),
          // defaultPath: path.join(__dirname, '../assets/'),
          buttonLabel: "Save",
          // Restricting the user to only Text Files.
          filters: [
            {
              name: "Text Files",
              extensions: ["txt", "docx"],
            },
          ],
          // properties: [],
        })
        .then((file) => {
          // Stating whether dialog operation was cancelled or not.
          console.log(file.canceled);
          if (!file.canceled) {
            console.log(file.filePath!.toString());

            // Creating and Writing to the sample.txt file
            fs.writeFile(
              file.filePath!.toString(),
              "This is a Sample File",
              function (err) {
                if (err) throw err;
                console.log("Saved!");
              }
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    //todo all user data
    const syncUsers = async () => {
      const allUsers = await getAllUsers();
      allUsers.forEach((el: any) => {
        const userFound = allData.find((e) => e.id === el.id);
        userFound
          ? allData.splice(
              allData.findIndex((e) => e.id === el.id),
              1,
              {
                firstName: el.firstName,
                lastName: el.LastName,
                id: el.id,
              }
            )
          : allData.push({
              firstName: el.firstName,
              lastName: el.LastName,
              id: el.id,
            });
      });
    };
    //todo fetch all users on boot
    onMounted(async () => syncUsers());
    //todo submit user
    const submituser = async () => {
      const getUser = await createUser(user);
      allData.push(getUser);
    };
    return { user, submituser, allData, printPage };
  },
});
</script>

<style lang="scss" scoped></style>

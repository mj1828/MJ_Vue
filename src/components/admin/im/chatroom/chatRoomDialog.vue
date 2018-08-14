<!-- Form -->
<template>
    <div class='mj-user-dialog'>
        <el-dialog :title="title" :visible.sync="showDialog" @close="close">
            <el-form :model="chatRoomInfo">
                <el-input type="hidden" v-model="chatRoomInfo.id"></el-input>
                <el-form-item label="聊天室名" :label-width="formLabelWidth">
                    <el-input v-model="chatRoomInfo.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="公告" :label-width="formLabelWidth">
                    <el-input v-model="chatRoomInfo.notice" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="管理员" :label-width="formLabelWidth">
                    <el-input v-model="chatRoomInfo.memberid" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="禁止加入" :label-width="formLabelWidth">
                    <el-select v-model="chatRoomInfo.gag" placeholder="请选择是否允许加入">
                        <el-option label="开启" value="1"></el-option>
                        <el-option label="关闭" value="0"></el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="私有聊天" :label-width="formLabelWidth">
                    <el-select v-model="chatRoomInfo.privatechat" placeholder="请选择是否为私有聊天">
                        <el-option label="开启" value="1"></el-option>
                        <el-option label="关闭" value="0"></el-option>
                    </el-select>
                </el-form-item> 
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="ensure">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
  props: ["dialogStatus", "chatRoomId", "title"],
  name: "mj_user_dialog",
  data() {
    return {
      showDialog: false,
      chatRoomInfo: {},
      formLabelWidth: "120px",
      id: ""
    };
  },
  created(){
    console.log("123");
  },
  methods: {
    cancel: function() {
      this.showDialog = false;
      this.$emit("changeDialogStatus", false);
    },
    ensure: function() {
      this.postRequest("/admin/ltsgl/save", this.chatRoomInfo)
        .then(response => {
          if (response.status == 200) {
            var data = response.data;
            if (data.Result) {
              this.$emit("userList");
              this.$message({ message: data.Message, type: "success" });
            } else {
              this.$message({ message: data.Message, type: "error" });
            }
          }
        })
        .catch(e => {
          console.log(e);
        });
      this.showDialog = false;
      this.$emit("changeDialogStatus", false);
    },
    close: function() {
      this.showDialog = false;
      this.$emit("changeDialogStatus", false);
    }
  },
  watch: {
    chatRoomId(newValue, oldValue) {
      if (newValue) {
        debugger;
        this.$http
          .get("/admin/ltsgl/chatRoom/" + newValue)
          .then(response => {
            if (response.status == 200) {
              var data = response.data;
              if (data.Result) {
                  this.chatRoomInfo = data.Message;
              } else {
                this.$message({ message: data.Message, type: "error" });
              }
            }
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        this.chatRoomInfo = {};
      }
    },
    dialogStatus(newValue, oldValue) {
      this.showDialog = newValue;
    }
  }
};
</script>

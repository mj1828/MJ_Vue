<template>
  <div class="content">
    <button @click="connect()">链接</button>
    <button @click="onSend()">发送</button>
    <button @click="onStop()">断开</button>
    <button @click="onLine()">上线</button>
    <button @click="msgtoall()">全部</button>
  </div>
</template>

<script>
import Stomp from "stompjs";
export default {
  name: "mj_content",
  data() {
    return {
      stomp: null,
      text: {},
      isConnect: false,
      chatRoomId: "1"
    };
  },
  props: {},
  mounted() {
    this.text.ChatRoomId = "1";
    this.text.UserName = localStorage.getItem("userName");
  },
  methods: {
    onLine: function() {
      //发送消息
      this.stomp.send(
        "/mj/onLineMsg",
        { atytopic: "atytopic" },
        JSON.stringify(this.text)
      );
    },
    msgtoall: function() {
      //发送消息
      this.stomp.send(
        "/mj/msg",
        { atytopic: "atytopic" },
        JSON.stringify(this.text)
      );
    },
    onConnected: function(frame) {
      this.isConnect = true;
      this.stomp.subscribe("/topic/msg/" + this.chatRoomId, this.onMsg);
      this.stomp.subscribe("/topic/wbmsg/" + this.chatRoomId, this.onWbMsg);
    },
    onError: function(frame) {
      //错误信息
      console.log("Failed: " + frame);
    },
    onMsg: function(frame) {
      //接收消息
      //   this.msg.push(frame.body);
      console.log("收到消息");
      console.log(frame.body);
    },
    onWbMsg: function(frame) {
      //接收消息
      //   this.msg.push(frame.body);
      console.log("收到消息");
      console.log(frame.body);
    },
    connect: function() {
      //连接服务器
      this.stomp = Stomp.client("ws://localhost:8090/ws");
      this.stomp.connect("", this.onConnected, this.onError);
    },
    onSend() {
      //发送消息
      this.stomp.send("/mj/hello", { atytopic: "atytopic" }, this.text);
    },
    onStop() {
      this.isConnect = false;
      //关闭消息
      this.stomp.disconnect(function() {
        console.log("See you next time!");
      });
    }
  }
};
</script>
<<style scoped>
    .content img{
       
    }
</style>


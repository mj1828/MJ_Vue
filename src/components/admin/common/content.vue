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
      chatRoomId: "1",
      msg: {
        ChatRoomId: 0,
        FromUserName: localStorage.getItem("userName"),
        FromAvator: "",
        FromNick: "",
        MsgType: "",
        Message: "",
        MsgTimestamp: 0
      }
    };
  },
  props: {},
  mounted() {
    this.connect();
  },
  created() {},
  methods: {
    connect: function() {
      //连接服务器
      this.stomp = Stomp.client("ws://localhost:8090/ws");
      this.stomp.connect("", this.onConnected, this.onError);
    },
    onConnected: function(frame) {
      //订阅聊天室消息
      this.stomp.subscribe("/topic/msg/" + this.chatRoomId, this.onMsg);
      //订阅面板消息
      this.stomp.subscribe("/topic/wbmsg/" + this.chatRoomId, this.onWbMsg);
      //发送上线消息
    },
    onError: function(frame) {
      //错误信息
      console.log("Failed: " + frame);
    },
    onMsg: function(frame) {
      var content = JSON.parse(frame.body);
      var messageType = content.MsgType;
      switch (messageType) {
        case "OnlineMessage":
          this.onlineEvent(content);
          break;
        case "OfflineMessage":
          this.offlineEvent(content);
          break;
        case "SystemMessage":
          this.systemEvent(content);
          break;
        case "AudioMessage":
          this.audioEvent(content);
          break;
        case "VideoMessage":
          this.videoEvent(content);
          break;
        case "ImageMessage":
          this.imageEvent(content);
          break;
        case "FileMessage":
          this.fileEvent(content);
          break;
        default:
          this.messageEvent(content);
      }
    },
    onWbMsg: function(frame) {
      //接收消息
      //   this.msg.push(frame.body);
      console.log("收到消息");
      console.log(frame.body);
    },
    onSend(method, msg) {
      //发送消息
      this.stomp.send(
        "/mj/hello",
        { atytopic: "atytopic" },
        JSON.stringify(msg)
      );
    },
    onStop() {
      this.isConnect = false;
      //关闭消息
      this.stomp.disconnect(function() {
        console.log("See you next time!");
      });
    },
    onLine: function() {
      //发送消息
      this.stomp.send(
        "/mj/onLineMsg",
        { atytopic: "atytopic" },
        JSON.stringify(this.text)
      );
    },
    // 上线事件
    onlineEvent: function(message) {
      this.wsOnlineMembers(message.ChatRoomId);
    },
    // 下线事件
    offlineEvent: function(message) {
      this.wsOnlineMembers(message.ChatRoomId);
    },
    // 系统事件
    systemEvent: function(message) {
      console.log("系统事件");
      var content = message.Message;
      if (content == "ReloadOnLineMember") {
        console.log("你要刷新用户");
        wsOnlineMembers(message.ChatRoomId);
      } else if (content == "ReloadMemberType") {
        console.log("重新加载右键点击事件");
        memberContextMenu(message);
      }
    },
    // 面板事件
    panelEvent: function(message) {
      console.log("面板事件");
    },
    // 消息事件
    messageEvent: function(message) {
      this.showMessage(message);
    },
    // 音频事件
    audioEvent: function(message) {
      console.log("音频事件");
      this.showMessage(message, "AudioMessage");
    },
    // 视频事件
    videoEvent: function(message) {
      console.log("视频事件");
      this.showMessage(message, "VideoMessage");
    },
    // 图片事件
    imageEvent: function(message) {
      console.log("图片事件");
      this.showMessage(message, "ImageMessage");
    },
    //附件事件
    fileEvent: function(message) {
      console.log("图片事件");
      this.showMessage(message, "FileMessage");
    },
    // 获取在线成员
    wsOnlineMembers: function(chatRoomId) {
      var dc = {};
      dc.ChatRoomId = chatRoomId;
      Server.sendRequest("im.onlineMember", dc, function(response) {
        if (response.Status != 1) {
          alert(response.Message);
        } else {
          loadOnlineMember(response.OnlineMember);
        }
      });
    },
    showMessage: function(message, msgType) {
      if (msgType == "PanelMessage") {
      } else {
        $("#chatroommessage").append(initMessage(message, msgType));
        $("#chatroommessage").scrollTop($("#chatroommessage")[0].scrollHeight);
      }
    },
    initMessage: function(message, msgType) {
      var content = "";
      if (msgType == "ImageMessage") {
        content =
          "<li class='discuss-item'> " +
          "<div class='ursr-info clearfix'> " +
          "<a class='pull-left' href='#'> <img " +
          "src='../../images/user-avatar.png' /> <span>" +
          message.FromUserName +
          "</span> " +
          "</a> " +
          "<div class='pull-right'>" +
          message.MsgTimestamp +
          "</div> " +
          "</div> " +
          "<img style='width:100%;height:100%;' src='" +
          prefix +
          message.Message +
          "'></img> " +
          "</li> ";
      } else if (msgType == "AudioMessage") {
        content =
          "<li class='discuss-item'> " +
          "<div class='ursr-info clearfix'> " +
          "<a class='pull-left' href='#'> <img " +
          "src='../../images/user-avatar.png' /> <span>" +
          message.FromUserName +
          "</span> " +
          "</a> " +
          "<div class='pull-right'>" +
          message.MsgTimestamp +
          "</div> " +
          "</div> " +
          "<audio style='width:100%;height:100%;margin-top:10px;' src='" +
          prefix +
          message.Message +
          "' autoplay='autoplay' preload='preload' controls='controls' ></audio> " +
          "</li> ";
      } else if (msgType == "VideoMessage") {
        content =
          "<li class='discuss-item'> " +
          "<div class='ursr-info clearfix'> " +
          "<a class='pull-left' href='#'> <img " +
          "src='../../images/user-avatar.png' /> <span>" +
          message.FromUserName +
          "</span> " +
          "</a> " +
          "<div class='pull-right'>" +
          message.MsgTimestamp +
          "</div> " +
          "</div> " +
          "<video style='width:100%;height:100%;' src='" +
          prefix +
          message.Message +
          "' autoplay='autoplay' preload='preload' controls='controls' ></video> " +
          "</li> ";
      } else if (msgType == "FileMessage") {
        content =
          "<li class='discuss-item'> " +
          "<div class='ursr-info clearfix'> " +
          "<a class='pull-left' href='#'> <img " +
          "src='../../images/user-avatar.png' /> <span>" +
          message.FromUserName +
          "</span> " +
          "</a> " +
          "<div class='pull-right'>" +
          message.MsgTimestamp +
          "</div> " +
          "</div> " +
          "<a href='" +
          prefix +
          message.Message +
          "' target='_blank'>下载附件</a> " +
          "</li> ";
      } else {
        content =
          "<li class='discuss-item'> " +
          "<div class='ursr-info clearfix'> " +
          "<a class='pull-left' href='#'> <img " +
          "src='../../images/user-avatar.png' /> <span>" +
          message.FromUserName +
          "</span> " +
          "</a> " +
          "<div class='pull-right'>" +
          message.MsgTimestamp +
          "</div> " +
          "</div> " +
          "<p class='discuss-con'> " +
          message.Message +
          "</p> " +
          "</li> ";
      }
      return content;
    },
    // 获取在线成员
    wsOnlineMembers: function(chatRoomId) {
      var dc = {};
      dc.ChatRoomId = chatRoomId;
      Server.sendRequest("im.onlineMember", dc, function(response) {
        if (response.Status != 1) {
          alert(response.Message);
        } else {
          loadOnlineMember(response.OnlineMember);
        }
      });
    },

    // 绑定右键事件
    bindMemberContextMenu: function(options) {
      $("#memberlist").on("contextmenu", "li", function(e) {
        // 取消默认的浏览器自带右键 很重要！！
        e.preventDefault();
        var id = $(this).attr("id");
        if (options.MemberId == id) {
          console.log("不能编辑当前登录用户！");
          return;
        }
        var chatRoomId = options.ChatRoomId;
        var memberType = $(this).attr("membertype");
        if (memberType == "Admin") {
          console.log("不能编辑管理员");
          return;
        }
        // 获取当前用户状态
        var dc = {};
        dc.MemberID = id;
        dc.ChatRoomID = chatRoomId;
        Server.sendRequest(
          "ChatRoomMemberFront.initChatRoomMember",
          dc,
          function(response) {
            if (response.Status != 1) {
              console.log("初始化聊天室用户信息失败");
            } else {
              var gag = response.Gag;
              var html = initMenu(gag, memberType);
              $("body").append(html);
              $("#menu").show();
              $(".menu").on("click", function(e) {
                executeEvent(
                  $(this).attr("type"),
                  $(this).attr("value"),
                  id,
                  chatRoomId,
                  options.ReloadMemberList
                );
              });
              // 获取我们自定义的右键菜单
              var menu = document.querySelector("#menu");
              // 根据事件对象中鼠标点击的位置，进行定位
              menu.style.left = e.clientX + "px";
              menu.style.top = e.clientY + "px";
              // 改变自定义菜单的宽，让它显示出来
              menu.style.width = "125px";
            }
          }
        );
      });
    },
    //绑定右键事件
    removeMemberContextMenu: function(options) {
      $("#memberlist").off("contextmenu", "li");
    },
    // 初始化右键菜单
    initMenu: function(gag, memberType) {
      var html = "<div id='menu' style='display:none;'>";
      if (memberType == "Common") {
        html +=
          "<div class='menu' type='MemberType' value='Assistant' >设置为助手</div>";
      } else {
        html +=
          "<div class='menu' type='MemberType' value='Common' >取消助手</div>";
      }
      if (gag > 0) {
        // 关闭禁言
        html += "<div class='menu' type='Gag' value='0' >取消禁言</div>";
      } else {
        // 开启禁言
        html += "<div class='menu' type='Gag' value='1' >禁言</div>";
      }
      html += "<div class='menu' type='Prohibit' value='1'  >禁止加入</div>";
      html += "</div>";
      return html;
    },

    // 执行右键菜单点击事件
    executeEvent: function(type, value, memberId, chatRoomId, callback) {
      var dc = {};
      dc.Type = type;
      dc.Value = value;
      dc.MemberID = memberId;
      dc.ChatRoomID = chatRoomId;
      Server.sendRequest("ChatRoomMemberFront.save", dc, function(response) {
        if (response.Status != 1) {
          console.log(response.Message);
        } else {
          wsOnlineMembers(chatRoomId);
        }
      });
    }
    // 关闭右键菜单，很简单
    // window.onclick=function(e){
    // 		// 用户触发click事件就可以关闭了，因为绑定在window上，按事件冒泡处理，不会影响菜单的功能
    // 　　　　$("#menu").remove();
    // }
  }
};
</script>
<<style scoped>
    .content img{
       
    }
</style>


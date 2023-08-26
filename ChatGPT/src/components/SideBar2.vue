<script setup>
import { ref } from 'vue'
import { Plus, Download, Upload, Refresh, ArrowDownBold } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { showMessage } from '../utils/utils'
import { useChatStore } from '../stores/chat'
import { useSysStore } from '../stores/sys'
import { useMessagesStore } from '../stores/messages'
import { get_GetCreditGrants } from '../api/api'
import draggable from 'vuedraggable'
import ChatCard from './ChatCard.vue'
import SettingDialog from './SettingDialog.vue'
import PromptStore from './PromptStore.vue'
const chatStore = useChatStore()
const messagesStore = useMessagesStore()
const sysStore = useSysStore()

const chats = chatStore.chats
const uploadChatList = ref([])

const dialogVis= ref(false)

defineProps({
  size: {
    type: Number,
    required: true
  }
})
const handleClose = () => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
      .then(() => {
        done()
      })
      .catch(() => {
        // catch error
      })
}

const newChat = () => {
  if (messagesStore.sending.isSending) {
    showMessage('请等待回答完毕', 'error')
    return
  }
  messagesStore.newMessages()
}

const download = () => {
  chatStore.exportChats()
}

const upload = (_, uploadFile) => {
  chatStore.uploadChats(uploadFile.raw)
}


</script>

<template>
  <!-- <div class="p-7 bg-white rounded-3xl" style="height: auto;" v-if="sysStore.openSideBar"> -->
  <div class="flex flex-col h-full w-full">
    <div class="flex items-center">
      <el-button @click="newChat" :icon="Plus" style="width: 100%">New Chat</el-button>
<!--      <el-popover placement="left" trigger="click" width="190">-->
<!--        <template #reference>-->
<!--          <el-button :icon="ArrowDownBold" circle />-->
<!--        </template>-->
<!--        <template #default>-->
<!--          <div class="flex gap-2">-->
<!--            <el-button :icon="Download" @click="download">导出</el-button>-->
<!--            <el-upload v-model:file-list="uploadChatList" :on-progress="upload" class="flex">-->
<!--              <el-button :icon="Upload">导入</el-button>-->
<!--            </el-upload>-->
<!--          </div>-->
<!--        </template>-->
<!--      </el-popover>-->
    </div>
    <el-scrollbar>
      <draggable :list="chats" handle=".drag-chat" item-key="idx">
        <template #item="{ element }">
          <ChatCard :chat="element"></ChatCard>
        </template>
      </draggable>
    </el-scrollbar>
    <div class="flex gap-1 relative top-3">
      <SettingDialog :size="size"></SettingDialog>
      <PromptStore :size="size"></PromptStore>
    </div>
    <div class="pt-5">
      <el-button @click="() => (sysStore.openSideBar = false)" type="danger" style="width: 100%"
        >关闭</el-button
      >
      <span class="flex items-center justify-center text-sm mt-2 border-2 border-dotted"
        ><el-button text @click="dialogVis=true">
        免责声明
      </el-button>
      <el-dialog
          v-model="dialogVis"
          title="Tips"
          width="30%"
          :before-close="dialogClose"
      >
        <span>暂时仅限个人在找实习中学习vue3语法为目的使用</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="dialogVis = false">
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>
      </span>
    </div>
  </div>
  <!-- </div> -->
</template>

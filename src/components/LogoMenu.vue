<script setup>
import { InfoFilled } from '@element-plus/icons-vue'
import { getCurrentTime, showMessage, downloadMarkdown, downloadImg, XSS, MD } from '../utils/utils'
import html2canvas from 'html2canvas'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useMessagesStore } from '../stores/messages'
const messagesStore = useMessagesStore()

defineProps({
  title: {
    type: String,
    required: true
  }
})

const preview = (data = '', type = 'md') => {
  ElMessageBox.confirm(
    `<div class="preview markdown-body overflow-auto p-2" style="height: 66vh">
      ${type === 'md' ? XSS.process(MD.render(data || '')) : ''}
    </div>`,
    '预览',
    {
      dangerouslyUseHTMLString: true,
      distinguishCancelAndClose: true,
      confirmButtonText: '下载',
      cancelButtonText: '取消'
    }
  ).then(() => {
    if (type === 'md') {
      downloadMarkdown(data, `${messagesStore.title}.md`)
    } else if (type === 'png') {
      downloadImg(data, `${messagesStore.title}.png`)
    }
    ElMessage({
      type: 'success',
      message: '下载成功'
    })
  })
}

const export_img = () => {
  showMessage('正在导出...', 'success')
  html2canvas(document.querySelector('.message-box'), {
    ignoreElements: (element) => {
      if (element.classList.contains('message-info')) {
        if (element.querySelector('.skip-msg')) {
          return (
            element
              .querySelector('.skip-msg')
              .querySelector('input')
              .getAttribute('aria-checked') === 'true'
          )
        } else {
          return true
        }
      }
      return false
    },
    onclone: (dom) => {
      if (messagesStore.display === 'chat') {
        dom.querySelector('.message-box').style.color = 'white'
        dom
          .querySelector('.message-box')
          .querySelectorAll('span')
          .forEach((span) => (span.style.paddingBottom = '5px'))
      }
      if (messagesStore.display === 'card') {
        dom
          .querySelector('.message-box')
          .querySelectorAll('span.is-text')
          .forEach((span) => (span.style.paddingBottom = '15px'))
      }
    },
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#374151'
  }).then(function (canvas) {
    console.log(canvas)
    preview(canvas, 'png')
    setTimeout(() => {
      document.querySelector('.preview').appendChild(canvas)
    }, 500)
  })
}

const export_markdown = () => {
  showMessage('正在导出...', 'success')
  console.log('导出markdown', messagesStore.title)
  const messages = messagesStore.getHistoryMsg('all')
  const md =
    `## 导出时间:\`${getCurrentTime()}\`\n---\n` +
    messages
      .map((msg) => `### ${msg.role} \n\`\`\`\`markdown\n${msg.content}\n\`\`\`\``)
      .join('\n---\n')
  preview(md, 'md')
}
</script>

<template>
  <el-popover placement="top" :width="300" trigger="click" :teleported="false" :persistent="false">
    <template #reference>
      <p
        class="chat-title m-auto text-6xl font-semibold py-1 bg-clip-text text-transparent select-none hover:cursor-pointer"
      >
        <span>{{ title }}</span>
      </p>
    </template>
<!--    <div class="flex flex-col">-->
<!--      <div class="flex items-center justify-between">-->
<!--        <label class="flex px-2 justify-start w-28" style="color: #606266"-->
<!--          >{{ messagesStore.display === 'card' ? '卡片' : '对话' }}模式</label-->
<!--        >-->
<!--        <el-switch-->
<!--          v-model="messagesStore.display"-->
<!--          :active-value="'chat'"-->
<!--          :inactive-value="'card'"-->
<!--          style="&#45;&#45;el-switch-on-color: #13ce66; &#45;&#45;el-switch-off-color: #409eff"-->
<!--          @change="(val) => messagesStore.setDisplay(val)"-->
<!--        />-->
<!--      </div>-->
<!--      <div class="flex items-center justify-between">-->
<!--        <el-tooltip effect="dark" content="跳过的对话将不会被导出" placement="top-start">-->
<!--          <label class="flex items-center px-2 justify-start w-28 gap-1" style="color: #606266"-->
<!--            >导出对话<el-icon> <InfoFilled /> </el-icon-->
<!--          ></label>-->
<!--        </el-tooltip>-->
<!--        <el-button-group>-->
<!--          <el-button type="primary" @click="export_img">图片</el-button>-->
<!--          <el-button type="primary" @click="export_markdown">Markdown</el-button>-->
<!--        </el-button-group>-->
<!--      </div>-->
<!--    </div>-->
  </el-popover>
</template>

<style scoped>
.chat-title {
  font-family: Inter;
  /*background-image: linear-gradient(135deg, #756aee 53%, #ee756a 10%);*/
  background-image: linear-gradient(135deg, #f08a5d 10%, #c97fd3 90%);

}
</style>

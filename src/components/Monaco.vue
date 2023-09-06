<script setup lang="ts">
import Editor, { loader } from '@guolao/vue-monaco-editor'

import * as monaco from 'monaco-editor'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import type * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api'

const props = defineProps<{ value: string }>()
const emit = defineEmits(['update:value'])
const code = ref('')
const editorRef = shallowRef<monacoEditor.editor.ICodeEditor>()
const MONACO_EDITOR_OPTIONS = {
  'fontSize': 16,
  'automaticLayout': true,
  'formatOnType': true,
  'formatOnPaste': true,
  'default-language': 'zh-cn',
  'minimap': { enabled: false },
};

(self as any).MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === 'json')
      return new JsonWorker()
    return new EditorWorker()
  },
}
loader.config({ monaco })

function handleMount(editor: monacoEditor.editor.ICodeEditor) {
  editorRef.value = editor
  if (props.value) {
    code.value = props.value
    setTimeout(() => {
      editorRef.value.getAction('editor.action.formatDocument').run()
    }, 100)
  }
}
function change(value: string) {
  emit('update:value', value)
}
function preventSave(e: KeyboardEvent) {
  if ((e.key === 's' || e.key === 'S') && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey))
    e.preventDefault()
    // usemsg({ type: 'success', content: '保存成功!' })
}

onMounted(() => {
  window.addEventListener('keydown', preventSave, false)
})
onUnmounted(() => {
  window.removeEventListener('keydown', preventSave, false)
})

defineExpose({
  editorRef,
})
</script>

<template>
  <div style="height: calc(100%);background-color: rgb(255, 255, 255);display: flex;">
    <div style="flex: 1;">
      <slot />
    </div>
    <div style="max-width: 64%;flex: 1 0 540px; height: 100%;border-left: 1px solid rgb(233, 233, 233);box-sizing: border-box;">
      <Editor
        v-model:value="code"
        style="padding: 14px;"
        theme="vs-dark"
        language="json"
        :auto-format="true"
        :options="MONACO_EDITOR_OPTIONS"
        @change="change"
        @mount="handleMount"
      />
    </div>
  </div>
</template>

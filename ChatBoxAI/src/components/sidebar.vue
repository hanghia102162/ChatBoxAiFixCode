<script setup lang="ts">
import { Bot, Code2, MessageSquare, PanelLeftClose, PanelLeftOpen, Plus, Search, Settings2, X } from 'lucide-vue-next'
import { computed, ref } from 'vue'

withDefaults(defineProps<{ mobileOpen?: boolean }>(), { mobileOpen: false })

const emit = defineEmits<{ close: []; 'new-chat': [] }>()
const collapsed = ref(false)
const searchQuery = ref('')

const conversations = [
  'Viết hàm Python kiểm tra số nguyên tố',
  'Sửa lỗi ZeroDivisionError',
  'API FastAPI Router & Pydantic',
  'SQL Joins và Transaction ACID',
  'Nhật ký rút gọn',
  'Thuật toán Binary Search Tree',
]

const filteredConversations = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase()
  return query ? conversations.filter((conversation) => conversation.toLocaleLowerCase().includes(query)) : conversations
})

function toggleSidebar() {
  if (window.matchMedia('(max-width: 767px)').matches) {
    emit('close')
    return
  }
  collapsed.value = !collapsed.value
}
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-40 flex shrink-0 flex-col border-r bg-background p-3 shadow-xl transition-[width,transform] duration-200 md:relative md:z-auto md:translate-x-0 md:shadow-none"
    :class="[collapsed ? 'w-[4.5rem]' : 'w-72', mobileOpen ? 'translate-x-0' : '-translate-x-full']"
  >
    <div class="flex items-center px-2 pb-4" :class="collapsed ? 'justify-center' : 'justify-between'">
      <div class="flex items-center gap-2.5 overflow-hidden font-semibold tracking-tight text-foreground">
        <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm"><Bot class="size-4" /></span>
        <span v-if="!collapsed" class="whitespace-nowrap">CodeMate AI</span>
      </div>
      <button type="button" class="hidden rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:inline-flex" :aria-label="collapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'" @click="toggleSidebar">
        <PanelLeftOpen v-if="collapsed" class="size-4" />
        <PanelLeftClose v-else class="size-4" />
      </button>
      <button v-if="!collapsed" type="button" class="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden" aria-label="Đóng thanh bên" @click="emit('close')"><X class="size-4" /></button>
    </div>

    <template v-if="!collapsed">
      <button type="button" class="flex h-10 items-center justify-between rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90" @click="emit('new-chat')">
        <span class="flex items-center gap-2"><Plus class="size-4" /> Đoạn chat mới</span>
        <kbd class="rounded border border-primary-foreground/20 bg-primary-foreground/10 px-1 py-0.5 font-mono text-[10px]">Ctrl K</kbd>
      </button>

      <label class="mt-3 flex h-10 w-full items-center gap-2 rounded-md border bg-background px-3 text-muted-foreground transition-colors focus-within:ring-2 focus-within:ring-ring" aria-label="Tìm kiếm đoạn chat">
        <Search class="size-4 shrink-0" />
        <input v-model="searchQuery" type="search" class="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" placeholder="Tìm kiếm đoạn chat..." />
      </label>

      <nav class="mt-4 space-y-1" aria-label="Menu chính">
        <a class="flex h-10 items-center gap-2.5 rounded-md bg-accent px-3 text-sm font-medium text-accent-foreground" href="#chat" @click="emit('close')"><MessageSquare class="size-4" /> Trò chuyện</a>
        <a class="flex h-10 items-center gap-2.5 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" href="#review-code" @click="emit('close')"><Code2 class="size-4" /> Kiểm tra code <span class="ml-auto rounded bg-muted px-1.5 py-0.5 text-xs">Mới</span></a>
        <a class="flex h-10 items-center gap-2.5 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" href="#settings" @click="emit('close')"><Settings2 class="size-4" /> Cài đặt</a>
      </nav>

      <div class="my-4 border-t"></div>
      <p class="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hôm nay</p>
      <div class="space-y-1 overflow-y-auto">
        <button v-for="(conversation, index) in filteredConversations" :key="conversation" type="button" class="flex h-10 w-full items-center gap-2.5 rounded-md px-3 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" :class="index === 0 && !searchQuery && 'bg-muted text-foreground'">
          <MessageSquare class="size-4 shrink-0" />
          <span class="truncate">{{ conversation }}</span>
        </button>
        <p v-if="filteredConversations.length === 0" class="px-3 py-4 text-sm text-muted-foreground">Không tìm thấy đoạn chat.</p>
      </div>

      <div class="mt-auto border-t pt-3">
        <div class="flex items-center gap-2 rounded-md bg-muted/60 p-2.5">
          <span class="flex size-8 items-center justify-center rounded-md bg-primary/15 text-xs font-bold text-primary">SV</span>
          <div class="min-w-0 flex-1"><p class="truncate text-sm font-medium">Sinh viên</p><p class="text-xs text-muted-foreground">v1.0 · Vue 3 + FastAPI</p></div>
          <span class="rounded bg-primary/15 px-1.5 py-0.5 text-xs font-medium text-primary">Free</span>
        </div>
      </div>
    </template>

    <button v-else type="button" class="mt-2 flex size-10 items-center justify-center self-center rounded-md bg-primary text-primary-foreground" aria-label="Tạo đoạn chat mới"><Plus class="size-4" /></button>
  </aside>
</template>

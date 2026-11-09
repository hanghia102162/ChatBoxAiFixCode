<script setup lang="ts">
import { Bell, Bot, ChevronDown, Menu, Sparkles, X } from 'lucide-vue-next'
import { ref } from 'vue'

const menuOpen = ref(false)

const navigationItems = [
  { label: 'Trò chuyện', href: '#chat', active: true },
  { label: 'Review code', href: '#review-code', active: false },
  { label: 'Khám phá', href: '#kham-pha', active: false },
]

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
    <div class="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
      <a
        href="#"
        class="group flex shrink-0 items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label="ChatBox AI - Trang chủ"
      >
        <span class="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-105">
          <Bot class="size-5" aria-hidden="true" />
        </span>
        <span class="text-base font-semibold tracking-tight">ChatBox<span class="text-primary">AI</span></span>
      </a>

      <nav class="hidden items-center gap-1 md:flex" aria-label="Điều hướng chính">
        <a
          v-for="item in navigationItems"
          :key="item.label"
          :href="item.href"
          :aria-current="item.active ? 'page' : undefined"
          class="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          :class="item.active && 'bg-accent text-accent-foreground'"
        >
          {{ item.label }}
        </a>
      </nav>

      <div class="ml-auto flex items-center gap-2">
        <a
          href="#upgrade"
          class="hidden h-9 items-center gap-1.5 rounded-md border border-primary/25 bg-primary/10 px-3 text-xs font-medium text-primary transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
        >
          <Sparkles class="size-3.5" aria-hidden="true" />
          Nâng cấp Pro
        </a>

        <button
          type="button"
          class="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Thông báo"
        >
          <Bell class="size-[18px]" aria-hidden="true" />
        </button>

        <button
          type="button"
          class="inline-flex h-9 items-center gap-2 rounded-md px-1.5 pr-2 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Mở menu tài khoản"
        >
          <span class="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">A</span>
          <span class="hidden max-w-24 truncate sm:block">Admin</span>
          <ChevronDown class="hidden size-4 text-muted-foreground sm:block" aria-hidden="true" />
        </button>

        <button
          type="button"
          class="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobile-navigation"
          :aria-label="menuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'"
          @click="menuOpen = !menuOpen"
        >
          <X v-if="menuOpen" class="size-5" aria-hidden="true" />
          <Menu v-else class="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>

    <nav v-if="menuOpen" id="mobile-navigation" class="border-t bg-background px-4 py-3 md:hidden" aria-label="Điều hướng trên điện thoại">
      <div class="mx-auto grid max-w-7xl gap-1">
        <a
          v-for="item in navigationItems"
          :key="item.label"
          :href="item.href"
          :aria-current="item.active ? 'page' : undefined"
          class="flex h-10 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          :class="item.active && 'bg-accent text-accent-foreground'"
          @click="closeMenu"
        >
          {{ item.label }}
        </a>
        <a href="#upgrade" class="mt-2 flex h-10 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground" @click="closeMenu">
          <Sparkles class="size-4" aria-hidden="true" />
          Nâng cấp Pro
        </a>
      </div>
    </nav>
  </header>
</template>

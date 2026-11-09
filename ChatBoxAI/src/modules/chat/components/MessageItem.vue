<script setup lang="ts">
import { Gauge, Lightbulb } from 'lucide-vue-next'

const insights = [
  { title: 'Độ phức tạp tính toán', body: 'Thời gian chạy O(√n), nhanh hơn đáng kể so với việc thử chia cho mọi số từ 2 đến n − 1.', icon: Gauge },
  { title: 'Nguyên lý toán học', body: 'Nếu n = a × b, luôn có ít nhất một thừa số không lớn hơn √n. Vì vậy chỉ cần kiểm tra đến căn bậc hai của n.', icon: Lightbulb },
]
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <article v-for="insight in insights" :key="insight.title" class="rounded-xl border bg-muted/25 p-4 shadow-sm">
      <h3 class="flex items-center gap-2 text-sm font-semibold"><component :is="insight.icon" class="size-4 text-primary" />{{ insight.title }}</h3>
      <p class="mt-2 text-sm leading-6 text-muted-foreground">{{ insight.body }}</p>
    </article>
  </div>
</template>

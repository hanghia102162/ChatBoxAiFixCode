<script setup lang="ts">
import { Check, Copy, FileCode2 } from 'lucide-vue-next'

const codeLines = [
  'import math',
  '',
  'def is_prime(n: int) -> bool:',
  '    # Kiểm tra n có phải số nguyên tố không.',
  '    if n < 2:',
  '        return False',
  '    if n <= 3:',
  '        return True',
  '    if n % 2 == 0 or n % 3 == 0:',
  '        return False',
  '',
  '    limit = int(math.sqrt(n))',
  '    for i in range(5, limit + 1, 6):',
  '        if n % i == 0 or n % (i + 2) == 0:',
  '            return False',
  '    return True',
]
</script>

<template>
  <section class="space-y-4">
    <div class="flex gap-3">
      <span class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary"><FileCode2 class="size-4" /></span>
      <p class="max-w-3xl text-base leading-7 text-foreground">Chào bạn! Cách tối ưu là loại các số nhỏ hơn 2, bội của 2 và 3, sau đó chỉ kiểm tra các ước dạng <kbd class="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">6k ± 1</kbd> đến <kbd class="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">√n</kbd>.</p>
    </div>

    <div class="overflow-hidden rounded-xl border bg-[#101115] shadow-sm">
      <div class="flex h-10 items-center justify-between border-b bg-muted/60 px-4">
        <span class="flex items-center gap-2 font-mono text-sm font-semibold text-primary"><span class="size-2 rounded-full bg-primary"></span>python</span>
        <button class="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"><Copy class="size-3.5" /> Sao chép</button>
      </div>
      <div class="overflow-x-auto py-3 font-mono text-sm leading-7 sm:text-[13px]">
        <div class="min-w-[34rem]">
          <div v-for="(line, index) in codeLines" :key="index" class="grid grid-cols-[3.5rem_minmax(0,1fr)]">
            <span class="select-none border-r pr-4 text-right text-muted-foreground/60">{{ index + 1 }}</span>
            <code class="whitespace-pre px-5 text-slate-200" :class="line.includes('#') ? 'text-slate-500' : line.includes('def ') ? 'text-sky-300' : line.includes('return') ? 'text-amber-300' : ''">{{ line || ' ' }}</code>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2 pl-11 text-sm text-muted-foreground"><Check class="size-4 text-emerald-400" /> Đã áp dụng <span class="rounded bg-muted px-2 py-0.5 font-medium text-foreground">Giải thích thuật toán</span></div>
  </section>
</template>

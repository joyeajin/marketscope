<script setup lang="ts">
import { computed, ref } from "vue";
import type { Asset, AssetId } from "@/types/market";
import AssetListItem from "./AssetListItem.vue";

const props = defineProps<{
  assets: Asset[];
  selectedId: AssetId | null;
}>();

defineEmits<{
  (e: "select", id: AssetId): void;
}>();

const keyword = ref("");

// 심볼 또는 이름에 검색어가 포함된 자산만 표시
const filteredAssets = computed(() => {
  const text = keyword.value.trim().toLowerCase();

  if (!text) return props.assets;

  return props.assets.filter(
    (item) =>
      item.symbol.toLowerCase().includes(text) ||
      item.name.toLowerCase().includes(text),
  );
});
</script>

<template>
  <div class="card list">
    <input v-model="keyword" type="search" placeholder="Search assets..." />

    <ul>
      <AssetListItem
        v-for="asset in filteredAssets"
        :key="asset.id"
        :asset="asset"
        :active="asset.id === selectedId"
        @select="$emit('select', $event)"
      />
    </ul>

    <p v-if="filteredAssets.length === 0" class="empty">
      검색 결과가 없습니다.
    </p>
  </div>
</template>

<style scoped lang="scss">
.list {
  padding: 14px;
}

input {
  width: 100%;
  padding: 10px 14px;
  margin-bottom: 10px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--bg);
  color: var(--text);
}

.empty {
  padding: 20px 0;
  text-align: center;
  color: var(--sub);
}
</style>

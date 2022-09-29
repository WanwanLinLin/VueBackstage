<template>
  <div class="dashboard-container">
    <div class="dashboard-text">管理员大名: {{ name }}</div>
    <Card></Card>
  </div>
</template>

<script>
import Card from "./Card"
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',

  components: {
    Card
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

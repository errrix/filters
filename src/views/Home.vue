<template>
  <div class="homepage">
    <Filters/>
    <List/>
  </div>
</template>

<script>
import Filters from '../components/Filters.vue';
import List from '../components/List.vue';

export default {
  name: 'home',
  components: {
    Filters, List,
  },
};
</script>

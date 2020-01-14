<template>
    <div v-if="getSelectedList.length" class="filtered-list">
      <div v-for="item in getSelectedList"
           :key="item.id"
           class="filtered-list__item"
      >
        <div class="filtered-list__item--image-block">
          <img src="https://www.fillmurray.com/640/360" alt="">
          <h4>{{getCityName(item.city).name}}</h4>
        </div>
        <div class="filtered-list__item--bottom-block">
        <h2>
          {{item.name}}
        </h2>
          <div class="filtered-list__item--tag-price-block">
            <p class="filtered-list__item--tag-price-block__tag">
              {{getCategoryName(item.category)}}
            </p>
            <p class="filtered-list__item--tag-price-block__price">${{item.price}}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else
         class="filtered-list --error">
      <h2>OOPS</h2>
      <p>
        Your search did not match
      </p>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'List',

  computed: {
    ...mapGetters(['getSelectedList', 'getCategoryName', 'getCityName']),
  },
};
</script>

<style scoped>

</style>

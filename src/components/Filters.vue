<template>
  <form class="filters" >
    <div class="filters__block">
      <h3>city</h3>
      <v-select v-model="currentCity"
                label="name"
                :options="cities"
                placeholder="click to select"
      />
    </div>
    <div class="filters__block">
      <h3>categories</h3>
      <div class="checkbox-block">
        <label v-for="category in categories"
               :key="category.id"
        >
          <input v-model="selectedCategories"
                 :id="category.id"
                 :value="category.id"
                 type="checkbox"
          >
          <div/>
          <p>{{category.name}} <span>({{getItemsInCategory(category.id)}})</span></p>
        </label>
      </div>
    </div>

    <div class="filters__block">
      <h3>price</h3>
      <div id="no-ui-slider"></div>
    </div>
    <div class="filters__button-price-block">
      <span>{{minRange}}$</span>
      <span> - </span>
      <span>{{maxRange}}$</span>
      <button type="submit" @click.prevent="sendFilters">filter</button>
    </div>
  </form>
</template>

<script>
import noUiSlider from 'nouislider';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'Filters',

  data() {
    return {
      minRange: null,
      maxRange: null,
      currentCity: null,
      selectedCategories: [],
      sliderProps: {
        startMin: this.$store.getters.getMinRange || 0,
        startMax: this.$store.getters.getMaxRange || 100,
        min: this.$store.getters.getMinRange || 0,
        max: this.$store.getters.getMaxRange || 100,
      },
      ragePriceSlider: null,
    };
  },

  computed: {
    ...mapState([
      'categories', 'cities',
    ]),
    ...mapGetters([
      'getItemsInCategory', 'getMinRange', 'getMaxRange',
    ]),
  },

  mounted() {
    this.ragePriceSlider = noUiSlider.create(document.getElementById('no-ui-slider'), {
      start: [this.sliderProps.startMin, this.sliderProps.startMax],
      connect: true,
      range: {
        min: this.sliderProps.min,
        max: this.sliderProps.max,
      },
    });

    this.ragePriceSlider.on('update', (values, handle) => {
      this[handle ? 'maxRange' : 'minRange'] = parseInt(values[handle], 0);
    });
  },

  methods: {
    ...mapActions([
      'sendFilters',
    ]),
    sendFilters() {
      const city = this.currentCity ? this.currentCity.id : null;
      this.$store.dispatch('sendFilters', {
        minRange: this.minRange,
        maxRange: this.maxRange,
        currentCity: city,
        selectedCategories: this.selectedCategories,
      });
    },
  },
};
</script>

<style scoped>

</style>

<template>
  <form class="filters">
    <div class="filters__block">
      <h3>city</h3>
      <v-select v-model="currentCity"
                label="name"
                :options="cities"
                :reduce="city => city.id"
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
          <p>
            {{category.name}}
            <span>
              ({{getItemsInCategory(category.id)}})
            </span>
          </p>
        </label>
      </div>
    </div>

    <div class="filters__block">
      <h3>price</h3>
      <div id="no-ui-slider"></div>
    </div>
    <div class="filters__button-price-block">
      <div>
        <span>{{minRange}}$</span>
        <span>-</span>
        <span>{{maxRange}}$</span>
      </div>
      <button type="submit"
              @click.prevent="filterSubmit"
      >
        filter
      </button>
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
      // Дефолтные настройки слайдера
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
    // Не стал делать геттеры для значений, которые не нужно модифицировать
    ...mapState([
      'categories', 'cities',
    ]),
    ...mapGetters([
      'getItemsInCategory', 'getMinRange', 'getMaxRange',
    ]),
  },

  mounted() {
    // Если квери запроса не пустой объект, забираем из него значения и диспачим экшн
    if (Object.keys(this.$route.query).length) {
      this.setParamsFromQuery();
      this.sendFilters();
    }

    // Настройки слайдера
    this.ragePriceSlider = noUiSlider.create(document.getElementById('no-ui-slider'), {
      start: [this.minRange || this.sliderProps.startMin, this.maxRange || this.sliderProps.startMax],
      connect: true,
      range: {
        min: this.sliderProps.min,
        max: this.sliderProps.max,
      },
    });

    // Привязка слайдера к стейту компонента
    this.ragePriceSlider.on('update', (values, handle) => {
      this[handle ? 'maxRange' : 'minRange'] = parseInt(values[handle], 0);
    });
  },

  methods: {
    ...mapActions([
      'sendFilters',
    ]),

    filterSubmit() {
      this.setUrlFromParams();
      this.sendFilters();
    },

    // Передаем в экшн объект с параметрами фильтров
    sendFilters() {
      this.$store.dispatch('sendFilters', {
        minRange: this.minRange,
        maxRange: this.maxRange,
        currentCity: this.currentCity,
        selectedCategories: this.selectedCategories,
      });
    },

    // Пишем в квери данные из стейта при сабмите формы фильтров
    setUrlFromParams() {
      const query = {};
      if (this.minRange !== this.$store.getters.getMinRange) {
        query.minrange = this.minRange;
      }
      if (this.maxRange !== this.$store.getters.getMaxRange) {
        query.maxrange = this.maxRange;
      }
      if (this.currentCity) {
        query.currentcity = this.currentCity;
      }
      if (this.selectedCategories.length) {
        query.categories = this.selectedCategories.join('-');
      }
      this.$router.push({ path: this.$route.path, query });
    },

    // Устанавливаем значения стейта из квери параметров
    setParamsFromQuery() {
      if (this.$route.query.minrange) {
        this.minRange = this.$route.query.minrange;
      }
      if (this.$route.query.maxrange) {
        this.maxRange = this.$route.query.maxrange;
      }
      if (this.$route.query.categories) {
        this.selectedCategories = this.$route.query.categories.split('-');
      }
      if (this.$route.query.currentcity) {
        this.currentCity = +this.$route.query.currentcity;
      }
    },
  },
};
</script>

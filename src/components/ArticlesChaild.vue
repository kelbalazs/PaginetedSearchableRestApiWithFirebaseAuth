<template>
  <div id="app">
    <Loader :loading="showLoader" />
    <div class="search-wrapper">
      <form>
        <div class="search-text-container">
          <label>Search by Title</label><br />
          <input type="search" @input="searchByTitle($event.target.value)" class="search-bar" v-model="search" placeholder="Search by title" />
        </div>
        <div class="yearfilter">
          <label>Choose the Year</label><br />
          <span class="filter-year" v-for="(item, index) in filteredByYear" :key="index">{{item}}
            <button class="filter-clear-button" type="button" @click.prevent="clearfilter(index)">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><path fill="#FFF" d="M6.895455 5l2.842897-2.842898c.348864-.348863.348864-.914488 0-1.263636L9.106534.261648c-.348864-.348864-.914489-.348864-1.263636 0L5 3.104545 2.157102.261648c-.348863-.348864-.914488-.348864-1.263636 0L.261648.893466c-.348864.348864-.348864.914489 0 1.263636L3.104545 5 .261648 7.842898c-.348864.348863-.348864.914488 0 1.263636l.631818.631818c.348864.348864.914773.348864 1.263636 0L5 6.895455l2.842898 2.842897c.348863.348864.914772.348864 1.263636 0l.631818-.631818c.348864-.348864.348864-.914489 0-1.263636L6.895455 5z"></path></svg>
            </button>
          </span>
          <select class="selectyear" v-model="selectedyear" @change="onChangeyear">
            <option value="">Select</option>
            <option :value="2021">2021</option>
            <option :value="2020">2020</option>
            <option :value="2019">2019</option>
            <option :value="2018">2018</option>
            <option :value="2017">2017</option>
            <option :value="2016">2016</option>
          </select>
        </div>
      </form>
    </div>
    <ul class="flex-container">
      <li v-for="item in items.results" :key="item.id" class="flex-item">
        <div id="image">
          <img
            v-if="getImg(item)"
            :src="getImg(item).url"
          />
        </div>
        <div id="date">{{ formatDate(item.pub_date) }}</div>
        <div id="title" v-html="item.title"/>
        <!-- <div id="article"  v-html="item.details_en" target="blank">Explore More</div> -->
    
      
      </li>
      <li v-if="items.length === 0" class="flex-item center">No Record Found</li>
    </ul>
    <ul class="showItems">
      <li>Show Items:
        <select @change="onChangeRecordsPerPage" v-model="recordsPerPage">
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="30">30</option>
          <option :value="40">40</option>
          <option :value="50">50</option>
        </select>
      </li>
      <li>
        Go to Page <input type="text" v-model="page"><button type="button" @click.prevent="gotoPage">Go</button>
      </li>
    </ul>
    <Pagination v-if="items.results" :total-pages="totalPages" :per-page="this.recordsPerPage" :current-page="page" @pagechanged="onPageChange" />
  </div>
</template>

<script>
import axios from 'axios';
import Pagination from '@/components/Pagination'
import Loader from '@/components/Loader'
import moment from 'moment';

const baseURL = 'https://zbeta2.mykuwaitnet.net/backend/en/api/v2/media-center/press-release/'
export default {
  components: {
    Pagination,
    Loader
  },
  data() {
    return {
      showLoader: false,
      items:[],
      search: '',
      page: 1,
      totalPages: 0,
      totalRecords: 0,
      recordsPerPage: 10,
      params: '',
      pageno: this.page,
      debounce: '',
      selectedyear: '',
      filteredByYear: []
    }
  },
  created() {
    this.loadPressRelease()
  },
  watch: {
    search(newVal, oldVal) {
      if (oldVal && !newVal) {
        console.log('morning has broken...');
      }
      if (!newVal) {
        this.clearSearch()
      }
    }
  },
  methods: {
    loadPressRelease () {
      this.showLoader = true
      axios.get(`${baseURL}?page=${this.page}&page_size=${this.recordsPerPage}&${this.params}`)
      .then(response => {
        console.log('response', response)
        this.showLoader = false
        this.items = response.data
        this.totalPages = Math.ceil(response.data.count / this.recordsPerPage)
        this.totalRecords = response.data.count
        if (response.data.count === 0) {
          this.items = []
        }
      })
    },
    onPageChange(page) {
      this.page = page
      this.loadPressRelease()
    },
    formatDate(date) {
      return moment(date).format('ll')
    },
    searchByTitle (value) {
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        if (value.length >= 3) {
          this.page = 1
          this.params = `q=${value}&years=${this.filteredByYear.join(',')}`
          this.loadPressRelease()
        }
      }, 600)
    },
    clearSearch () {
      this.search = ''
      this.page = 1
      this.params = ''
      this.loadPressRelease()
    },
    getImg (press) {
      let image = false
      if (!image && press.downloadable) {
        press.downloadable.forEach((file) => {
          if (file.is_banner && file.type === 'image' && file.image_en) {
            image = {}
            image.url = file.image_en.file
          }
        })
      }
      return image
    },
    onChangeRecordsPerPage () {
      this.loadPressRelease()
    },
    gotoPage () {
      if (!isNaN(parseInt(this.page))) {
        this.page = parseInt(this.page)
        this.loadPressRelease()
      }
    },
    onChangeyear () {
      if (this.filteredByYear.indexOf(this.selectedyear) == -1) {
        this.filteredByYear.push(this.selectedyear)
        this.params = `&q=${this.search}&years=${this.filteredByYear.join(',')}`
        this.loadPressRelease()
      }
    },
    clearfilter (index) {
      this.filteredByYear.splice(index, 1)
    }
  }
}

</script>
<style>
  body {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
  }
  .search-text-container {
    width: 50%;
    display: inline-block;
    margin: 10px;
  }
  .search-bar {
    border: 1px solid #ccc;
    outline: 0;
    border-radius: 5px;
    width: 50%;
    padding: 0.5rem;
  }
  .search-bar:focus {
    box-shadow: 0 0 15px 5px #b0e0ee;
    border: 2px solid #bebede;
  }
  .search-box:not(:valid) ~ .close-icon {
    display: none;
  }
  ul.flex-container {
    padding: 0;
    margin: 0;
    list-style-type: none;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-flow: row wrap;
    flex-direction: row wrap;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  li img {
    display: initial;
    height: 100px;
  }
  .flex-item {
    background: rgb(149, 158, 211);
    width: calc(100% / 5.5);
    padding: 5px;
    height: auto;
    margin-top: 10px;
    color: white;
    font-weight: bold;
    text-align: center;
  }
  .downloads {
    margin-top: 10px;
  }
  .showItems {
    display: inline-block;
    margin-left: -35px;
  }
  .showItems li {
    list-style-type: none;
    display: inline-block;
    margin-left: 10px;
  }
  .yearfilter {
    display: inline-block;
    width: 48%;
    text-align: right;
  }
  span.filter-year {
    display: inline-block;
    padding: 0.50rem;
    background: rgb(149, 158, 211);
    margin: 5px;
    border-radius: 3px;
    color: white;
    font-weight: bold;
  }
  .filter-clear-button {
    border: none;
    background: rgb(149, 158, 211);
    cursor: pointer;
  }
  select.selectyear {
    cursor: pointer;
    font: normal 11px/22px Arial, Sans-Serif;
    border: 1px solid #ccc;
    font-size: 15px;
    padding: 8px;
    border-radius: 3px;
    color: #888484;
  }
  label {
    color: #888484;
  }
</style>
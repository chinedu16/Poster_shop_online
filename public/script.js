const PRICE = 9.99;
const LOAD_NUM = 10;

new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [],
    cart: [],
    results: [],
    price: PRICE,
    newSearch: 'anime',
    lastSearch: '',
    loading: false
  },
  methods: {
    appendItems:  function () {
      if (this.items.length < this.results.length) {
        var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
        this.items = this.items.concat(append)
      }
      console.log("appendItems")
    },
    onSubmit: function () {
      if (this.newSearch.length) {
        this.items = []
        this.loading = true;
        this.$http
          .get('/search/'.concat(this.newSearch))
          .then(function (res) {
            this.lastSearch = this.newSearch;
            this.results = res.body
            this.appendItems();
            this.loading = false;
        });
      }
      
    },
    AddItem: function (index) {
      this.total += PRICE;
      var item = this.items[index];
      var found = false;
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === item.id) {
          found = true
          this.cart[i].qty++;
          break;
        }
      }
      if (!found) {
        this.cart.push({
          id: item.id,
          title: item.title,
          qty: 1,
          price: PRICE
        }); 
      }
    },
    Inc: function (item) {
      item.qty++;
      this.total += PRICE
    },
    Dec: function (item) {
      item.qty--;
      this.total -= PRICE
      if (item.qty <= 0) {
        for (let i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            this.cart.splice(i, 1);
            break;
          }
        }
      }
    }
  },
  filters: {
    currency: function (price) {
      return '$'.concat(price); 
      // return '$'.concat(price.toFixed(2));
    }
  },
  mounted: function () {
    this.onSubmit();

    var VueInstance = this;
    var elem = document.getElementById('product-list-bottom');
    var watcher = scrollMonitor.create(elem);
    watcher.enterViewport(function () {
      VueInstance.appendItems();
      // console.log("Apppedsd")
    })
  },
  computed: {
    noMoreItems: function() {
      return this.items.length === this.results.length && this.results.length > 0;
    }
  }
});



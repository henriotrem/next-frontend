this.dimensions = {};
this.dimensions.geospatiality = require("./dimensions/geospatiality");
this.dimensions.temporality = require("./dimensions/temporality");

this.init = function (service, universes, origin, filter, step, callback) {

    this.service = service;
    this.origin = origin;
    this.filter = filter;
    this.step = step;
    this.limit = step;
    this.level = 0;
    this.callback = callback;

    this.universes = {};
    for(let name of universes)
      this.universes[name] = null;

    this.layers = [this.new(), this.new()];
    this.layer = this.layers[this.level];

    this.prepare(universes);

    this.queries = 0;
    this.unique = 0;
};
this.new = function() {

    let layer = {};
    layer.radius = Infinity;
    layer.indexed = {list: [], count: 0};
    layer.selected = {list: [], ids: '', count: 0};
    layer.loaded = {list: [], count: 0};
    layer.query = {};

    for(let universe in this.universes)
      layer.query[universe] = {list: {ids: '', elements: []}, index: {ids: '', elements: []}, object: {ids: '', elements: []}}

    layer.waiting = 0;
    layer.target = 0;

    return layer;
};
this.prepare = function(universes) {

  let size = universes.length;

  for(let name of universes) {

    this.service.getUniverse(name).subscribe(
      (universe) => {

        this.universes[name] = universe;

        let root = name + "|index";

        for (let dimension of universe.dimensions)
          root += "." + dimension.base.root;

        let element = this.create(root, 0, name);

        this.layer.selected.list.push(element);
        this.layer.query[name].index.ids += element.key.substring(element.key.indexOf(".") + 1)
        this.layer.query[name].index.elements.push(element);

        if (++this.layer.target === size)
          this.query();
      }
    )
  }
};
this.create = function(key, count, universe) {

    var element = {};

    element.key = key;
    element.universe = universe;
    element.type = key.indexOf("index") !== -1 ? "index" : key.indexOf("list") !== -1 ? "list" : "object";
    element.count = count;
    element.index = [];
    element.distance = 0;
    element.selected = true;

    let array = key.split(".");

    for (let i = 1; i < array.length; i++) {

        let dimension = this.dimensions[this.universes[universe].dimensions[i-1].key];
        let index = {};

        index.key = array[i];
        index.bounds = dimension.decode(this.universes[universe].dimensions[i-1].base, index.key);

        index.distance = dimension.indexDistance(this.origin[dimension.key], index.bounds);
        index.direction = dimension.indexDirection(this.origin[dimension.key], index.bounds);

        element.distance += Math.pow(index.distance/this.filter[dimension.key].ratio, 2);
        element.selected = element.selected && dimension.filterDirection(this.filter[dimension.key].direction, index.direction) && dimension.filterDistance(this.filter[dimension.key].distance,  index.distance);

        element.index.push(index);
    }

    return element;
};
this.more = function () {

    this.queries = 0;
    this.unique = 0;

    this.level = this.layers.length-1;
    this.limit += this.step;

    this.next();
};
this.next = function () {

    this.layer = this.layers[this.level];

    if(this.level === 0) {

        this.limit -= this.step;
        this.more();
    } else if(this.select()){

        this.query();
    } else {

        this.level--;
        this.next();
    }
};
this.select = function () {

    let result = false;
    let selected = 0;
    let limit = 9 * Object.keys(this.universes).length;

    this.layer.indexed.list.sort(this.sort);

    if(this.layer.indexed.list.length === 0 && this.layer.selected.list.length > 0)
        result = true;

    for (let element of this.layer.indexed.list) {

        if(element.distance >= this.layers[this.level - 1].radius)
            break;

        if(this.layers.length === this.level + 1 && element.type !== 'object')
            this.layers.push(this.new());

        this.layer.selected.count += element.count;
        this.layer.indexed.count -= element.count;
        this.layer.selected.list.push(element);

        let id = (element.type !== 'object' ? element.key.substring(element.key.indexOf(".")+1) : element.key.split('.')[0].split('|')[1]);

        this.layer.query[element.universe][element.type].ids += (this.layer.query[element.universe][element.type].ids.length > 0 ? ',' : '') + id;
        this.layer.query[element.universe][element.type].elements.push(element);

        selected++;

        if(this.layer.loaded.count + this.layer.selected.count - this.layer.waiting >= this.limit) {
            result = true;

            if(this.layers[this.layers.length-1].loaded.count !== 0 || selected > limit || (this.level+1) === this.layers.length)
                break
        }
    }

    this.layer.indexed.list.splice(0, selected);
    this.layer.target += selected;

    this.adjust();

    return result;
};
this.adjust = function () {

    if(this.layer.selected.list.length > 0) {
        this.layer.radius = this.layer.selected.list[this.layer.selected.list.length-1].distance;
    } else if(this.level > 0) {
        this.layer.radius = this.layers[this.level-1].radius;
    }

    this.layers[this.level - 1].waiting = this.layer.indexed.count + this.layer.waiting;
    this.layers[this.level - 1].loaded.count = this.layer.indexed.count + this.layer.selected.count + this.layer.loaded.count;
};
this.query = function () {

    for (let universe in this.layer.query)
      for (let type in this.layer.query[universe])
        if(this.layer.query[universe][type].ids.length > 0)
          this[type](universe, this.layer.query[universe][type].ids, this.layer.query[universe][type].elements)

};
this.index = function(universe, ids, elements) {

  this.service.getIndexes(universe, ids).subscribe(
    (indexes) => {

      let i = 0;
      for(let name in indexes) {

        this.unique += indexes[name].length;

        for (var j = 0; j < indexes[name].length / 2; j++)
          this.store(this.create(indexes[name][j * 2], parseInt(indexes[name][j * 2 + 1]), universe), this.layers[this.level+1]);

        this.update(elements[i]);
        i++;
      }
    }
  );
};
this.list = function(universe, ids, elements) {

  this.service.getLists(universe, ids).subscribe(
    (lists) => {

      let i = 0;
      for(let name in lists) {

        this.unique += lists[name].length;

        for (var j = 0; j < lists[name].length; j++)
          if(lists[name][j] !== '1')
            this.store(this.create(lists[name][j], 1, universe), this.layers[this.level + 1]);

        this.update(elements[i]);
        i++;
      }
    }
  );
};
this.object = function(universe, ids, elements) {

    if(this.level + 1 === this.layers.length) {

      this.layer.loaded.count += elements.length;
      this.layer.selected.list = [];
      this.layer.selected.count = 0;

      for(let universe in this.universes)
        this.layer.query[universe] = {list: {ids: '', elements: []}, index: {ids: '', elements: []}, object: {ids: '', elements: []}}

      this.callback(universe, ids, elements);
    } else {

      for(let element of elements) {
        this.store(element, this.layers[this.level + 1]);
        this.update(element);
      }
    }
};
this.store = function (element, storage) {

    if (element.selected) {

        storage.indexed.list.push(element);
        storage.indexed.count += element.count;
    }
};
this.update = function(element) {

    this.layer.loaded.count += element.count;

    if (--this.layer.target === 0) {

        this.queries++;
        this.layer.selected.list = [];
        this.layer.selected.count = 0;

        for(let universe in this.universes)
          this.layer.query[universe] = {list: {ids: '', elements: []}, index: {ids: '', elements: []}, object: {ids: '', elements: []}}

        this.level++;

        this.next();
    }
};
this.sort = function (a, b) {
    return a.distance - b.distance;
};

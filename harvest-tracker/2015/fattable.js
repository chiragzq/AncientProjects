var ids;
// Generated by CoffeeScript 1.6.3
    function textToArray(text) {
  var array = [""];
  var add = 0; //new
  var stop = 0;
  var i = 1;
  while(stop == 0) {
    add = 0;
    if (text[i - 1] == " ") add = 1;
    if(add == 0)array[array.length - 1] = array[array.length - 1] + text[i - 1];
    else array = array.concat("");
    i ++;
    if(i > text.length) stop = 1;
  }
  return array;
}
var x = new XMLHttpRequest();
x.open('GET', 'getcrop.php', false);
x.send();
(function() {
  "use strict";
  var EventRegister, LRUCache, PagedAsyncTableModel, Painter, Promise, ScrollBarProxy, SyncTableModel, TableModel, TableView, binary_search, bound, closest, cumsum, distance, domReadyPromise, fattable, getTranformPrefix, k, ns, onLoad, prefixedTransformCssKey, smallest_diff_subsequence, v, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  cumsum = function(arr) {
    var cs, s, x, _i, _len;
    cs = [0.0];
    s = 0.0;
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      x = arr[_i];
      s += x;
      cs.push(s);
    }
    return cs;
  };

  bound = function(x, m, M) {
    if (x < m) {
      return m;
    } else if (x > M) {
      return M;
    } else {
      return x;
    }
  };

  Promise = (function() {
    function Promise() {
      this.callbacks = [];
      this.result = false;
      this.resolved = false;
    }

    Promise.prototype.then = function(cb) {
      if (this.resolved) {
        return cb(this.result);
      } else {
        return this.callbacks.push(cb);
      }
    };

    Promise.prototype.resolve = function(result) {
      var cb, _i, _len, _ref, _results;
      this.resolved = true;
      this.result = result;
      _ref = this.callbacks;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cb = _ref[_i];
        _results.push(cb(result));
      }
      return _results;
    };

    return Promise;

  })();

  domReadyPromise = new Promise();

  onLoad = function() {
    document.removeEventListener("DOMContentLoaded", onLoad);
    return domReadyPromise.resolve();
  };

  document.addEventListener("DOMContentLoaded", onLoad);

  getTranformPrefix = function() {
    var el, testKey, _i, _len, _ref;
    el = document.createElement("div");
    _ref = ["transform", "WebkitTransform", "MozTransform", "OTransform", "MsTransform"];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      testKey = _ref[_i];
      if (el.style[testKey] !== void 0) {
        return testKey;
      }
    }
  };

  prefixedTransformCssKey = getTranformPrefix();

  TableModel = (function() {
    function TableModel() {}

    TableModel.prototype.hasCell = function(i, j) {
      return false;
    };

    TableModel.prototype.hasHeader = function(j) {
      return false;
    };

    TableModel.prototype.getCell = function(i, j, cb) {
      if (cb == null) {
        cb = (function() {});
      }
      return cb("getCell not implemented");
    };

    TableModel.prototype.getHeader = function(j, cb) {
      if (cb == null) {
        cb = (function() {});
      }
      return cb("getHeader not implemented");
    };

    return TableModel;

  })();

  SyncTableModel = (function(_super) {
    __extends(SyncTableModel, _super);

    function SyncTableModel() {
      _ref = SyncTableModel.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SyncTableModel.prototype.getCellSync = function(i, j) {
      return i + "," + j;
    };

    SyncTableModel.prototype.getHeaderSync = function(j) {
      return "col " + j;
    };

    SyncTableModel.prototype.hasCell = function(i, j) {
      return true;
    };

    SyncTableModel.prototype.hasHeader = function(j) {
      return true;
    };

    SyncTableModel.prototype.getCell = function(i, j, cb) {
      if (cb == null) {
        cb = (function() {});
      }
      return cb(this.getCellSync(i, j));
    };

    SyncTableModel.prototype.getHeader = function(j, cb) {
      if (cb == null) {
        cb = (function() {});
      }
      return cb(this.getHeaderSync(j));
    };

    return SyncTableModel;

  })(TableModel);

  LRUCache = (function() {
    function LRUCache(size) {
      this.size = size != null ? size : 100;
      this.data = {};
      this.lru_keys = [];
    }

    LRUCache.prototype.has = function(k) {
      return this.data.hasOwnProperty(k);
    };

    LRUCache.prototype.get = function(k) {
      return this.data[k];
    };

    LRUCache.prototype.set = function(k, v) {
      var idx, removeKey;
      idx = this.lru_keys.indexOf(k);
      if (idx >= 0) {
        this.lru_keys.splice(idx, 1);
      }
      this.lru_keys.push(k);
      if (this.lru_keys.length >= this.size) {
        removeKey = this.lru_keys.shift();
        delete this.data[removeKey];
      }
      return this.data[k] = v;
    };

    return LRUCache;

  })();

  PagedAsyncTableModel = (function(_super) {
    __extends(PagedAsyncTableModel, _super);

    function PagedAsyncTableModel(cacheSize) {
      if (cacheSize == null) {
        cacheSize = 100;
      }
      this.pageCache = new LRUCache(cacheSize);
      this.headerPageCache = new LRUCache(cacheSize);
      this.fetchCallbacks = {};
      this.headerFetchCallbacks = {};
    }

    PagedAsyncTableModel.prototype.cellPageName = function(i, j) {};

    PagedAsyncTableModel.prototype.headerPageName = function(j) {};

    PagedAsyncTableModel.prototype.getHeader = function(j) {
      var pageName,
        _this = this;
      pageName = this.headerPageName(j);
      if (this.headerPageCache.has(pageName)) {
        return cb(this.headerPageCache.get(pageName)(j));
      } else if (this.headerFetchCallbacks[pageName] != null) {
        return this.headerFetchCallbacks[pageName].push([j, cb]);
      } else {
        this.headerFetchCallbacks[pageName] = [[j, cb]];
        return this.fetchHeaderPage(pageName, function(page) {
          var cb, _i, _len, _ref1, _ref2;
          _this.headerPageCache.set(pageName, page);
          _ref1 = _this.headerFetchCallbacks[pageName];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            _ref2 = _ref1[_i], j = _ref2[0], cb = _ref2[1];
            cb(page(j));
          }
          return delete _this.headerFetchCallbacks[pageName];
        });
      }
    };

    PagedAsyncTableModel.prototype.hasCell = function(i, j) {
      var pageName;
      pageName = this.cellPageName(i, j);
      return this.pageCache.has(pageName);
    };

    PagedAsyncTableModel.prototype.getCell = function(i, j, cb) {
      var pageName,
        _this = this;
      if (cb == null) {
        cb = (function() {});
      }
      pageName = this.cellPageName(i, j);
      if (this.pageCache.has(pageName)) {
        return cb(this.pageCache.get(pageName)(i, j));
      } else if (this.fetchCallbacks[pageName] != null) {
        return this.fetchCallbacks[pageName].push([i, j, cb]);
      } else {
        this.fetchCallbacks[pageName] = [[i, j, cb]];
        return this.fetchCellPage(pageName, function(page) {
          var _i, _len, _ref1, _ref2;
          _this.pageCache.set(pageName, page);
          _ref1 = _this.fetchCallbacks[pageName];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            _ref2 = _ref1[_i], i = _ref2[0], j = _ref2[1], cb = _ref2[2];
            cb(page(i, j));
          }
          return delete _this.fetchCallbacks[pageName];
        });
      }
    };

    PagedAsyncTableModel.prototype.fetchCellPage = function(pageName, cb) {};

    PagedAsyncTableModel.prototype.getHeader = function(j, cb) {
      if (cb == null) {
        cb = (function() {});
      }
      return cb("col " + j);
    };

    return PagedAsyncTableModel;

  })(TableModel);

  binary_search = function(arr, x) {
    var a, b, m, v;
    if (arr[0] > x) {
      return 0;
    } else {
      a = 0;
      b = arr.length;
      while (a + 2 < b) {
        m = (a + b) / 2 | 0;
        v = arr[m];
        if (v < x) {
          a = m;
        } else if (v > x) {
          b = m;
        } else {
          return m;
        }
      }
      return a;
    }
  };

  distance = function(a1, a2) {
    return Math.abs(a2 - a1);
  };

  closest = function() {
    var d, d_, res, vals, x, x_, _i, _len;
    x = arguments[0], vals = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    d = Infinity;
    res = void 0;
    for (_i = 0, _len = vals.length; _i < _len; _i++) {
      x_ = vals[_i];
      d_ = distance(x, x_);
      if (d_ < d) {
        d = d_;
        res = x_;
      }
    }
    return res;
  };

  Painter = (function() {
    function Painter() {}

    Painter.prototype.setupCell = function(cellDiv) {};

    Painter.prototype.setupHeader = function(headerDiv) {};

    Painter.prototype.cleanUpCell = function(cellDiv) {};

    Painter.prototype.cleanUpHeader = function(headerDiv) {};

    Painter.prototype.cleanUp = function(table) {
      var cell, header, _, _ref1, _ref2, _results;
      _ref1 = table.cells;
      for (_ in _ref1) {
        cell = _ref1[_];
        this.cleanUpCell(cell);
      }
      _ref2 = table.columns;
      _results = [];
      for (_ in _ref2) {
        header = _ref2[_];
        _results.push(this.cleanUpHeader(header));
      }
      return _results;
    };

    Painter.prototype.fillHeader = function(headerDiv, data) {
      return headerDiv.textContent = data;
    };

    Painter.prototype.fillCell = function(cellDiv, data) {
      return cellDiv.textContent = data;
    };

    Painter.prototype.fillHeaderPending = function(headerDiv) {
      return headerDiv.textContent = "NA";
    };

    Painter.prototype.fillCellPending = function(cellDiv) {
      return cellDiv.textContent = "NA";
    };

    return Painter;

  })();

  smallest_diff_subsequence = function(arr, w) {
    var l, start;
    l = 1;
    start = 0;
    while (start + l < arr.length) {
      if (arr[start + l] - arr[start] > w) {
        start += 1;
      } else {
        l += 1;
      }
    }
    return l;
  };

  EventRegister = (function() {
    function EventRegister() {
      this.boundEvents = [];
    }

    EventRegister.prototype.bind = function(target, evt, cb) {
      this.boundEvents.push([target, evt, cb]);
      return target.addEventListener(evt, cb);
    };

    EventRegister.prototype.unbindAll = function() {
      var cb, evt, target, _i, _len, _ref1, _ref2;
      _ref1 = this.boundEvents;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        _ref2 = _ref1[_i], target = _ref2[0], evt = _ref2[1], cb = _ref2[2];
        target.removeEventListener(evt, cb);
      }
      return this.boundEvents = [];
    };

    return EventRegister;

  })();

  ScrollBarProxy = (function() {
    function ScrollBarProxy(container, headerContainer, W, H, eventRegister, visible, enableDragMove) {
      var bigContentHorizontal, bigContentVertical, getDelta, onMouseWheel, onMouseWheelHeader, supportedEvent,
        _this = this;
      this.container = container;
      this.headerContainer = headerContainer;
      this.W = W;
      this.H = H;
      this.visible = visible != null ? visible : true;
      this.enableDragMove = enableDragMove != null ? enableDragMove : true;
      this.verticalScrollbar = document.createElement("div");
      this.verticalScrollbar.className += " fattable-v-scrollbar";
      this.horizontalScrollbar = document.createElement("div");
      this.horizontalScrollbar.className += " fattable-h-scrollbar";
      if (this.visible) {
        this.container.appendChild(this.verticalScrollbar);
        this.container.appendChild(this.horizontalScrollbar);
      }
      bigContentHorizontal = document.createElement("div");
      bigContentHorizontal.style.height = 1 + "px";
      bigContentHorizontal.style.width = this.W + "px";
      bigContentVertical = document.createElement("div");
      bigContentVertical.style.width = 1 + "px";
      bigContentVertical.style.height = this.H + "px";
      this.horizontalScrollbar.appendChild(bigContentHorizontal);
      this.verticalScrollbar.appendChild(bigContentVertical);
      this.scrollbarMargin = Math.max(this.horizontalScrollbar.offsetHeight, this.verticalScrollbar.offsetWidth);
      this.verticalScrollbar.style.bottom = this.scrollbarMargin + "px";
      this.horizontalScrollbar.style.right = this.scrollbarMargin + "px";
      this.scrollLeft = 0;
      this.scrollTop = 0;
      this.horizontalScrollbar.onscroll = function() {
        if (!_this.dragging) {
          if (_this.scrollLeft !== _this.horizontalScrollbar.scrollLeft) {
            _this.scrollLeft = _this.horizontalScrollbar.scrollLeft;
            return _this.onScroll(_this.scrollLeft, _this.scrollTop);
          }
        }
      };
      this.verticalScrollbar.onscroll = function() {
        if (!_this.dragging) {
          if (_this.scrollTop !== _this.verticalScrollbar.scrollTop) {
            _this.scrollTop = _this.verticalScrollbar.scrollTop;
            return _this.onScroll(_this.scrollLeft, _this.scrollTop);
          }
        }
      };
      if (this.enableDragMove) {
        eventRegister.bind(this.container, 'mousedown', function(evt) {
          if (evt.button === 1) {
            _this.dragging = true;
            _this.container.className = "fattable-body-container fattable-moving";
            _this.dragging_dX = _this.scrollLeft + evt.clientX;
            return _this.dragging_dY = _this.scrollTop + evt.clientY;
          }
        });
        eventRegister.bind(this.container, 'mouseup', function(evt) {
          _this.dragging = false;
          return _this.container.className = "fattable-body-container";
        });
        eventRegister.bind(this.container, 'mousemove', function(evt) {
          var deferred;
          deferred = function() {
            var newX, newY;
            if (_this.dragging) {
              newX = -evt.clientX + _this.dragging_dX;
              newY = -evt.clientY + _this.dragging_dY;
              return _this.setScrollXY(newX, newY);
            }
          };
          return window.setTimeout(deferred, 0);
        });
        eventRegister.bind(this.container, 'mouseout', function(evt) {
          if (_this.dragging) {
            if ((evt.toElement == null) || (evt.toElement.parentElement.parentElement !== _this.container)) {
              _this.container.className = "fattable-body-container";
              return _this.dragging = false;
            }
          }
        });
        eventRegister.bind(this.headerContainer, 'mousedown', function(evt) {
          if (evt.button === 1) {
            _this.headerDragging = true;
            _this.headerContainer.className = "fattable-header-container fattable-moving";
            return _this.dragging_dX = _this.scrollLeft + evt.clientX;
          }
        });
        eventRegister.bind(this.container, 'mouseup', function(evt) {
          var captureClick;
          if (evt.button === 1) {
            _this.headerDragging = false;
            _this.headerContainer.className = "fattable-header-container";
            evt.stopPropagation();
            captureClick = function(e) {
              e.stopPropagation();
              return this.removeEventListener('click', captureClick, true);
            };
            return _this.container.addEventListener('click', captureClick, true);
          }
        });
        eventRegister.bind(this.headerContainer, 'mousemove', function(evt) {
          var deferred;
          deferred = function() {
            var newX;
            if (_this.headerDragging) {
              newX = -evt.clientX + _this.dragging_dX;
              return _this.setScrollXY(newX);
            }
          };
          return window.setTimeout(deferred, 0);
        });
        eventRegister.bind(this.headerContainer, 'mouseout', function(evt) {
          if (_this.headerDragging) {
            if ((evt.toElement == null) || (evt.toElement.parentElement.parentElement !== _this.headerContainer)) {
              _this.headerContainer.className = "fattable-header-container";
            }
            return _this.headerDragging = false;
          }
        });
      }
      if (this.W > this.horizontalScrollbar.clientWidth) {
        this.maxScrollHorizontal = this.W - this.horizontalScrollbar.clientWidth;
      } else {
        this.maxScrollHorizontal = 0;
      }
      if (this.H > this.verticalScrollbar.clientHeight) {
        this.maxScrollVertical = this.H - this.verticalScrollbar.clientHeight;
      } else {
        this.maxScrollVertical = 0;
      }
      supportedEvent = "DOMMouseScroll";
      if (this.container.onwheel !== void 0) {
        supportedEvent = "wheel";
      } else if (this.container.onmousewheel !== void 0) {
        supportedEvent = "mousewheel";
      }
      getDelta = (function() {
        switch (supportedEvent) {
          case "wheel":
            return function(evt) {
              var deltaX, deltaY, _ref1, _ref2, _ref3, _ref4;
              switch (evt.deltaMode) {
                case evt.DOM_DELTA_LINE:
                  deltaX = (_ref1 = -50 * evt.deltaX) != null ? _ref1 : 0;
                  deltaY = (_ref2 = -50 * evt.deltaY) != null ? _ref2 : 0;
                  break;
                case evt.DOM_DELTA_PIXEL:
                  deltaX = (_ref3 = -1 * evt.deltaX) != null ? _ref3 : 0;
                  deltaY = (_ref4 = -1 * evt.deltaY) != null ? _ref4 : 0;
              }
              return [deltaX, deltaY];
            };
          case "mousewheel":
            return function(evt) {
              var deltaX, deltaY, _ref1, _ref2;
              deltaX = 0;
              deltaY = 0;
              deltaX = (_ref1 = evt.wheelDeltaX) != null ? _ref1 : 0;
              deltaY = (_ref2 = evt.wheelDeltaY) != null ? _ref2 : evt.wheelDelta;
              return [deltaX, deltaY];
            };
          case "DOMMouseScroll":
            return function(evt) {
              var deltaX, deltaY;
              deltaX = 0;
              deltaY = 0;
              if (evt.axis === evt.HORIZONTAL_AXI) {
                deltaX = -50.0 * evt.detail;
              } else {
                deltaY = -50.0 * evt.detail;
              }
              return [deltaX, deltaY];
            };
        }
      })();
      onMouseWheel = function(evt) {
        var deltaX, deltaY, has_scrolled, _ref1;
        _ref1 = getDelta(evt), deltaX = _ref1[0], deltaY = _ref1[1];
        has_scrolled = _this.setScrollXY(_this.scrollLeft - deltaX, _this.scrollTop - deltaY);
        if (has_scrolled) {
          return evt.preventDefault();
        }
      };
      onMouseWheelHeader = function(evt) {
        var deltaX, has_scrolled, _, _ref1;
        _ref1 = getDelta(evt), deltaX = _ref1[0], _ = _ref1[1];
        has_scrolled = _this.setScrollXY(_this.scrollLeft - deltaX, _this.scrollTop);
        if (has_scrolled) {
          return evt.preventDefault();
        }
      };
      eventRegister.bind(this.container, supportedEvent, onMouseWheel);
      eventRegister.bind(this.headerContainer, supportedEvent, onMouseWheelHeader);
    }

    ScrollBarProxy.prototype.onScroll = function(x, y) {};

    ScrollBarProxy.prototype.setScrollXY = function(x, y) {
      var has_scrolled;
      has_scrolled = false;
      if (x != null) {
        x = bound(x, 0, this.maxScrollHorizontal);
        if (this.scrollLeft !== x) {
          has_scrolled = true;
          this.scrollLeft = x;
        }
      } else {
        x = this.scrollLeft;
      }
      if (y != null) {
        y = bound(y, 0, this.maxScrollVertical);
        if (this.scrollTop !== y) {
          has_scrolled = true;
          this.scrollTop = y;
        }
      } else {
        y = this.scrollTop;
      }
      this.horizontalScrollbar.scrollLeft = x;
      this.verticalScrollbar.scrollTop = y;
      this.onScroll(x, y);
      return has_scrolled;
    };

    return ScrollBarProxy;

  })();

  TableView = (function() {
    TableView.prototype.readRequiredParameter = function(parameters, k, default_value) {
      if (parameters[k] == null) {
        if (default_value === void 0) {
          throw "Expected parameter <" + k + ">";
        } else {
          return this[k] = default_value;
        }
      } else {
        return this[k] = parameters[k];
      }
    };

    function TableView(parameters) {
      var container,
        _this = this;
      container = parameters.container;
      if (container == null) {
        throw "container not specified.";
      }
      if (typeof container === "string") {
        this.container = document.querySelector(container);
      } else if (typeof container === "object") {
        this.container = container;
      } else {
        throw "Container must be a string or a dom element.";
      }
      this.readRequiredParameter(parameters, "painter", new Painter());
      this.readRequiredParameter(parameters, "autoSetup", true);
      this.readRequiredParameter(parameters, "model");
      this.readRequiredParameter(parameters, "nbRows");
      this.readRequiredParameter(parameters, "rowHeight");
      this.readRequiredParameter(parameters, "columnWidths");
      this.readRequiredParameter(parameters, "rowHeight");
      this.readRequiredParameter(parameters, "headerHeight");
      this.readRequiredParameter(parameters, "scrollBarVisible", true);
      this.readRequiredParameter(parameters, "enableDragMove", true);
      this.nbCols = this.columnWidths.length;
      if ((" " + this.container.className + " ").search(/\sfattable\s/) === -1) {
        this.container.className += " fattable";
      }
      this.H = this.rowHeight * this.nbRows;
      this.columnOffset = cumsum(this.columnWidths);
      this.W = this.columnOffset[this.columnOffset.length - 1];
      this.columns = {};
      this.cells = {};
      this.eventRegister = new EventRegister();
      this.getContainerDimension();
      if (this.autoSetup) {
        domReadyPromise.then(function() {
          return _this.setup();
        });
      }
    }
    TableView.prototype.getContainerDimension = function() {
      this.w = this.container.offsetWidth;
      this.h = this.container.offsetHeight - this.headerHeight;
      this.nbColsVisible = Math.min(smallest_diff_subsequence(this.columnOffset, this.w) + 2, this.columnWidths.length);
      return this.nbRowsVisible = Math.min((this.h / this.rowHeight | 0) + 2, this.nbRows);
    };

    TableView.prototype.leftTopCornerFromXY = function(x, y) {
      var i, j;
      i = bound(y / this.rowHeight | 0, 0, this.nbRows - this.nbRowsVisible);
      j = bound(binary_search(this.columnOffset, x), 0, this.nbCols - this.nbColsVisible);
      return [i, j];
    };

    TableView.prototype.cleanUp = function() {
      var _ref1;
      this.eventRegister.unbindAll();
      if ((_ref1 = this.ScrollBarProxy) != null) {
        _ref1.onScroll = null;
      }
      this.painter.cleanUp(this);
      this.container.innerHTML = "";
      this.bodyContainer = null;
      return this.headerContainer = null;
    };

    TableView.prototype.setup = function() {
      var c, el, i, j, onScroll, _i, _j, _k, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6,
        _this = this;
      this.cleanUp();
      this.getContainerDimension();
      this.columns = {};
      this.cells = {};
      this.container.innerHTML = "";
      this.headerContainer = document.createElement("div");
      this.headerContainer.className += " fattable-header-container";
      this.headerContainer.style.height = this.headerHeight + "px";
      this.headerViewport = document.createElement("div");
      this.headerViewport.className = "fattable-viewport";
      this.headerViewport.style.width = this.w + "px";
      this.headerViewport.style.height = this.headerHeight + "px";
      this.headerContainer.appendChild(this.headerViewport);
      this.bodyContainer = document.createElement("div");
      this.bodyContainer.className = "fattable-body-container";
      this.bodyContainer.style.top = this.headerHeight + "px";
      this.bodyViewport = document.createElement("div");
      this.bodyViewport.className = "fattable-viewport";
      this.bodyViewport.style.width = this.w + "px";
      this.bodyViewport.style.height = this.h + "px";
      for (j = _i = _ref1 = this.nbColsVisible, _ref2 = this.nbColsVisible * 2; _i < _ref2; j = _i += 1) {
        for (i = _j = _ref3 = this.nbRowsVisible, _ref4 = this.nbRowsVisible * 2; _j < _ref4; i = _j += 1) {
          el = document.createElement("div");
          this.painter.setupCell(el);
          el.pending = false;
          el.style.height = this.rowHeight + "px";
          this.bodyViewport.appendChild(el);
          this.cells[i + "," + j] = el;
        }
      }
      for (c = _k = _ref5 = this.nbColsVisible, _ref6 = this.nbColsVisible * 2; _k < _ref6; c = _k += 1) {
        el = document.createElement("div");
        el.style.height = this.headerHeight + "px";
        el.pending = false;
        this.painter.setupHeader(el);
        this.columns[c] = el;
        this.headerViewport.appendChild(el);
      }
      this.firstVisibleRow = this.nbRowsVisible;
      this.firstVisibleColumn = this.nbColsVisible;
      this.display(0, 0);
      this.container.appendChild(this.bodyContainer);
      this.container.appendChild(this.headerContainer);
      this.bodyContainer.appendChild(this.bodyViewport);
      this.refreshAllContent();
      this.scroll = new ScrollBarProxy(this.bodyContainer, this.headerContainer, this.W, this.H, this.eventRegister, this.scrollBarVisible, this.enableDragMove);
      onScroll = function(x, y) {
        var cell, col, _, _ref7, _ref8, _ref9;
        _ref7 = _this.leftTopCornerFromXY(x, y), i = _ref7[0], j = _ref7[1];
        _this.display(i, j);
        _ref8 = _this.columns;
        for (_ in _ref8) {
          col = _ref8[_];
          col.style[prefixedTransformCssKey] = "translate(" + (col.left - x) + "px, 0px)";
        }
        _ref9 = _this.cells;
        for (_ in _ref9) {
          cell = _ref9[_];
          cell.style[prefixedTransformCssKey] = "translate(" + (cell.left - x) + "px," + (cell.top - y) + "px)";
        }
        clearTimeout(_this.scrollEndTimer);
        _this.scrollEndTimer = setTimeout(_this.refreshAllContent.bind(_this), 200);
        return _this.onScroll(x, y);
      };
      this.scroll.onScroll = onScroll;
      return onScroll(0, 0);
    };

    TableView.prototype.refreshAllContent = function(evenNotPending) {
      var cell, header, i, j, k, _fn, _i, _ref1, _ref2, _results,
        _this = this;
      if (evenNotPending == null) {
        evenNotPending = false;
      }
      _fn = function(header) {
        if (evenNotPending || header.pending) {
          return _this.model.getHeader(j, function(data) {
            header.pending = false;
            return _this.painter.fillHeader(header, data);
          });
        }
      };
      _results = [];
      for (j = _i = _ref1 = this.firstVisibleColumn, _ref2 = this.firstVisibleColumn + this.nbColsVisible; _i < _ref2; j = _i += 1) {
        header = this.columns[j];
        _fn(header);
        _results.push((function() {
          var _j, _ref3, _ref4, _results1,
            _this = this;
          _results1 = [];
          for (i = _j = _ref3 = this.firstVisibleRow, _ref4 = this.firstVisibleRow + this.nbRowsVisible; _j < _ref4; i = _j += 1) {
            k = i + "," + j;
            cell = this.cells[k];
            if (evenNotPending || cell.pending) {
              _results1.push((function(cell) {
                return _this.model.getCell(i, j, function(data) {
                  cell.pending = false;
                  return _this.painter.fillCell(cell, data);
                });
              })(cell));
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    TableView.prototype.onScroll = function(x, y) {};

    TableView.prototype.goTo = function(i, j) {
      var targetX, targetY;
      targetY = i != null ? this.rowHeight * i : void 0;
      targetX = j != null ? this.columnOffset[j] : void 0;
      return this.scroll.setScrollXY(targetX, targetY);
    };

    TableView.prototype.display = function(i, j) {
      this.headerContainer.style.display = "none";
      this.bodyContainer.style.display = "none";
      this.moveX(j);
      this.moveY(i);
      this.headerContainer.style.display = "";
      return this.bodyContainer.style.display = "";
    };

    TableView.prototype.moveX = function(j) {
      var cell, col_width, col_x, dest_j, dj, header, i, k, last_i, last_j, offset_j, orig_j, shift_j, _fn, _i, _j, _ref1,
        _this = this;
      last_i = this.firstVisibleRow;
      last_j = this.firstVisibleColumn;
      shift_j = j - last_j;
      if (shift_j === 0) {
        return;
      }
      dj = Math.min(Math.abs(shift_j), this.nbColsVisible);
      for (offset_j = _i = 0; _i < dj; offset_j = _i += 1) {
        if (shift_j > 0) {
          orig_j = this.firstVisibleColumn + offset_j;
          dest_j = j + offset_j + this.nbColsVisible - dj;
        } else {
          orig_j = this.firstVisibleColumn + this.nbColsVisible - dj + offset_j;
          dest_j = j + offset_j;
        }
        col_x = this.columnOffset[dest_j];
        col_width = this.columnWidths[dest_j] + "px";
        header = this.columns[orig_j];
        delete this.columns[orig_j];
        if (this.model.hasHeader(dest_j)) {
          this.model.getHeader(dest_j, function(data) {
            header.pending = false;
            return _this.painter.fillHeader(header, data);
          });
        } else if (!header.pending) {
          header.pending = true;
          this.painter.fillHeaderPending(header);
        }
        header.left = col_x;
        header.style.width = col_width;
        this.columns[dest_j] = header;
        _fn = function(cell) {
          if (_this.model.hasCell(i, dest_j)) {
            return _this.model.getCell(i, dest_j, function(data) {
              cell.pending = false;
              return _this.painter.fillCell(cell, data);
            });
          } else if (!cell.pending) {
            cell.pending = true;
            return _this.painter.fillCellPending(cell);
          }
        };
        for (i = _j = last_i, _ref1 = last_i + this.nbRowsVisible; _j < _ref1; i = _j += 1) {
          k = i + "," + orig_j;
          cell = this.cells[k];
          delete this.cells[k];
          this.cells[i + "," + dest_j] = cell;
          cell.left = col_x;
          cell.style.width = col_width;
          _fn(cell);
        }
      }
      return this.firstVisibleColumn = j;
    };

    TableView.prototype.moveY = function(i) {
      var cell, dest_i, di, j, k, last_i, last_j, offset_i, orig_i, row_y, shift_i, _fn, _i, _j, _ref1,
        _this = this;
      last_i = this.firstVisibleRow;
      last_j = this.firstVisibleColumn;
      shift_i = i - last_i;
      if (shift_i === 0) {
        return;
      }
      di = Math.min(Math.abs(shift_i), this.nbRowsVisible);
      for (offset_i = _i = 0; _i < di; offset_i = _i += 1) {
        if (shift_i > 0) {
          orig_i = last_i + offset_i;
          dest_i = i + offset_i + this.nbRowsVisible - di;
        } else {
          orig_i = last_i + this.nbRowsVisible - di + offset_i;
          dest_i = i + offset_i;
        }
        row_y = dest_i * this.rowHeight;
        _fn = function(cell) {
          if (_this.model.hasCell(dest_i, j)) {
            return _this.model.getCell(dest_i, j, function(data) {
              cell.pending = false;
              return _this.painter.fillCell(cell, data);
            });
          } else if (!cell.pending) {
            cell.pending = true;
            return _this.painter.fillCellPending(cell);
          }
        };
        for (j = _j = last_j, _ref1 = last_j + this.nbColsVisible; _j < _ref1; j = _j += 1) {
          k = orig_i + "," + j;
          cell = this.cells[k];
          delete this.cells[k];
          this.cells[dest_i + "," + j] = cell;
          cell.top = row_y;
          _fn(cell);
        }
      }
      return this.firstVisibleRow = i;
    };

    return TableView;

  })();

  fattable = function(params) {
    return new TableView(params);
  };

  ns = {
    TableModel: TableModel,
    TableView: TableView,
    Painter: Painter,
    PagedAsyncTableModel: PagedAsyncTableModel,
    SyncTableModel: SyncTableModel,
    bound: bound
  };

  for (k in ns) {
    v = ns[k];
    fattable[k] = v;
  }

  window.fattable = fattable;

}).call(this);
/*change
change 
change 
change
change
chang
change
change
change
change
change
change
change
change
change
change
change







change
*/
var columnWidths = [
        30, 199, 199, 199
    ];

    var painter = new fattable.Painter();
    painter.fillCell = function(cellDiv, data) {
        cellDiv.textContent = data.content;
        if (data.rowId % 2 == 0) {
            cellDiv.className = "even";
        }
        else {
            cellDiv.className = "odd";
        }
    }

    painter.fillCellPending = function(cellDiv, data) {
        cellDiv.textContent = "";
        cellDiv.className = "pending";
    }

 var tableData = new fattable.SyncTableModel();
    tableData.columnHeaders = ["Country Name", "Country Code", "Indicator Name", "Indicator Code", "1960", "1961", "1962", "1963", "1964", "1965", "1966", "1967", "1968", "1969", "1970", "1971", "1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013"];

    tableData.getHeaderSync = function(j) {
        if(j == 1)return "Date";
        else if (j == 2) return "Crop";
        else if(j == 3) return "Pounds";
        else if(j == 0) return "ID";
        else return undefined;
    }
    var table = fattable({
      "container": "#container",
      "model": tableData,
      "nbRows": textToArray(x.responseText).length - 1,
      "rowHeight": 35,
      "headerHeight": 40,
      "painter": painter,
      "columnWidths": columnWidths
    });
    console.log(x);
    x.open('GET', 'getcrop.php', false);
    x.send();
    var crop1 = textToArray(x.responseText);
    x.open('GET', 'getday.php', false);
    x.send();
    var day1 = textToArray(x.responseText);
    x.open('GET', 'getpounds.php', false);
    x.send();
    var pounds1 = textToArray(x.responseText)
    x.open('GET', 'getid.php',  false);
    x.send();
    ids = textToArray(x.responseText);
    console.log(ids);
    tableData.getCellSync = function(r,c) {
      if(c == 1) {
        return {
            "content": day1[r],
            "rowId": r
        }
      }
      if(c == 2) {
        return {
            "content": crop1[r],
            "rowId": r
        }
      }
      if(c == 3) {
        return {
            "content": pounds1[r],
            "rowId": r
        }
      }
      if(c == 0) {
        return {
            "content": r + 1,
            "rowId": r
        }
      }
    }

    window.onresize = function() {
        table.setup();
    }
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-38194295-1']);
    _gaq.push(['_trackPageview']);
/*!
 * @autofe/carpicker v0.2.0
 * (c) 2018 Autohome Inc.
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
	typeof define === 'function' && define.amd ? define(['jquery'], factory) :
	(global.AutoFE = global.AutoFE || {}, global.AutoFE.Carpicker = factory(global.jQuery));
}(this, (function ($) { 'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

var NAME = 'carpicker';
var DATA_KEY = 'fe.carpicker';
var EVENT_KEY = '.' + DATA_KEY;
var DATA_API_KEY = '.data-api';
var JQUERY_NO_CONFLICT = $.fn[NAME];
// const ESCAPE_KEYCODE = 27;

var Event = {
  INIT: 'init' + EVENT_KEY,
  SHOW: 'show' + EVENT_KEY,
  SHOWN: 'shown' + EVENT_KEY,
  HIDE: 'hide' + EVENT_KEY,
  HIDDEN: 'hidden' + EVENT_KEY,
  CHANGE: 'change' + EVENT_KEY,
  CLICK: 'click' + EVENT_KEY,
  CLICK_DISMISS: 'click.dismiss' + EVENT_KEY,
  CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY
};

var Selector = {
  DATA_TOGGLE: '[data-toggle="carpicker"]',
  DATA_VALUE: '[data-value]'
};

var Attr = {
  DATA_TEXT: 'data-text',
  DATA_VALUE: 'data-value'
};

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

function Carpicker(elem, options) {
  this.options = $.extend({}, Carpicker.Default, options);
  this.$elem = $(elem);
  this.$picker = $(this.options.selectPicker, this.$elem);
  this.$value = $(this.options.selectValue, this.$elem);
  this.$dropdown = $(this.options.selectDropdown, this.$elem);
  this.$brand = $(this.options.selectBrand, this.$elem);
  this.$series = $(this.options.selectSeries, this.$elem);
  this.$spec = $(this.options.selectSpec, this.$elem);
  this.$level = this.options.selectLevel;

  this.isActive = false;

  this._data = null;
  this._brandData = null;

  this._init();
}

Carpicker.Default = {
  selectPicker: '[data-select-picker]',
  selectValue: '[data-select-value]',
  selectDropdown: '[data-select-dropdown]',
  selectBrand: '[data-select-brand]',
  selectSeries: '[data-select-series]',
  selectSpec: '[data-select-spec]',
  selectedClass: 'selected',
  disabledClass: 'disabled',
  activeClass: 'active',
  selectNav: false,
  selectLevel: 'brand',
  onInitPicker: null,
  onBrandPicker: null,
  onSeriesPicker: null,
  onSpecPicker: null
};

Carpicker.prototype._init = function () {
  var that = this;

  that.$elem.trigger(Event.INIT, that);

  that.$picker.on(Event.CLICK, $.proxy(that.toggle, that));

  // 如果设置了品牌车系车型导航，创建导航并绑定点击事件
  if (that.options.selectNav) {
    if (that.$brand.prev('ul.pop-nav').length == 0) {
      that.$brand.parent().prepend('<ul class="pop-nav"></ul>');
    }
    that.$dropdown.on(Event.CLICK, 'em', function () {
      var $item = $(this).parent();
      switch ($item.index()) {
        case 0:
          that.$brand.show();
          that.$series.hide();
          that.$spec.hide();
          that.$brand.prev('.pop-nav').html('<li><em>\u54C1\u724C</em></li>');
          break;
        case 1:
          that.$brand.hide();
          that.$series.show();
          that.$spec.hide();
          that.$brand.prev('.pop-nav').html('<li><em>\u54C1\u724C</em></li>\n          <li><span>&gt;</span><em>\u8F66\u7CFB</em></li>');
          break;
        case 2:
          break;
        default:
          break;
      }
      return false;
    });
  }

  that.$dropdown.on(Event.CLICK, Selector.DATA_VALUE, function () {
    var $item = $(this);
    var $target = $item.attr('data-target');

    // 点击品牌并触发对应回调函数
    if ($target === 'brand' && typeof that.options.onBrandPicker === 'function') {
      that.options.onBrandPicker($item.attr(Attr.DATA_VALUE), this);
    }
    // 点击车系并触发对应回调函数
    if ($target === 'series' && typeof that.options.onSeriesPicker === 'function') {
      that.options.onSeriesPicker($item.attr(Attr.DATA_VALUE), this);
    }
    // 点击车型并触发对应回调函数
    if ($target === 'spec' && typeof that.options.onSpecPicker === 'function' && !$item.hasClass('disabled')) {
      that.options.onSpecPicker($item.attr(Attr.DATA_VALUE), this);
    }

    // 设置最多选择到品牌参数时，点击品牌选中并收起下拉框
    if ($target === 'brand' && that.options.selectLevel == 'brand') {
      that.setValue({
        text: $item.attr(Attr.DATA_TEXT),
        value: $item.attr(Attr.DATA_VALUE)
      });
      that.hide();
    }
    // 车系
    if ($target === 'series' && (that.options.selectLevel == 'series' || that.options.selectLevel == 'spec' && !that.options.selectNav)) {
      that.setValue({
        text: $item.attr(Attr.DATA_TEXT),
        value: $item.attr(Attr.DATA_VALUE)
      });
      that.hide();
    }
    // 车型
    if ($target === 'spec' && !$item.hasClass('disabled')) {
      that.setValue({
        text: $item.attr(Attr.DATA_TEXT),
        value: $item.attr(Attr.DATA_VALUE)
      });
      that.hide();
    }
  });

  $(document).on(Event.CLICK_DISMISS, function (e) {
    var $parent = $(e.target).closest(that.$elem);
    if ($parent.length === 0 && that.isActive) {
      that.hide();
    }
  });

  if (typeof that.options.onInitPicker === 'function') {
    that._brandData = that.options.onInitPicker();
    that.setBrand();
  }
};

Carpicker.prototype.setValue = function (data) {
  var selectedClass = this.options.selectedClass;
  var old = this.getValue() || {};

  if (old.value !== data.value) {
    var $list = this.$dropdown.find(Selector.DATA_VALUE);
    var $item = this.$dropdown.find('[data-value="' + String(data.value) + '"]');

    $list.removeClass(selectedClass);
    $item.addClass(selectedClass);

    this.$value.text(data.text);

    this._data = {
      text: data.text,
      value: data.value
    };

    this.$elem.trigger(Event.CHANGE, [data, $item]);
  }
};

Carpicker.prototype.getValue = function () {
  return this._data;
};

Carpicker.prototype.toggle = function () {
  if (this.isActive) {
    this.hide();
  } else {
    this.show();
  }
};

Carpicker.prototype.show = function () {
  var activeClass = this.options.activeClass;
  var disabledClass = this.options.disabledClass;

  if (this.$elem.hasClass(disabledClass)) {
    return;
  }

  var showEvent = $.Event(Event.SHOW);

  this.$elem.trigger(showEvent, this);

  if (showEvent.isDefaultPrevented()) {
    return;
  }

  this.isActive = true;
  this.$elem.addClass(activeClass);
  this.$dropdown.show();
  this.$elem.trigger(Event.SHOWN, this);
};

Carpicker.prototype.hide = function () {
  var activeClass = this.options.activeClass;

  var hideEvent = $.Event(Event.HIDE);

  this.$elem.trigger(hideEvent, this);

  if (hideEvent.isDefaultPrevented()) {
    return;
  }

  this.isActive = false;
  this.$elem.removeClass(activeClass);
  this.$dropdown.hide();
  this.$elem.trigger(Event.HIDDEN, this);
};

Carpicker.prototype.disable = function () {
  var disabledClass = this.options.disabledClass;

  this.$elem.addClass(disabledClass);
};

Carpicker.prototype.enable = function () {
  var disabledClass = this.options.disabledClass;

  this.$elem.removeClass(disabledClass);
};

Carpicker.prototype.setBrand = function () {
  var that = this;

  if (that.options.selectNav) {
    that.$brand.prev('.pop-nav').html('<li><em>\u54C1\u724C</em></li>');
  }
  // 字母索引
  var alphabeta = [];
  that._brandData.forEach(function (elem) {
    if (!alphabeta.includes(elem.letter)) {
      alphabeta.push(elem.letter);
    }
  });
  if ($.trim(that.$brand.html()) === '') {
    var brandIndex = '<ol class="index">';
    var brandList = '<dl class="list">';
    for (var i = 0; i < alphabeta.length; i++) {
      // 左侧字母
      brandIndex += '<li data-target=\'jump-' + String(alphabeta[i]) + '\'>' + String(alphabeta[i]) + '</li>';
      // 右侧内容
      brandList += '<dt id=\'jump-' + String(alphabeta[i]) + '\'>' + String(alphabeta[i]) + '</dt>';
      that._brandData.forEach(function (brand) {
        if (brand.letter == alphabeta[i]) {
          brandList += '<dd data-value="' + String(brand.id) + '" \n            data-text="' + String(brand.name) + '" \n            ' + (brand.pinyin ? 'data-pinyin=' + String(brand.pinyin) : '') + '\n            data-target="brand">' + String(brand.name) + '</dd>';
        }
      });
    }
    brandIndex += '</ol>';
    brandList += '</dl>';
    that.$brand.html(brandIndex + brandList);
    that.setIndexLoca();
  }
  that.$brand.show();
};

Carpicker.prototype.setSeries = function (data, seriesItem) {
  var that = this;
  if (data.length > 0) {
    if (that.options.selectNav) {
      that.$brand.prev('.pop-nav').html('<li><em>\u54C1\u724C</em></li>\n      <li><span>&gt;</span><em>\u8F66\u7CFB</em></li>');
      that.$brand.hide();
    }
    that.$series.show();

    var seriesStr = '<dl class="list">';
    data.forEach(function (series, i) {
      // 全部车系项
      if (seriesItem && seriesItem.show && i == 0) {
        if (seriesItem.link) {
          seriesStr += '<dd><a class="all" href="' + String(seriesItem.url) + '" target="_blank">\u5168\u90E8\u8F66\u7CFB</a></dd>';
        } else {
          seriesStr += '<dd data-value="' + String(series.brandId) + '" data-text="\u5168\u90E8\u8F66\u7CFB" data-target="series">\u5168\u90E8\u8F66\u7CFB</dd>';
        }
      }
      seriesStr += '<dt>' + String(series.name) + '</dt>';
      series.list.forEach(function (item) {
        seriesStr += '<dd data-value="' + String(item.id) + '" \n          data-text="' + String(item.name) + '" \n          ' + (item.pinyin ? 'data-pinyin=' + String(item.pinyin) : '') + '\n          data-target="series">' + String(item.name) + '</dd>';
      });
    });
    seriesStr += '</dl>';
    that.$series.html(seriesStr);
    return;
  }
};

Carpicker.prototype.setSpec = function (data, selectSpec) {
  var that = this;

  if (that.options.selectNav) {
    that.$brand.prev('.pop-nav').html('<li><em>\u54C1\u724C</em></li>\n    <li><span>&gt;</span><em>\u8F66\u7CFB</em></li>\n    <li><span>&gt;</span><em>\u8F66\u578B</em></li>');
    that.$brand.hide();
    that.$series.hide();
  }
  that.$spec.show();
  var specStr = '<dl class="list">';
  if (data.length > 0) {
    data.forEach(function (item) {
      specStr += '<dt>' + String(item.name) + '</dt>';
      item.list.forEach(function (spec) {
        specStr += '<dd data-value="' + String(spec.id) + '" \n          data-text="' + String(spec.name) + '"\n          data-target="spec"\n          ' + (selectSpec && $.isArray(selectSpec) && selectSpec.includes(spec.id.toString()) ? 'class="disabled"' : '') + '>\n            ' + String(spec.name) + '\n            ' + (spec.price ? '<span>' + (spec.price > 0 ? (spec.price / 10000.0).toFixed(2) + '\u4E07' : '\u6682\u65E0') + '</span>' : '') + '\n          </dd>';
      });
    });
    specStr += '<dd></dd>';
  } else {
    specStr += '<dd>\u6682\u65E0\u76F8\u5173\u8F66\u578B</dd>';
  }
  specStr += '</dl>';
  that.$spec.html(specStr);
  return;
};

Carpicker.prototype.setIndexLoca = function () {
  var that = this;
  that.$brand.on(Event.CLICK, 'li[data-target^="jump"]', function () {
    $('.list', that.$brand).scrollTop(0);
    $(this).addClass('active').siblings().removeClass('active');
    var target = $(this).attr('data-target');
    var targetTop = $('dt#' + target, that.$brand).position("list").top;
    $('.list', that.$brand).scrollTop(targetTop);
  });
};

Carpicker.prototype.destroy = function () {
  this.$elem.removeData(DATA_KEY);

  this.$picker.off(Event.CLICK);
  this.$dropdown.off(Event.CLICK, Selector.DATA_VALUE);

  this.onInitPicker = null, this.onBrandPicker = null, this.onSeriesPicker = null, this.onSpecPicker = null;

  this._brandData = null, this.setValue({});
};

/**
 * ------------------------------------------------------------------------
 * Plugin Definition
 * ------------------------------------------------------------------------
 */

function Plugin(config) {
  return this.each(function () {
    var $this = $(this);
    var data = $this.data(DATA_KEY);
    var _config = $.extend({}, Carpicker.Default, $this.data(), typeof config === 'object' && config);
    if (!data) {
      data = new Carpicker(this, _config);
      $this.data(DATA_KEY, data);
    }

    if (typeof config === 'string') {
      if (typeof data[config] === 'undefined') {
        throw new TypeError('No method named "' + config + '"');
      }
      data[config]();
    }
  });
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

// TODO
// $(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (e) {
//   e.preventDefault();
//   e.stopPropagation();
//   Plugin.call($(this), 'toggle');
// });

$(function () {
  Plugin.call($(Selector.DATA_TOGGLE));
});

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */

$.fn[NAME] = Plugin;
$.fn[NAME].Constructor = Carpicker;
$.fn[NAME].noConflict = function () {
  $.fn[NAME] = JQUERY_NO_CONFLICT;
  return Plugin;
};

return Carpicker;

})));

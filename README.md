# Carpicker

## HTML

选择品牌、车系、车型下拉框有三种形式
* 品牌、车系、车型共用一个下拉框
* 品牌、车系共用一个下拉框，车型单独使用一个下拉框
* 品牌、车系、车型各自使用下拉框


```html
<!-- 品牌、车系、车型共用一个下拉框 -->
<div class="athm-select" id="js-select-simple" data-toggle="carpicker">
  <div class="athm-select__selected" data-select-picker>
    <span class="athm-select__text" data-select-value>选择品牌</span>
    <span class="athm-select__icon">
      <i class="athm-iconfont athm-iconfont-arrowdown"></i>
    </span>
  </div>
  <div class="athm-select__option" data-select-dropdown>
    <div class="pop-wrapper">
	  <!-- 区别主要在这里，剩下的工作就交给了样式实现 -->
      <div class="brand" data-select-brand></div>
      <div class="series" data-select-series></div>
      <div class="spec" data-select-spec></div>
    </div>
  </div>
</div>

<!-- 品牌、车系共用一个下拉框 -->
<div class="athm-select" id="js-select-brand" data-toggle="carpicker">
  <div class="athm-select__selected" data-select-picker>
    <span class="athm-select__text" data-select-value>选择品牌</span>
    <span class="athm-select__icon">
      <i class="athm-iconfont athm-iconfont-arrowdown"></i>
    </span>
  </div>
  <div class="athm-select__option" data-select-dropdown>
    <div class="pop-wrapper">
      <div class="brand" data-select-brand></div>
      <div class="series" data-select-series></div>
    </div>
  </div>
</div>

<!-- 品牌、车系、车型各自使用下拉框 -->
<div class="athm-select" id="js-select-brand" data-toggle="carpicker">
  <div class="athm-select__selected" data-select-picker>
    <span class="athm-select__text" data-select-value>选择品牌</span>
    <span class="athm-select__icon">
      <i class="athm-iconfont athm-iconfont-arrowdown"></i>
    </span>
  </div>
  <div class="athm-select__option" data-select-dropdown>
    <div class="pop-wrapper">
      <div class="brand" data-select-brand></div>
    </div>
  </div>
</div>
```

### JavaScript

因为选择品牌、车型、车系涉及到数据来源及数据结构，所以在调用的时候增加了一些配置项
* 首页，针对不同数据来源及数据结构，我们需要自己写方法获取数据及处理数据结构
* 在选择品牌及车系之后执行下一步的方法

```javascript
$('#select').carpicker(options);
```
```javascript
var dataCar = {
  getBrandData: function () {},
  getSeriesData: function () {},
  getSpecData: function () {}
}
$('#js-select-simple').carpicker({
  selectLevel: 'series',
  onInitPicker: dataCar.getBrandData,
  onBrandPicker: function (id) {
    dataCar.getSeriesData(id, function (data) {
      // 全部车系项
	  var seriesItem = {
	    'show': true,
	    'link': true,
	    'url': '//www.autohome.com.cn/'
	   }
	   obj.data('fe.carpicker').setSeries(data, seriesItem);
	})
  },	
  onSeriesPicker: function (id) {
    // code
  };
```

## Options

参数可以通过 data attributes 或者 JavaScript 两种方式来配置.

Name | Type | Default | Description
---- | ---- | ------- | -----------
selectPicker | string | `'[data-select-picker]'` | 触发容器
selectValue | string | `'[data-select-value]'` | 值容器
selectDropdown | string | `'[data-select-dropdown]'` | 下拉容器
selectedClass | string | `'selected'` | 选中选项使用的样式类.
disabledClass | string | `'disabled'` | 下拉框禁用状态样式类.
activeClass | string | `'active'` | 下拉框激活状态样式类.
selectLevel | string | `'brand'` | 选择到指定级 <br> `'brand'` `'series'` `'spec'`
selectNav | Boolean | `false` | 是否显示导航 <br> 为 true 会自动创建
onInitPicker | function | `null` | 初始化完成,用于渲染品牌数据
onBrandPicker | function | `null` | 选择品牌项执行
onSeriesPicker | function | `null` | 选择车系项执行
onSpecPicker | function | `null` | 选择车型项执行

## Methods

### `.carpicker(options)`

初始化当前 DOM 内容为一个下拉框, 可以接受参数进行配置.

```javascript
$('#select').carpicker({});
```

### `.carpicker('show')`

手动打开对话框.

```javascript
$('#select').carpicker('show');
```

### `.carpicker('hide')`

手动关闭对话框.

```javascript
$('#select').carpicker('hide');
```

### `.carpicker('toggle')`

手动打开或者关闭.

```javascript
$('#select').carpicker('toggle');
```

### `.carpicker('disable')`

禁用.

```javascript
$('#select').carpicker('disable');
```

### `.carpicker('enable')`

非禁用.

```javascript
$('#select').carpicker('enable');
```

### `.data('fe.carpicker').setValue({})`

设置值

### `.data('fe.carpicker').getValue()`

获取值

### `.data('fe.carpicker').setSeries(data)`

渲染车系数据并显示

### `.data('fe.carpicker').setSpec(data)`

渲染车型数据并显示


## Event

Event Type | Description
---------- | -----------
init.fe.carpicker | 下拉框初始化时触发.
show.fe.carpicker | 当 `show` 方法被调用, 此事件会立即触发.
shown.fe.carpicker | 下拉框已呈现完毕时触发.
hide.fe.carpicker | 当 `hide` 方法被调用, 此事件会立即触发.
hidden.fe.carpicker | 下拉框已隐藏完毕时触发.
change.fe.carpicker | 当值发生变化时触发. 回调函数接受参数为 `event` , 当前选项值 `data` (`{text: '', value: ''}`) 和当前选项 `$item` 。

```javascript
$('#select').on('show.fe.carpicker', function (e) {
  // 阻止下拉框打开
  e.preventDefault();
});
```

# End

Thanks to [Bootstrap](http://getbootstrap.com/)
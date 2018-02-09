# Changelog

## `0.2.0`

### Methods

* 增加 `destroy()` 方法

### Features

1.  获取数据时的参数调整
	* `id` `name`  `list` 为品牌、车系、车型必须参数，品牌多一个 `letter`
	* 品牌、车系的 `pinyin` 为可选参数
	* 车型的 `price` 为可选参数
2. 点击选项时增加了返回当前对象
	* `onBrandPicker()` 、`onSeriesPicker()`、 `onSpecPicker()` 增加了第 2 个参数 `self`
3. 「全部车系」配置 `URL` 调整为完整路径  
4. `setSpec(data, array)` 增加第二个参数，用于判断已经选择过的车型选项 `array` 必须为 数组 且数组元素为字符串形式的车型 id
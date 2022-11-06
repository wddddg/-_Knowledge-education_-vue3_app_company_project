### 自定义输入框

预约时间弹窗组件。

**使用方式：**

在 ``script`` 中引用组件 

```javascript
import xskCodeInput from "@/components/xsk-code-input/xsk-code-input";
export default {
    components: {xskCodeInput}
}
```

基本用法

```html
<xskCodeInput :value.sync="password" @confirm="inputConfirm"></xskCodeInput>
```

例子

```html
<xskCodeInput 
	:value.sync="password" 
	:width="84"
	:height="84"
	backgroundColor="#EDEDED"
	bold
	showVal
	:length="6"
	@confirm="inputConfirm">
</xskCodeInput>
```
```script

import xskCodeInput from '@/components/xsk-code-input/xsk-code-input';

export default {
	components: {
		xskCodeInput
	},
	data() {
		return {
			password: '',
		};
	},
	onLoad() {},
	methods: {
		inputConfirm() {
			console.log(this.password)
		},
	}
};

```


**属性说明：**

|属性名|类型|默认值	|说明|
|---|----|---|---|
|value|Number|''|绑定的值|
|width|Number,String|84|显示块的宽度|
|height|Number,String|84|显示块的高度|
|backgroundColor|String|#EDEDED|显示块的背景色|
|bold|Boolean|true|文字是否加粗|
|showVal|Boolean|false|是否显示输入内容|
|length|Number|6|输入框长度|


**事件说明：**

|事件称名|说明|返回参数|
|---|----|---|
|confirm|输入内容达到最大长度时触发此事件|
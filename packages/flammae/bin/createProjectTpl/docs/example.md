---
path: '/example-doc'
title: 'Example'
---

<div class='example-page'>

# Example

这是一个示例文档


## **[markdown语法](https://www.appinn.com/markdown/#p)**

# 这是 H1

## 这是 H2

### 这是 H3

#### 这是 H4

##### 这是 H5

###### 这是 H6
***


**这是加粗的文字**

*这是倾斜的文字*`

***这是斜体加粗的文字***

~~这是加删除线的文字~~

***

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
> 
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.

> ## 这是一个标题。
> 
> 1.   这是第一行列表项。
> 2.   这是第二行列表项。
> 
> 给出一些例子代码：
> 
>`console.log("hello world");`

***

-   红
-   黄
*   蓝
    *   带有引用的列表:
    > This is a blockquote
    > inside a list item.
***

这是一个 [链接](https://github.com/LiZ2z/flammae) 示例。

### · 按钮API


|名称|说明|类型|默认值|
|---|---|---|---|
|`htmlType`|等同于原生按钮的`type`属性|`string`|`button`|
|`type`|按钮类型。可选`primary`\|`dashed`\|`danger`或不设置|`string`|-|
|`size`|按钮尺寸。可选`large`\|`small`或不设置|`string`|-|
|`shape`|按钮形状。可选`circle`\|`square`或不设置|`string`|-|
|`disabled`|禁用按钮|`boolean`|`false`|

除了以上的API，其他所有可以传递给原生`button`元素的属性都有效，例如：`onClick`、`className`。



::: style
给Markdown引入样式
```javascript
require('./style.css')
```
:::

## 普通代码展示

```jsx
import React from 'react'
// class的类名必须为 Demo
class Demo extends React.Component {
    handleClick() {
        console.log('clicked')
    }
    render() {
        return (
            <div>
                <button onClick={this.handleClick.bind(this)}>click me!</button>
            </div>
        );
    }
}
```

## demo展示
::: 

```jsx
import React from 'react'
// class的类名必须为 Demo
class Demo extends React.Component {
    handleClick() {
        console.log('clicked')
    }
    render() {
        return (
            <div>
                <button onClick={this.handleClick.bind(this)}>click me!</button>
            </div>
        );
    }
}
```
:::

## 只展示demo，不显示代码
::: only

```jsx
import React from 'react'
// class的类名必须为 Demo
class Demo extends React.Component {
    handleClick() {
        console.log('clicked')
    }
    render() {
        return (
            <div>
                <button onClick={this.handleClick.bind(this)}>click me!</button>
            </div>
        );
    }
}
```
:::

</div>
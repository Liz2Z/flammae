# flammae
基于React的静态网页创建工具(markdown)

## 安装及使用

```cmd
npm install flammae -g
```

```cmd
flammae create <project-name>

cd <project-name>

flammae run dev
```


## 项目目录

项目目录一般为：
```
|-.theme
|-docs
|-flammae.config.js
```

#### `docs`
`docs`目录下的每个文件都会作为一个单独的页面进行处理，且都可以在文件的头部做信息的声明。

对于`.md`文件，需要在头部使用类似`yaml`语言的方式书写信息：
``` frontmatter
---
title: 'My first flammae page'
---
```


## **.md** 文件编写规范

### 为markdown引入样式

在markdown文件中这样写：
```
::: style
``` javascript
require('./style.css')
`` `
:::
```

### 代码演示
如果代码想要被演示（根据markdown中的代码块动态渲染内容，目前仅支持`jsx`），需要用`:::`将代码块包起来， 并在代码标识符（```）后加`lang`字符串 ，例如，我们想演示一个`React`组件，要像下面这样写：

```
:::
``` jsx
class Demo extends Component {
    ...code here
}
`` `
:::
```
这样，当加载到这个markdown文件时，解析器就会知道该代码片段需要展示出来，且需要使用能解析`jsx`语法的编译器（即flame的代码插件，flame默认提供针对`jsx`的解析插件）来处理这段代码。

注意，必须指定代码块的语言（上方的`jsx`），不然flame不知道用什么编译器来处理该段代码。

### 代码演示的指令

此外我们还可以在`:::`符号后面加入一些指令或说明，就像下面这样

```
::: only

这里是代码的一些说明
here is some note for code

``` jsx
class Demo extends Component {
    ...code here
}
`` `
:::
```

`:::`内部的内容（不包括代码块）将被当作对代码的说明传给插件。

`:::`后面的字符将被当作指令传递给插件，具体的指令由不同的插件规定。

如上所示，当我们使用了`only`指令，该段代码将只会被执行演示，而不会作为html渲染出来。


还可以通过flammae自带指令：`style`，为每个`.md`文件编写样式。
```
::: style
``` (可不用指定语言)
    require('./style.css')
`` `
:::
```


### `jsx`解析插件的规则

**class 的名称必须为 `Demo`。如果写成函数式的组件，那么函数名也必须为 `Demo`。**

假如我们有如下需要演示的代码（当然，要使用`:::`包裹住。）：

```jsx
import {Component} from 'react'
import {Button} from 'ui'
//   must be Demo
class Demo extends Component {
    handleClick() {
        console.log('clicked')
    }
    render() {
        return (
            <div>
                <Button onClick={this.handleClick.bind(this)}>click</Button>
                <Button>click</Button>
            </div>
        );
    }
}
```

## `flammae.config.js`的配置

_待续。。。_


## TODO: 
- 完善可配置项

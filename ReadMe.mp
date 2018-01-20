$console.log 'Markplus:', '{\n'                                                 // `$IDENT ...args` used to call the ident function with args
$console.log /1 /* `/N` will be replaced by next N lines after. */, '\n'
    Home: 'https://github.com/zhengxiaoyao0716/markplus',
$console.log/2, '\n'                                                            // if `/N` followed `IDENT` directly without white-space,
    '    Author:'                                                               // the execution result would be used instead of convert to string.
    "'github.com/zhengxiaoyao0716',"
$_ /4                                                                           // equals to `$void /4`, nothing would execute but next N lines was gone.
======== ======== ======== ======== ======== ======== ======== ========         // not equals to `$_/N` (without white-space), the latter will execute the codes.
(^_^) Those block only visible in source to make things looks tidiness.
======== ======== ======== ======== ======== ======== ======== ========

#hitokoto(...words) [...words][parseInt(Math.random() * words.length)]          // `#IDENT(...args) ...results` used to define a function, `()` can be omitted if no arguments.
#_lang /3                                                                       // you could use `#IDENT(...args) /N` to define a function composed by mutli-line functions.
    location.search.match(/lang=(\w+)/)                                         // `()` was omitted, for no arguments needed.
    (match) console.log(match), ['zh', 'en', 'jp'].indexOf(match && match[1])   // although `...results` allowed, only the last result will return.
    (index) arguments[index == -1 ? 0 : index] || arguments[0]
#lang/3                                                                         // `/N` followed `IDENT` directly without white-space,
    location.search.match(/lang=(\w+)/)                                         // the function defined below would be executed immediately.
    (match) ['zh', 'en', 'jp'].indexOf(match && match[1])
    (index) (...lines) => lines[index == -1 ? 0 : index] || lines[0]            // the last return is a function, and this would be assigned to the `IDENT`.
#version/Markplus.version                                                       // `#IDENT/value` means `#IDENT/0 value`, you can use this to define constant.
$console.log(console, '    version:')/1, '}\n'                                  // `$IDENT(this, ...thisArgs) ...args` equals to `$IDENT.bind(this, ...thisArgs)(...Args)`.
    `'${version}',\n`                                                           // for `/N` followed `$IDENT(...args)` directly, 'v0.0.1' was used, instead of 'version'.
$_/'equals to `$_/0 ...`'                                                       // notice that the `...args` will be execute for `/N` followed `IDENT` directly without white-space.
$_ /:120                                                                        // `/:n` = `/N` , N = n - 25
The codes above is equivalent to those:
``` javascript
    // L1
    console.log(
        'Markplus:', '{\n'                                                 // `$IDENT ...args` used to call the ident function with args
    );
    // L2
    console.log(
        "    Home: 'https://github.com/zhengxiaoyao0716/markplus'," /* `/N` will be replaced by next N lines after. */, '\n'
    );
    // L4
    _L5 = (
        '    Author:'                                                               // the execution result would be used instead of convert to string.
    )
    _L6 = (
        "'github.com/zhengxiaoyao0716',"
    )
    console.log(
        _L5,
        _L6, '\n'                                                            // if `/N` followed `IDENT` directly without white-space,
    );
    // L7
    void(
        "======== ======== ======== ======== ======== ======== ======== ========         // not equals to `$_/N` (without white-space), the latter will execute the codes.",
        "(^_^) Those block only visible in source to make things looks tidiness.",
        "======== ======== ======== ======== ======== ======== ======== ========",
        ""                                                                           // equals to `$void /4`, nothing would execute but next N lines was gone.
    );

    // L12
    const hitokoto = function (
        ...words
    ) { return (
        [...words][parseInt(Math.random() * words.length)]          // `#IDENT(...args) ...results` used to define a function, `()` can be omitted if no arguments.
    ); };
    // L13
    const lang = function () {
        let result;
        result = (() => (
            location.search.match(/lang=(\w+)/)                                         // `()` was omitted, for no arguments needed.
        ))(result);
        result = ((match) => (
            console.log(match), ['zh', 'en', 'jp'].indexOf(match && match[1])   // although `...results` allowed, only the last result will return.
        ))(result);
        result = ((index) => (
            arguments[index == -1 ? 0 : index] || arguments[0]
        ))(result);
        return (
            result                                                                       // you could use `#IDENT(...args) /N` to define a function composed by mutli-line functions.
        );
    };
    // L17
    _lang = function () {
        let result;
        result = (() => (
            location.search.match(/lang=(\w+)/)                                         // the function defined below would be executed immediately.
        ))(result);
        result = ((match) => (
            ['zh', 'en', 'jp'].indexOf(match && match[1])
        ))(result);
        result = ((index) => (
            (...lines) => lines[index == -1 ? 0 : index] || lines[0]            // the last return is a function, and this would be assigned to the `IDENT`.
        ))(result);
        return (
            result                                                                         // `/N` followed `IDENT` directly without parentheses-params and white-space
        );
    };
    const lang = _lang();
    // L21
    _version = function () { return (
        'v0.0.1'                                                               // `#IDENT/value` means `#IDENT/0 value`, you can use this to define constant.
    ); };
    const version = _version();
    // L22
    _L23 = (
        `'${version}',\n`                                                           // for `/N` followed `$IDENT(...args)` directly, 'v0.0.1' was used, instead of 'version'.
    );
    console.log.bind(console, '    version:')(
        _L23, '}\n'                                  // `$IDENT(this, ...thisArgs) ...args` equals to `$IDENT.bind(this, ...thisArgs)(...Args)`.
    );
    // 24
    void(
        'equals to `$_/0 ...`'                                                       // notice that the `...args` will be execute for `/N` followed `IDENT` directly without white-space.
    );
    // L25
    void(
        ",,,"                                                                        // `/:n` = `/N` , N = n - 25
    )
```






# Markplus
$lang/2
## `Markdown` 的加强 [English?](?lang=en)
## The strengthening of the `Markdown`. [中文版？](?lang=zh)

---
$lang/2
## 用法
## Usage
``` bash
npm i --save-dev markplus
./node_modules/.bin/markplus -h
```

---
$lang/2
## 插件
## Plugin
### Via `.markplusrc`:
``` json
{ "plugin": ["PLUGIN_NAME"] }
```
$lang/2
`Markplus` 会自动加载 `.markplusrc`。
Then Markplus will auto load `.markplusrc`.

### Via `*rc` , `*.json`:
$lang/2
与 `.markplusrc` 类似，但你需要用 `markplus -c <config.json> ...` 来加载它。
Similar to `.markplusrc`, but you need use `markplus -c <config.json> ...` to load it.

### Via `JavaScript`:
``` nodejs
exports.default = { plugin: [require('./MARKPLUS_PLUGIN_MODULE').default] };
```
$lang/2
然后通过 `markplus -c <config.js> ...` 来加载它.
Then use `markplus -c <config.js> ...` to load it.

$lang/2
### 带参数的配置:
### Config with arguments:
``` javascript
const config = {
    plugin: [
        ["PLUGIN_NAME" || require('PLUGIN_MODULE'), ...PLUGIN_ARGS]
    ]
};
```


$_ /:179







$lang/60
$Array/29
## 基础目标
### 更完善的工具链
易用，易扩展

### 加强表格
混合单元格，宏计算

### 更清晰的语义
何时换行，何时滚动

### 动态交互
可选、可配置并且安全的动态演出

### 合理的结构
可复用，可继承

### 使用灵活
预编译、运行时渲染

### 但是，一切的前提是：保持简单

$_ /99 // since the parent `$lang/60` only accept 60 lines, this would not closed. but it useful in this case that we only want to hide the redundant lines.







$Array/29
## Base goal
### More perfect tool chain.
Easy to embedded, Convenient extension.

### Strengthing for `Table` .
Multi-unit-grid, Macro calculate.

### Clearer semantics.
When to break line, When to scroll.

### Dynamic interactivity.
Optional\ configurable and safety dynamic perform.

### Reasonable structure.
Reusable, Inheritable.

### Flexible usage.
Precompiled\ Runtime-render.

### But, All the premises: Keep Simple.

$_ /99







$Array.prototype.fill(new Array(3))/1
---

$hitokoto/6 // since empty line could mark the end of `Block`, it would be used as an argument of `hitokoto/2`. so we should use `>` to mark the end.
> 我的个性签名：
>> 爱冷剑，怜悲箫，月下狼孤啸；轻点画，慢勾描，云中人逍遥。
>
> 我的GitHub：
>> https://github.com/zhengxiaoyao0716
>

***
#remoteHitokoto(url) /4.then(content => `<span class="Block">${content}</span>`)
    'a'.charCodeAt(0) + parseInt(Math.random() * 4)
    (charCode) String.fromCharCode(charCode)
    (type) `${url}?c=${type}`
    (url) fetch(url).then(r => r.json()).then(({ hitokoto, from }) => `${hitokoto} --from: ${from}`)
$lang/3
#### 每日一言
#### Daily words
#### ひとこと
$remoteHitokoto 'https://sslapi.hitokoto.cn/'
